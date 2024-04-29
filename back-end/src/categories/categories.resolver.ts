import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.model';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryWithImageUrlInput } from './inputs/update-category-with-image-url.input';
import { UpdateCategoryWithImageFileInput } from './inputs/update-category-with-image-file.input';

@Resolver()
export class CategoriesResolver {
  public constructor(private categoriesService: CategoriesService) {}

  @Query(() => [Category], { name: 'catalog' })
  public async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Mutation(() => Category)
  @UseGuards(GqlAdminGuard)
  @UsePipes(ValidationPipe)
  public async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryInput);
  }

  @Mutation(() => [Category])
  @UseGuards(GqlAdminGuard)
  @UsePipes(ValidationPipe)
  public async addSubCategories(
    @Args('createCategoryInputs', { type: () => [CreateCategoryInput] })
    createCategoryInputs: CreateCategoryInput[],
  ): Promise<Category[]> {
    return this.categoriesService.addSubCategories(createCategoryInputs);
  }

  @Mutation(() => Category)
  @UseGuards(GqlAdminGuard)
  public async updateCategoryWithUrl(
    @Args('id') id: string,
    @Args('updateCategoryInput', ValidationPipe)
    updateCategoryInput: UpdateCategoryWithImageUrlInput,
  ): Promise<Category> {
    return this.categoriesService.updateCategoryWithUrl(
      id,
      updateCategoryInput,
    );
  }

  @Mutation(() => Category)
  @UseGuards(GqlAdminGuard)
  public async updateCategoryWithFile(
    @Args('id') id: string,
    @Args('updateCategoryInput', ValidationPipe)
    updateCategoryInput: UpdateCategoryWithImageFileInput,
  ): Promise<Category> {
    return this.categoriesService.updateCategoryWithFile(
      id,
      updateCategoryInput,
    );
  }

  @Mutation(() => [String])
  @UseGuards(GqlAdminGuard)
  public async deleteCategory(@Args('id') id: string): Promise<string[]> {
    return this.categoriesService.deleteCategory(id);
  }
}
