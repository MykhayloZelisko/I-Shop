import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DProperty {
  @Field({ description: 'Device property name' })
  public propertyName: string;

  @Field(() => [String], { description: 'Device properties values' })
  public value: string[];
}
