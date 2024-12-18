import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

export function requiredValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value || (typeof value === 'string' && !value.trim())) {
      return {
        required: `Поле обов'язкове для заповнення`,
      };
    }
    return null;
  };
}

export function minMaxLengthValidator(
  minLength: number | null,
  maxLength: number | null,
): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (minLength && maxLength) {
      if (value && (value.length < minLength || value.length > maxLength)) {
        return {
          minMaxLength: `Кількість символів повинна бути від ${minLength} до ${maxLength}`,
        };
      }
    } else if (minLength && !maxLength) {
      if (value && value.length < minLength) {
        return {
          minLength: `Кількість символів повинна бути не менша за ${minLength}`,
        };
      }
    } else if (!minLength && maxLength) {
      if (value && value.length > maxLength) {
        return {
          maxLength: `Кількість символів повинна бути не більша за ${maxLength}`,
        };
      }
    }
    return null;
  };
}

export function passwordPatternValidator(str: RegExp): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (value && !value.match(str)) {
      if (!value.match(/\d/)) {
        return {
          pattern: 'Пароль повинен містити хоча б одну цифру',
        };
      }
      if (!value.match(/[A-Z]/)) {
        return {
          pattern: 'Пароль повинен містити хоча б одну велику латинську літеру',
        };
      }
      if (!value.match(/[a-z]/)) {
        return {
          pattern: 'Пароль повинен містити хоча б одну малу латинську літеру',
        };
      }
      return {
        pattern: 'Пароль повинен містити хоча б один спецсимвол',
      };
    }
    return null;
  };
}

export function emailPatternValidator(str: RegExp): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value?.match(str)) {
      return {
        pattern: 'Не валідна адреса електронної пошти',
      };
    }
    return null;
  };
}

export function namePatternValidator(str: RegExp): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value?.match(str)) {
      return {
        pattern: `Не валідне ім'я/прізвище`,
      };
    }
    return null;
  };
}

export function phoneNumberValidator(str: RegExp): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value?.match(str)) {
      return {
        pattern: `Не валідний номер телефону`,
      };
    }
    return null;
  };
}

export function nonEmptyArrayValidator(arrayName: string): ValidatorFn {
  return (control: AbstractControl) => {
    switch (arrayName) {
      case 'images': {
        if (control instanceof FormArray && control.length === 0) {
          return {
            nonEmptyArray: 'Не вибрано жодного файла',
          };
        }
        break;
      }
      case 'groups': {
        if (control instanceof FormArray && control.length === 0) {
          return {
            nonEmptyArray: 'Категорія порожня',
          };
        }
        break;
      }
      case 'properties': {
        if (control instanceof FormArray && control.length === 0) {
          return {
            nonEmptyArray: 'Група порожня',
          };
        }
        break;
      }
      default: {
        return null;
      }
    }
    return null;
  };
}

export function maxArrayLengthValidator(max: number): ValidatorFn {
  return (control: AbstractControl) => {
    if (control instanceof FormArray && control.length > max) {
      return {
        maxArrayLength: `Кількість вибраних файлів перевищує ліміт (${max})`,
      };
    }
    return null;
  };
}

export function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = Number(control.value);
    if (!value || value <= 0) {
      return {
        pattern: `Значення повинно бути більше нуля`,
      };
    }
    return null;
  };
}

export function ratingValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = Number(control.value);
    if (!value || value <= 0) {
      return {
        pattern: `Необхідно виставити оцінку`,
      };
    }
    return null;
  };
}

export function intRangeValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    const min = -2147483648;
    const max = 2147483647;
    if (value < min || value > max) {
      return { outOfRange: 'Число не ціле або дуже велике' };
    }
    return null;
  };
}

export function showErrorMessage(control: AbstractControl): string {
  return control.errors ? Object.values(control.errors)[0] : null;
}
