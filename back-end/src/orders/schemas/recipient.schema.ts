import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Recipient {
  @Prop()
  public firstName: string;

  @Prop()
  public lastName: string;

  @Prop({ default: '' })
  public patronymic: string;

  @Prop({ unique: true })
  public phone: string;
}
