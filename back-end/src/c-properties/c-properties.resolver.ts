import { Resolver, Mutation, Args, Query, ID } from '@nestjs/graphql';
import { CPropertiesService } from './c-properties.service';
import { CProperty } from './models/c-property.model';
import { CreateCPropertyInput } from './inputs/create-c-property.input';
import { UpdateCPropertyInput } from './inputs/update-c-property.input';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { Deleted } from '../common/models/deleted.model';
import { ParseObjectIdArrayPipe } from '../common/pipes/parse-object-id-array/parse-object-id-array.pipe';

@Resolver(() => CProperty)
@UseGuards(GqlAdminGuard)
export class CPropertiesResolver {
  public constructor(private cPropertiesService: CPropertiesService) {}

  @Query(() => [CProperty], { name: 'allProperties' })
  public async getFilteredCProperties(
    @Args('ids', { type: () => [ID] }, ParseObjectIdArrayPipe)
    ids: string[],
  ): Promise<CProperty[]> {
    return this.cPropertiesService.getFilteredCProperties(ids);
  }

  @Query(() => [CProperty], { name: 'propertiesByGroupsIds' })
  public async getCPropertiesByGroupsIds(
    @Args('ids', { type: () => [ID] }, ParseObjectIdArrayPipe)
    ids: string[],
  ): Promise<CProperty[]> {
    return this.cPropertiesService.getCPropertiesByGroupsIds(ids);
  }

  @Query(() => [CProperty], { name: 'propertiesByGroupId' })
  public async getCPropertiesByGroupId(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
  ): Promise<CProperty[]> {
    return this.cPropertiesService.getCPropertiesByGroupId(id);
  }

  @Mutation(() => [CProperty])
  @UsePipes(ValidationPipe)
  public async createCProperties(
    @Args('createCPropertyInputs', { type: () => [CreateCPropertyInput] })
    createCPropertyInputs: CreateCPropertyInput[],
  ): Promise<CProperty[]> {
    return this.cPropertiesService.createCProperties(createCPropertyInputs);
  }

  @Mutation(() => CProperty)
  public async updateCProperty(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
    @Args('updateCPropertyInput', ValidationPipe)
    updateCPropertyInput: UpdateCPropertyInput,
  ): Promise<CProperty> {
    return this.cPropertiesService.updateCProperty(id, updateCPropertyInput);
  }

  @Mutation(() => Deleted)
  public async deleteCProperty(
    @Args('id', { type: () => ID }, ParseObjectIdPipe) id: string,
  ): Promise<Deleted> {
    return this.cPropertiesService.deleteCProperty(id);
  }
}
