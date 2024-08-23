import { InputType, OmitType } from '@nestjs/graphql';
import { CreateDPropertyInput } from './create-d-property.input';

@InputType()
export class UpdateDPropertyInput extends OmitType(CreateDPropertyInput, []) {}
