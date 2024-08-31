import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Category } from '../../categories/models/category.model';
import { Brand } from '../../brands/models/brand.model';
import { DProperty } from './d-property.model';

@ObjectType()
export class Device {
  @Field(() => ID, { description: 'Unique identifier' })
  public id: string;

  @Field({ description: 'Device name' })
  public deviceName: string;

  @Field(() => Float, { description: 'Device price' })
  public price: number;

  @Field(() => Int, { description: 'Devices count' })
  public count: number;

  @Field(() => Float, { description: 'Device rating' })
  public rating: number;

  @Field(() => Int, { description: 'Votes count' })
  public votes: number;

  @Field(() => [String], { description: 'Device pictures links' })
  public images: string[];

  @Field(() => Category, { description: 'Device category' })
  public category: Category;

  @Field(() => [Category], { description: 'Device parent categories' })
  public categories: Category[];

  @Field(() => Brand, { description: 'Device brand' })
  public brand: Brand;

  @Field(() => [DProperty], { description: 'Device properties list' })
  public properties: DProperty[];
}
