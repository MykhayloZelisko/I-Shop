import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop()
  public categoryName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, nullable: true })
  public parentId: string | null;

  @Prop()
  public level: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
