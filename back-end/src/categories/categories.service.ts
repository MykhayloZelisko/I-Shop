import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Category as CategoryGQL } from './models/category.model';
import { CreateCategoryInput } from './inputs/create-category.input';
import { FilesService } from '../files/files.service';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { CPropertiesService } from '../c-properties/c-properties.service';
import { CPropertyDocument } from '../c-properties/schemas/c-property.schema';

@Injectable()
export class CategoriesService {
  public constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private filesService: FilesService,
    private cPropertiesService: CPropertiesService,
  ) {}

  public async getAllCategories(): Promise<CategoryGQL[]> {
    const categories = await this.categoryModel
      .find()
      .populate('properties')
      .exec();

    return categories.map((category: CategoryDocument) => ({
      id: category.id,
      parentId: category.parentId ? category.parentId.toString() : null,
      properties: category.properties.map((property: CPropertyDocument) => ({
        id: property.id,
        categoryId: property.categoryId.toString(),
        propertyName: property.propertyName,
      })),
      categoryName: category.categoryName,
      image: category.image,
      icon: category.icon,
      level: category.level,
    }));
  }

  public async getCategoryById(id: string): Promise<CategoryGQL> {
    const category = await this.categoryModel
      .findById(id)
      .populate('properties')
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      id: category.id,
      parentId: category.parentId ? category.parentId.toString() : null,
      properties: category.properties.map((property: CPropertyDocument) => ({
        id: property.id,
        categoryId: property.categoryId.toString(),
        propertyName: property.propertyName,
      })),
      categoryName: category.categoryName,
      image: category.image,
      icon: category.icon,
      level: category.level,
    };
  }

  public async deleteCategory(categoryId: string): Promise<string[]> {
    const category = await this.getCategoryById(categoryId);
    const subCategoriesIds = await this.findSubCategoriesIds(categoryId);
    // TODO: check subcategories and products. If a category cannot be deleted you should throw ForbiddenException
    for (const id of subCategoriesIds) {
      const deletedCategory = await this.categoryModel.findById(id).exec();
      if (deletedCategory && deletedCategory.image) {
        await this.filesService.removeImageFile(deletedCategory.image);
      }
      if (deletedCategory && deletedCategory.icon) {
        await this.filesService.removeImageFile(deletedCategory.icon);
      }
      await this.categoryModel.findByIdAndDelete(id).exec();
    }
    await this.cPropertiesService.deleteAllCPropertiesByCategoryId(category.id);
    return subCategoriesIds;
  }

  public async findSubCategoriesIds(categoryId: string): Promise<string[]> {
    const subCategories = await this.categoryModel
      .find({ parentId: categoryId })
      .exec();
    let result: string[] = [categoryId];

    for (const category of subCategories) {
      const subSubCategoriesIds = await this.findSubCategoriesIds(category.id);
      result = result.concat(subSubCategoriesIds);
    }

    return result;
  }

  public async findParentCategoriesIds(categoryId: string): Promise<string[]> {
    const result: string[] = [];
    let id: string | null = categoryId;
    do {
      const category = await this.getCategoryById(id);
      result.push(id);
      id = category.parentId;
    } while (id);
    return result;
  }

  public async createCategory(
    createCategoryInput: CreateCategoryInput,
  ): Promise<CategoryGQL> {
    const existedCategory = await this.categoryModel
      .findOne({
        parentId: createCategoryInput.parentId,
        categoryName: createCategoryInput.categoryName,
      })
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
      const category = await this.categoryModel.create({
        ...createCategoryInput,
        image: fileName,
        properties: [],
      });
      return {
        ...category.toObject(),
        parentId: category.parentId ? category.parentId.toString() : null,
      };
    } else if (
      !createCategoryInput.image &&
      !createCategoryInput.parentId &&
      createCategoryInput.icon
    ) {
      const fileName = await this.filesService.createImageFile(
        createCategoryInput.icon,
      );
      const category = await this.categoryModel.create({
        ...createCategoryInput,
        icon: fileName,
        properties: [],
      });
      return category.toObject();
    } else {
      throw new BadRequestException('Bad Request');
    }
  }

  public async addSubCategories(
    createCategoryInputs: CreateCategoryInput[],
  ): Promise<CategoryGQL[]> {
    const propertiesIds =
      await this.cPropertiesService.findCPropertiesIdsByCategoryId(
        createCategoryInputs[0].parentId as string,
      );
    if (propertiesIds.length) {
      throw new ConflictException(
        'A category cannot include properties and subcategories',
      );
    }

    const categoryNames = createCategoryInputs.map(
      (input) => input.categoryName,
    );

    const hasDuplicates = new Set(categoryNames).size !== categoryNames.length;

    if (hasDuplicates) {
      throw new ConflictException(
        'A category cannot have two child categories with the same name',
      );
    }

    const categories: CategoryGQL[] = [];
    for (const input of createCategoryInputs) {
      const category = await this.createCategory(input);
      categories.push(category);
    }
    return categories;
  }

  public async updateCategory(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<CategoryGQL> {
    const existedCategory = await this.getCategoryById(id);

    const foundCategory = await this.categoryModel
      .findOne({
        parentId: existedCategory.parentId,
        categoryName: updateCategoryInput.categoryName,
      })
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
        .populate('properties')
        .exec();

      if (!updatedCategory) {
        throw new NotFoundException('Category not found');
      }

      return {
        id: updatedCategory.id,
        parentId: updatedCategory.parentId
          ? updatedCategory.parentId.toString()
          : null,
        properties: updatedCategory.properties.map(
          (property: CPropertyDocument) => ({
            id: property.id,
            categoryId: property.categoryId.toString(),
            propertyName: property.propertyName,
          }),
        ),
        categoryName: updatedCategory.categoryName,
        image: updatedCategory.image,
        icon: updatedCategory.icon,
        level: updatedCategory.level,
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
        .populate('properties')
        .exec();

      if (!updatedCategory) {
        throw new NotFoundException('Category not found');
      }

      return {
        id: updatedCategory.id,
        parentId: updatedCategory.parentId
          ? updatedCategory.parentId.toString()
          : null,
        properties: updatedCategory.properties.map(
          (property: CPropertyDocument) => ({
            id: property.id,
            categoryId: property.categoryId.toString(),
            propertyName: property.propertyName,
          }),
        ),
        categoryName: updatedCategory.categoryName,
        image: updatedCategory.image,
        icon: updatedCategory.icon,
        level: updatedCategory.level,
      };
    } else {
      throw new BadRequestException('Bad Request');
    }
  }

  public async addPropertiesToCategory(
    categoryId: string,
    propertyIds: string[],
  ): Promise<CategoryGQL> {
    const category = await this.categoryModel
      .findByIdAndUpdate(
        categoryId,
        { $push: { properties: { $each: propertyIds } } },
        { new: true },
      )
      .populate('properties')
      .exec();
    if (!category) {
      throw new InternalServerErrorException(
        'Properties are not added to a category',
      );
    }
    return {
      id: category.id,
      parentId: category.parentId ? category.parentId.toString() : null,
      properties: category.properties.map((property: CPropertyDocument) => ({
        id: property.id,
        categoryId: property.categoryId.toString(),
        propertyName: property.propertyName,
      })),
      categoryName: category.categoryName,
      image: category.image,
      icon: category.icon,
      level: category.level,
    };
  }
}
