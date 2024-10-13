import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { CPropertiesGroupsService } from './c-properties-groups.service';
import { CPropertiesGroup } from './models/c-properties-group.model';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { CreateCPropertiesGroupInput } from './inputs/create-c-properties-group.input';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { UpdateCPropertiesGroupInput } from './inputs/update-c-properties-group.input';
import { Deleted } from '../common/models/deleted.model';
import { ParseObjectIdArrayPipe } from '../common/pipes/parse-object-id-array/parse-object-id-array.pipe';

@Resolver(() => CPropertiesGroup)
@UseGuards(GqlAdminGuard)
export class CPropertiesGroupsResolver {
  public constructor(
    private cPropertiesGroupsService: CPropertiesGroupsService,
  ) {}

  @Query(() => [CPropertiesGroup], { name: 'allGroups' })
  public async getFilteredCPropertiesGroups(
    @Args('ids', { type: () => [String] }, ParseObjectIdArrayPipe)
    ids: string[],
  ): Promise<CPropertiesGroup[]> {
    return this.cPropertiesGroupsService.getFilteredCPropertiesGroups(ids);
  }

  @Query(() => [CPropertiesGroup], { name: 'groupsByCategoryId' })
  public async getCPGroupsByCategoryId(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<CPropertiesGroup[]> {
    return this.cPropertiesGroupsService.getCPGroupsByCategoryId(id);
  }

  @Mutation(() => [CPropertiesGroup])
  @UsePipes(ValidationPipe)
  public async createCPropertiesGroups(
    @Args('createCPropertiesGroupInputs', {
      type: () => [CreateCPropertiesGroupInput],
    })
    createCPropertiesGroupInputs: CreateCPropertiesGroupInput[],
  ): Promise<CPropertiesGroup[]> {
    return this.cPropertiesGroupsService.createCPropertiesGroups(
      createCPropertiesGroupInputs,
    );
  }

  @Mutation(() => CPropertiesGroup)
  public async updateCPropertiesGroup(
    @Args('id', ParseObjectIdPipe) id: string,
    @Args('updateCPropertiesGroupInput', ValidationPipe)
    updateCPropertiesGroupInput: UpdateCPropertiesGroupInput,
  ): Promise<CPropertiesGroup> {
    return this.cPropertiesGroupsService.updateCPropertiesGroup(
      id,
      updateCPropertiesGroupInput,
    );
  }

  @Mutation(() => Deleted)
  public async deleteCPropertiesGroup(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<Deleted> {
    return this.cPropertiesGroupsService.deleteCPropertiesGroup(id);
  }
}
