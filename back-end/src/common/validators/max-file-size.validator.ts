import {
  registerDecorator,
  ValidationArguments, ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'maxFileSize', async: false })
export class MaxFileSizeValidator implements ValidatorConstraintInterface {
  public validate(value: string, args: ValidationArguments): boolean {
    const base64Data = value.split(';base64,').pop() as string;
    const decodedData = Buffer.from(base64Data, 'base64');
    const maxSize = args.constraints[0];
    return decodedData.length <= maxSize;
  }

  public defaultMessage(args: ValidationArguments): string {
    const maxSize = args.constraints[0];
    return `file size must not exceed ${maxSize} KB`;
  }
}

export function MaxFileSize(
  maxSize: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [maxSize],
      validator: MaxFileSizeValidator,
    });
  };
}
