// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
// import { Role } from '../../roles/schemas/role.schema';
//
// export type DeviceDocument = HydratedDocument<Device>;
//
// @Schema()
// export class Device {
//   @Prop()
//   public firstName: string;
//
//   @Prop()
//   public lastName: string;
//
//   @Prop()
//   public phone: string;
//
//   @Prop()
//   public email: string;
//
//   @Prop()
//   public password: string;
//
//   @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Role' }] })
//   public roles: Role[];
// }
//
// export const DeviceSchema = SchemaFactory.createForClass(Device);
