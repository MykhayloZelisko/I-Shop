import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Category as CategoryGQL } from './models/category.model';
import { CreateCategoryInput } from './inputs/create-category.input';
import { FilesService } from '../files/files.service';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { CPropertiesGroupsService } from '../c-properties-groups/c-properties-groups.service';
import { Deleted } from '../common/models/deleted.model';
import { DevicesService } from '../devices/devices.service';
import { TransactionsService } from '../common/services/transactions/transactions.service';

@Injectable()
export class CategoriesService {
  public constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private filesService: FilesService,
    private cPropertiesGroupsService: CPropertiesGroupsService,
    @Inject(forwardRef(() => DevicesService))
    private devicesService: DevicesService,
    private transactionsService: TransactionsService,
  ) {}

  public async getAllCategories(): Promise<CategoryGQL[]> {
    return this.transactionsService.execute<CategoryGQL[]>(async (session) => {
      const categories = await this.categoryModel
        .find()
        .session(session)
        .exec();

      return Promise.all(
        categories.map(async (category: CategoryDocument) => {
          const hasGroups =
            await this.cPropertiesGroupsService.hasCategoryGroups(
              category.id,
              session,
            );
          return {
            id: category.id,
            parentId: category.parentId ? category.parentId.toString() : null,
            categoryName: category.categoryName,
            image: category.image,
            icon: category.icon,
            level: category.level,
            hasGroups,
          };
        }),
      );
    });
  }

  public async getCategoryById(
    id: string,
    session: ClientSession,
  ): Promise<CategoryGQL> {
    const category = await this.categoryModel
      .findById(id)
      .session(session)
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const hasGroups = await this.cPropertiesGroupsService.hasCategoryGroups(
      category.id,
      session,
    );

    return {
      id: category.id,
      parentId: category.parentId ? category.parentId.toString() : null,
      categoryName: category.categoryName,
      image: category.image,
      icon: category.icon,
      level: category.level,
      hasGroups,
    };
  }

  public async deleteCategory(categoryId: string): Promise<Deleted> {
    return this.transactionsService.execute<Deleted>(async (session) => {
      const category = await this.getCategoryById(categoryId, session);
      const subCategoriesIds = await this.getSubCategoriesIds(
        categoryId,
        session,
      );
      const isCategoryUsed = await this.devicesService.checkCategory(
        categoryId,
        session,
      );

      if (isCategoryUsed) {
        throw new ForbiddenException(
          'This category is used in devices and cannot be deleted',
        );
      }

      for (const id of subCategoriesIds) {
        const deletedCategory = await this.categoryModel
          .findById(id)
          .session(session)
          .exec();
        if (deletedCategory && deletedCategory.image) {
          await this.filesService.removeImageFile(deletedCategory.image);
        }
        if (deletedCategory && deletedCategory.icon) {
          await this.filesService.removeImageFile(deletedCategory.icon);
        }
        await this.categoryModel.findByIdAndDelete(id).session(session).exec();
      }
      const ids =
        await this.cPropertiesGroupsService.deleteAllGroupsByCategoriesIds(
          subCategoriesIds,
          session,
        );
      if (category.parentId) {
        const parentCategory = await this.getCategoryById(
          category.parentId,
          session,
        );
        return {
          categoriesIds: subCategoriesIds,
          groupsIds: ids.groupsIds,
          propertiesIds: ids.propertiesIds,
          category: parentCategory,
          group: null,
        };
      }
      return {
        categoriesIds: subCategoriesIds,
        groupsIds: ids.groupsIds,
        propertiesIds: ids.propertiesIds,
        category: null,
        group: null,
      };
    });
  }

  public async getSubCategoriesIds(
    categoryId: string,
    session: ClientSession,
  ): Promise<string[]> {
    const subCategories = await this.categoryModel
      .find({ parentId: categoryId })
      .session(session)
      .exec();
    let result: string[] = [categoryId];

    for (const category of subCategories) {
      const subSubCategoriesIds = await this.getSubCategoriesIds(
        category.id,
        session,
      );
      result = result.concat(subSubCategoriesIds);
    }

    return result;
  }

  public async getParentCategoriesIds(
    categoryId: string,
    session: ClientSession,
  ): Promise<string[]> {
    const result: string[] = [];
    let id: string | null = categoryId;
    do {
      const category = await this.getCategoryById(id, session);
      result.push(id);
      id = category.parentId;
    } while (id);
    return result;
  }

  public async createCategory(
    createCategoryInput: CreateCategoryInput,
    session?: ClientSession,
  ): Promise<CategoryGQL> {
    if (!session) {
      return this.transactionsService.execute<CategoryGQL>(
        async (newSession) => {
          return this.createCategory(createCategoryInput, newSession);
        },
      );
    }

    const existedCategory = await this.categoryModel
      .findOne({
        parentId: createCategoryInput.parentId,
        categoryName: createCategoryInput.categoryName,
      })
      .session(session)
      .exec();

    if (existedCategory) {
      if (existedCategory.parentId) {
        throw new ConflictException(
          'A category cannot have two child categories with the same name',
        );
      } else {
        throw new ConflictException(
          'A category with the same name already exists',
        );
      }
    }

    if (
      createCategoryInput.image &&
      createCategoryInput.parentId &&
      !createCategoryInput.icon
    ) {
      const fileName = await this.filesService.createImageFile(
        createCategoryInput.image,
      );
      const [category] = await this.categoryModel.create(
        [
          {
            ...createCategoryInput,
            image: fileName,
          },
        ],
        { session },
      );
      return {
        ...category.toObject<CategoryGQL>(),
        parentId: category.parentId ? category.parentId.toString() : null,
        hasGroups: false,
      };
    } else if (
      !createCategoryInput.image &&
      !createCategoryInput.parentId &&
      createCategoryInput.icon
    ) {
      const fileName = await this.filesService.createImageFile(
        createCategoryInput.icon,
      );
      const [category] = await this.categoryModel.create(
        [
          {
            ...createCategoryInput,
            icon: fileName,
          },
        ],
        { session },
      );
      return {
        ...category.toObject<CategoryGQL>(),
        hasGroups: false,
      };
    } else {
      throw new BadRequestException('Bad Request');
    }
  }

  public async addSubCategories(
    createCategoryInputs: CreateCategoryInput[],
  ): Promise<CategoryGQL[]> {
    return this.transactionsService.execute<CategoryGQL[]>(async (session) => {
      const groupsIds =
        await this.cPropertiesGroupsService.getGroupsIdsByCategoryId(
          createCategoryInputs[0].parentId as string,
          session,
        );
      if (groupsIds.length) {
        throw new ConflictException(
          'A category cannot include properties groups and subcategories',
        );
      }

      const categoryNames = createCategoryInputs.map(
        (input) => input.categoryName,
      );

      const hasDuplicates =
        new Set(categoryNames).size !== categoryNames.length;

      if (hasDuplicates) {
        throw new ConflictException(
          'A category cannot have two child categories with the same name',
        );
      }

      const categories: CategoryGQL[] = [];
      for (const input of createCategoryInputs) {
        const category = await this.createCategory(input, session);
        categories.push(category);
      }
      return categories;
    });
  }

  public async updateCategory(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<CategoryGQL> {
    return this.transactionsService.execute<CategoryGQL>(async (session) => {
      const existedCategory = await this.getCategoryById(id, session);

      const foundCategory = await this.categoryModel
        .findOne({
          parentId: existedCategory.parentId,
          categoryName: updateCategoryInput.categoryName,
        })
        .session(session)
        .exec();

      if (foundCategory && foundCategory.id !== id) {
        if (existedCategory.parentId) {
          throw new ConflictException(
            'A category cannot have two child categories with the same name',
          );
        } else {
          throw new ConflictException(
            'A category with the same name already exists',
          );
        }
      }

      if (updateCategoryInput.image && existedCategory.parentId) {
        const fileName = await this.filesService.createImageFile(
          updateCategoryInput.image,
        );
        const oldImageName = existedCategory.image as string;
        await this.filesService.removeImageFile(oldImageName);
        const updatedCategory = await this.categoryModel
          .findByIdAndUpdate(
            id,
            { ...updateCategoryInput, image: fileName },
            { new: true },
          )
          .session(session)
          .exec();

        if (!updatedCategory) {
          throw new NotFoundException('Category not found');
        }

        const hasGroups = await this.cPropertiesGroupsService.hasCategoryGroups(
          updatedCategory.id,
          session,
        );

        return {
          id: updatedCategory.id,
          parentId: updatedCategory.parentId
            ? updatedCategory.parentId.toString()
            : null,
          categoryName: updatedCategory.categoryName,
          image: updatedCategory.image,
          icon: updatedCategory.icon,
          level: updatedCategory.level,
          hasGroups,
        };
      } else if (updateCategoryInput.icon && !existedCategory.parentId) {
        const fileName = await this.filesService.createImageFile(
          updateCategoryInput.icon,
        );
        const oldIconName = existedCategory.icon as string;
        await this.filesService.removeImageFile(oldIconName);
        const updatedCategory = await this.categoryModel
          .findByIdAndUpdate(
            id,
            { ...updateCategoryInput, icon: fileName },
            { new: true },
          )
          .session(session)
          .exec();

        if (!updatedCategory) {
          throw new NotFoundException('Category not found');
        }

        const hasGroups = await this.cPropertiesGroupsService.hasCategoryGroups(
          updatedCategory.id,
          session,
        );

        return {
          id: updatedCategory.id,
          parentId: updatedCategory.parentId
            ? updatedCategory.parentId.toString()
            : null,
          categoryName: updatedCategory.categoryName,
          image: updatedCategory.image,
          icon: updatedCategory.icon,
          level: updatedCategory.level,
          hasGroups,
        };
      } else {
        throw new BadRequestException('Bad Request');
      }
    });
  }
}
