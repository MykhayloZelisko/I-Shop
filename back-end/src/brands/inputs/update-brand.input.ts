import { CreateBrandInput } from './create-brand.input';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateBrandInput extends OmitType(CreateBrandInput, []) {}
