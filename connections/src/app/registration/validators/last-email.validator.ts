import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailTakenValidator(
  lastFailedEmail: string | null
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (!email) {
      return null;
    }

    return email === lastFailedEmail ? { emailTaken: true } : null;
  };
}
