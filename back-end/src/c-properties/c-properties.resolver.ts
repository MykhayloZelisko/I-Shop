import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CPropertiesService } from './c-properties.service';
import { CProperty } from './models/c-property.model';
import { CreateCPropertyInput } from './inputs/create-c-property.input';
import { UpdateCPropertyInput } from './inputs/update-c-property.input';
import { UseGuards, UsePipes } from '@nestjs/common';
import { GqlAdminGuard } from '../common/guards/gql-admin/gql-admin.guard';
import { ValidationPipe } from '../common/pipes/validation/validation.pipe';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id/parse-object-id.pipe';
import { DeletedIds } from '../common/models/deleted-ids.model';

@Resolver(() => CProperty)
@UseGuards(GqlAdminGuard)
export class CPropertiesResolver {
  public constructor(private cPropertiesService: CPropertiesService) {}

  @Query(() => [CProperty], { name: 'allProperties' })
  public async getAllCProperties(): Promise<CProperty[]> {
    return this.cPropertiesService.getAllCProperties();
  }

  @Query(() => [CProperty], { name: 'propertiesById' })
  public async getCPropertiesByGroupId(
    @Args('id', ParseObjectIdPipe) id: string,
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
    @Args('id', ParseObjectIdPipe) id: string,
    @Args('updateCPropertyInput', ValidationPipe)
    updateCPropertyInput: UpdateCPropertyInput,
  ): Promise<CProperty> {
    return this.cPropertiesService.updateCProperty(id, updateCPropertyInput);
  }

  @Mutation(() => DeletedIds)
  public async deleteCProperty(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<DeletedIds> {
    return this.cPropertiesService.deleteCProperty(id);
  }
}
