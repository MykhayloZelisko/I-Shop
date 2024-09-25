import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class DProperty {
  @Prop()
  public propertyName: string;

  @Prop()
  public value: string;
}
