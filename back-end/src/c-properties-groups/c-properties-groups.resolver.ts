import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CPropertiesGroupsService } from './c-properties-groups.service';
import { CPropertiesGroup } from './models/c-properties-group.model';
import { Category } from '../categories/models/category.model';
import { CProperty } from '../c-properties/models/c-property.model';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { CreateCPropertiesGroupInput } from './inputs/create-c-properties-group.input';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { UpdateCPropertiesGroupInput } from './inputs/update-c-properties-group.input';

@Resolver(() => CPropertiesGroup)
@UseGuards(GqlAdminGuard)
export class CPropertiesGroupsResolver {
  public constructor(
    private cPropertiesGroupsService: CPropertiesGroupsService,
  ) {}

  @Mutation(() => Category)
  @UsePipes(ValidationPipe)
  public async createCPropertiesGroups(
    @Args('createCPropertiesGroupInputs', {
      type: () => [CreateCPropertiesGroupInput],
    })
    createCPropertiesGroupInputs: CreateCPropertiesGroupInput[],
  ): Promise<Category> {
    return this.cPropertiesGroupsService.createCPropertiesGroups(
      createCPropertiesGroupInputs,
    );
  }

  @Mutation(() => Category)
  public async updateCPropertiesGroup(
    @Args('id', ParseObjectIdPipe) id: string,
    @Args('updateCPropertiesGroupInput', ValidationPipe)
    updateCPropertiesGroupInput: UpdateCPropertiesGroupInput,
  ): Promise<Category> {
    return this.cPropertiesGroupsService.updateCPropertiesGroup(
      id,
      updateCPropertiesGroupInput,
    );
  }

  @Mutation(() => Category)
  public async deleteCPropertiesGroup(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<Category> {
    return this.cPropertiesGroupsService.deleteCPropertiesGroup(id);
  }

  @ResolveField(() => [CProperty])
  public async properties(
    @Parent() group: CPropertiesGroup,
  ): Promise<CProperty[]> {
    return group.properties;
  }
}
