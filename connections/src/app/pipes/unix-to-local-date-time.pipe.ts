import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixToLocalDateTime',
})
export class UnixToLocalDateTimePipe implements PipeTransform {
  transform(value: string): string {
    return new Date(Number(value)).toLocaleString();
  }
}
