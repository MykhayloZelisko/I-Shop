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
    return categories.map((category) => category.toObject());
  }

  public async deleteCategory(categoryId: string): Promise<void> {
    const category = await this.categoryModel.findById(categoryId).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.deleteSubcategories(categoryId);
    await this.categoryModel.findByIdAndDelete(categoryId).exec();
  }

  private async deleteSubcategories(parentId: string): Promise<void> {
    const subcategories = await this.categoryModel.find({ parentId }).exec();
    for (const subcategory of subcategories) {
      await this.deleteSubcategories(subcategory._id.toString());
      await this.categoryModel.findByIdAndDelete(subcategory._id).exec();
    }
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
