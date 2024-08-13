import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Brand {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field({ description: 'Brand name' })
  public brandName: string;
}
