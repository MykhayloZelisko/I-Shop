import {
  isBase64,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBase64', async: false })
export class IsBase64Validator implements ValidatorConstraintInterface {
  public validate(value: string): boolean {
    const base64Data = value.split(';base64,').pop() as string;
    return isBase64(base64Data);
  }

  public defaultMessage(): string {
    return 'Must be an image file in base64 string format';
  }
}

export function IsBase64(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBase64Validator,
    });
  };
}
