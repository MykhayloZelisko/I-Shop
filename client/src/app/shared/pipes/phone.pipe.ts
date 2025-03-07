import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
})
export class PhonePipe implements PipeTransform {
  public transform(value: string): string {
    if (value.length === 7) {
      const code = value.slice(0, 2);
      const part1 = value.slice(2, 5);
      const part2 = value.slice(5, 7);
      const part3 = value.slice(7);

      return `+380 (${code}) ${part1}-${part2}-${part3}`;
    }
    return '';
  }
}
