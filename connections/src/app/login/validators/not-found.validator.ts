import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notFoundErrorValidator(notFoundErrorOccurred: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return notFoundErrorOccurred ? { notFoundError: true } : null;
  };
}

