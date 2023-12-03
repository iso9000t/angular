import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailTakenValidator(takenEmails: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (!email) {
      return null;
    }

    return takenEmails.includes(email) ? { emailTaken: true } : null;
  };
}
