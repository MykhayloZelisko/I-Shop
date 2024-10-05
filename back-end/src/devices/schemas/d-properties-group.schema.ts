import { Prop, Schema } from '@nestjs/mongoose';
import { DProperty } from './d-property.schema';

@Schema({ _id: false })
export class DPropertiesGroup {
  @Prop()
  public groupName: string;

  @Prop({ type: [DProperty] })
  public properties: DProperty[];
}
