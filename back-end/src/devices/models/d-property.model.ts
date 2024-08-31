import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DProperty {
  @Field({ description: 'Device property name' })
  public propertyName: string;

  @Field({ description: 'Device property value' })
  public value: string;
}
