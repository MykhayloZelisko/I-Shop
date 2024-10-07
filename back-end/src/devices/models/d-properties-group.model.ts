import { Field, ObjectType } from '@nestjs/graphql';
import { DProperty } from './d-property.model';

@ObjectType()
export class DPropertiesGroup {
  @Field({ description: 'Device properties group name' })
  public groupName: string;

  @Field(() => [DProperty], { description: 'Device properties list' })
  public properties: DProperty[];
}
