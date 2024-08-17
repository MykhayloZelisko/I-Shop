import { CreateCPropertyInput } from './create-c-property.input';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class UpdateCPropertyInput extends PickType(CreateCPropertyInput, [
  'propertyName',
]) {}
