import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CPropertiesService } from './c-properties.service';
import { CProperty } from './models/c-property.model';
import { CreateCPropertyInput } from './inputs/create-c-property.input';
import { UpdateCPropertyInput } from './inputs/update-c-property.input';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { Category } from '../categories/models/category.model';

@Resolver(() => CProperty)
@UseGuards(GqlAdminGuard)
export class CPropertiesResolver {
  public constructor(private cPropertiesService: CPropertiesService) {}

  @Mutation(() => Category)
  @UsePipes(ValidationPipe)
  public async createCProperties(
    @Args('createCPropertyInputs', { type: () => [CreateCPropertyInput] })
    createCPropertyInputs: CreateCPropertyInput[],
  ): Promise<Category> {
    return this.cPropertiesService.createCProperties(createCPropertyInputs);
  }

  @Mutation(() => Category)
  public async updateCProperty(
    @Args('id', ParseObjectIdPipe) id: string,
    @Args('updateCPropertyInput', ValidationPipe)
    updateCPropertyInput: UpdateCPropertyInput,
  ): Promise<Category> {
    return this.cPropertiesService.updateCProperty(id, updateCPropertyInput);
  }

  @Mutation(() => Category)
  public async deleteCProperty(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<Category> {
    return this.cPropertiesService.deleteCProperty(id);
  }
}
