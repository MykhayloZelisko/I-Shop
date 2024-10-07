import { InputType, PickType } from '@nestjs/graphql';
import { CreateCPropertiesGroupInput } from './create-c-properties-group.input';

@InputType()
export class UpdateCPropertiesGroupInput extends PickType(
  CreateCPropertiesGroupInput,
  ['groupName'],
) {}
