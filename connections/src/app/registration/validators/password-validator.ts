import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    if (!password) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(password); // Check for uppercase
    const hasNumber = /\d/.test(password); // Check for digit
    // Updated regex pattern for special characters
    const hasSpecialChar = /[!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/\\-]/.test(
      password
    );
    const isLengthValid = password.length >= 8; // Check for length

    // Ensure all conditions are met
    const isValid =
      hasUpperCase && hasNumber && hasSpecialChar && isLengthValid;

    return isValid ? null : { passwordStrength: true };
  };
}
