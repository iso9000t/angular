import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    if (!password) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/\\-]/.test(
      password
    );
    const isLengthValid = password.length >= 8;

    const isValid =
      hasUpperCase && hasNumber && hasSpecialChar && isLengthValid;

    return isValid ? null : { passwordStrength: true };
  };
}
