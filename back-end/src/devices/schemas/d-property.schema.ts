import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class DProperty {
  @Prop()
  public name: string;

  @Prop()
  public value: string;
}
