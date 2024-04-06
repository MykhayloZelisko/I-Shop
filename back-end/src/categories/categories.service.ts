import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Category as CategoryGQL } from './models/category.model';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { CreateCategoryInput } from './inputs/create-category.input';

@Injectable()
export class CategoriesService {
  public constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
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
    await this.categoryModel
      .deleteMany({ _id: { $in: subCategoriesIds } })
      .exec();
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
    const category = await this.categoryModel.create(createCategoryInput);
    return category.toObject();
  }

  public async updateCategory(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<CategoryGQL> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryInput, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category.toObject();
  }
}
