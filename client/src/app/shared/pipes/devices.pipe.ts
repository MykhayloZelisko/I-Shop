import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'devices',
})
export class DevicesPipe implements PipeTransform {
  public transform(value: number): string {
    return value % 100 >= 11 && value % 100 <= 14
      ? `${value} товарів`
      : value % 10 === 1
        ? `${value} товар`
        : [2, 3, 4].includes(value % 10)
          ? `${value} товари`
          : `${value} товарів`;
  }
}
