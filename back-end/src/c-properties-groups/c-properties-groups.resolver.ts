import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { CPropertiesGroupsService } from './c-properties-groups.service';
import { CPropertiesGroup } from './models/c-properties-group.model';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { CreateCPropertiesGroupInput } from './inputs/create-c-properties-group.input';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { UpdateCPropertiesGroupInput } from './inputs/update-c-properties-group.input';
import { DeletedIds } from '../common/models/deleted-ids.model';

@Resolver(() => CPropertiesGroup)
@UseGuards(GqlAdminGuard)
export class CPropertiesGroupsResolver {
  public constructor(
    private cPropertiesGroupsService: CPropertiesGroupsService,
  ) {}

  @Query(() => [CPropertiesGroup], { name: 'allGroups' })
  public async getAllCPropertiesGroups(): Promise<CPropertiesGroup[]> {
    return this.cPropertiesGroupsService.getAllCPropertiesGroups();
  }

  @Query(() => [CPropertiesGroup], { name: 'groupsById' })
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

  @Mutation(() => DeletedIds)
  public async deleteCPropertiesGroup(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<DeletedIds> {
    return this.cPropertiesGroupsService.deleteCPropertiesGroup(id);
  }
}
