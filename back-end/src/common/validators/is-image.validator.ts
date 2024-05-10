import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isImage', async: false })
export class IsImageValidator implements ValidatorConstraintInterface {
  public validate(value: string): boolean {
    return value.startsWith('data:image');
  }

  public defaultMessage(): string {
    return 'Must be an image file';
  }
}

export function IsImage(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsImageValidator,
    });
  };
}
