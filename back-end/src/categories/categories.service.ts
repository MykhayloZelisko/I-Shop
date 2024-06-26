import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Category as CategoryGQL } from './models/category.model';
import { CreateCategoryInput } from './inputs/create-category.input';
import { FilesService } from '../files/files.service';
import { UpdateCategoryInput } from './inputs/update-category.input';

@Injectable()
export class CategoriesService {
  public constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private filesService: FilesService,
  ) {}

  public async getAllCategories(): Promise<CategoryGQL[]> {
    const categories = await this.categoryModel.find().exec();
    return categories.map((category: CategoryDocument) => ({
      ...category.toObject(),
      parentId: category.parentId ? category.parentId.toString() : null,
    }));
  }

  public async deleteCategory(categoryId: string): Promise<string[]> {
    const category = await this.categoryModel.findById(categoryId).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const subCategoriesIds = await this.findSubCategoriesIds(categoryId);
    // TODO: check subcategories. If a category cannot be deleted you should throw ForbiddenException
    for (const id of subCategoriesIds) {
      const deletedCategory = await this.categoryModel.findById(id).exec();
      if (deletedCategory && deletedCategory.image) {
        await this.filesService.removeImageFile(deletedCategory.image);
      }
      await this.categoryModel.findByIdAndDelete(id).exec();
    }
    return subCategoriesIds;
  }

  private async findSubCategoriesIds(categoryId: string): Promise<string[]> {
    const subCategories = await this.categoryModel
      .find({ parentId: categoryId })
      .exec();
    let result: string[] = [categoryId];

    for (const category of subCategories) {
      const subSubCategoriesIds = await this.findSubCategoriesIds(
        category._id.toString(),
      );
      result = result.concat(subSubCategoriesIds);
    }

    return result;
  }

  public async createCategory(
    createCategoryInput: CreateCategoryInput,
  ): Promise<CategoryGQL> {
    if (createCategoryInput.image && createCategoryInput.parentId) {
      const fileName = await this.filesService.createImageFile(
        createCategoryInput.image,
      );
      const category = await this.categoryModel.create({
        ...createCategoryInput,
        image: fileName,
      });
      return {
        ...category.toObject(),
        parentId: category.parentId ? category.parentId.toString() : null,
      };
    } else if (!createCategoryInput.image && !createCategoryInput.parentId) {
      const category = await this.categoryModel.create(createCategoryInput);
      return category.toObject();
    } else {
      throw new BadRequestException('Bad Request');
    }
  }

  public async addSubCategories(
    createCategoryInputs: CreateCategoryInput[],
  ): Promise<CategoryGQL[]> {
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
    const existedCategory = await this.categoryModel.findById(id).exec();

    if (!existedCategory) {
      throw new NotFoundException('Category not found');
    }

    if (updateCategoryInput.image) {
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
        .exec();

      if (!updatedCategory) {
        throw new NotFoundException('Category not found');
      }

      return {
        ...updatedCategory.toObject(),
        parentId: updatedCategory.parentId
          ? updatedCategory.parentId.toString()
          : null,
      };
    } else {
      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(
          id,
          {
            categoryName: updateCategoryInput.categoryName,
            image: existedCategory.image,
          },
          { new: true },
        )
        .exec();

      if (!updatedCategory) {
        throw new NotFoundException('Category not found');
      }

      return {
        ...updatedCategory.toObject(),
        parentId: updatedCategory.parentId
          ? updatedCategory.parentId.toString()
          : null,
      };
    }
  }
}
