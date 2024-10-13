import { Args, Query, Resolver } from '@nestjs/graphql';
import { CPropertiesGroupsService } from '../../../c-properties-groups/c-properties-groups.service';
import { CPropertiesService } from '../../../c-properties/c-properties.service';
import { GP } from '../../models/g-p.model';
import { ParseObjectIdPipe } from '../../pipes/parse-object-id/parse-object-id.pipe';
import { UseGuards } from '@nestjs/common';
import { GqlAdminGuard } from '../../guards/gql-admin/gql-admin.guard';

@Resolver()
export class CommonResolver {
  public constructor(
    private cPropertiesGroupsService: CPropertiesGroupsService,
    private cPropertiesService: CPropertiesService,
  ) {}

  @Query(() => GP, { name: 'GP' })
  @UseGuards(GqlAdminGuard)
  public async getGPByCategoryId(
    @Args('id', ParseObjectIdPipe) id: string,
  ): Promise<GP> {
    const groups =
      await this.cPropertiesGroupsService.getCPGroupsByCategoryId(id);
    const properties =
      await this.cPropertiesService.getCPropertiesByCategoryId(id);
    return { groups, properties };
  }
}
