import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class DeletedCartDevice {
  @Field(() => [ID], { description: 'Devices ids' })
  public ids: string[];

  @Field({ description: 'Must cart be deleted?' })
  public cart: boolean;
}
