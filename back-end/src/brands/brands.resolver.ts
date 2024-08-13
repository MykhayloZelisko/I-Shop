import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BrandsService } from './brands.service';
import { Brand } from './models/brand.model';
import { CreateBrandInput } from './inputs/create-brand.input';
import { UpdateBrandInput } from './inputs/update-brand.input';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';

@Resolver(() => Brand)
export class BrandsResolver {
  public constructor(private brandsService: BrandsService) {}

  @Mutation(() => Brand)
  @UseGuards(GqlAdminGuard)
  @UsePipes(ValidationPipe)
  public async createBrand(
    @Args('createBrandInput') createBrandInput: CreateBrandInput,
  ): Promise<Brand> {
    return this.brandsService.createBrand(createBrandInput);
  }

  @Query(() => [Brand], { name: 'brands' })
  @UseGuards(GqlAdminGuard)
  public async getAllBrands(): Promise<Brand[]> {
    return this.brandsService.getAllBrands();
  }

  @Mutation(() => Brand)
  @UseGuards(GqlAdminGuard)
  public async updateBrand(
    @Args('id', ParseObjectIdPipe) id: string,
    @Args('updateBrandInput', ValidationPipe)
    updateBrandInput: UpdateBrandInput,
  ): Promise<Brand> {
    return this.brandsService.updateBrand(id, updateBrandInput);
  }

  @Mutation(() => String)
  public async deleteBrand(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<string> {
    return this.brandsService.deleteBrand(id);
  }
}
