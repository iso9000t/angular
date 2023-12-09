import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[\p{L}\s]+$/u.test(control.value);
    return valid ? null : { invalidName: true };
  };
}
