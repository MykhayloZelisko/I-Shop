import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.model';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { CPropertiesGroup } from '../c-properties-groups/models/c-properties-group.model';

@Resolver(() => Category)
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
  public async updateCategory(
    @Args('id', ParseObjectIdPipe) id: string,
    @Args('updateCategoryInput', ValidationPipe)
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoriesService.updateCategory(id, updateCategoryInput);
  }

  @Mutation(() => [String])
  @UseGuards(GqlAdminGuard)
  public async deleteCategory(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<string[]> {
    return this.categoriesService.deleteCategory(id);
  }

  @ResolveField(() => [CPropertiesGroup])
  public async groups(
    @Parent() category: Category,
  ): Promise<CPropertiesGroup[]> {
    return category.groups;
  }
}
