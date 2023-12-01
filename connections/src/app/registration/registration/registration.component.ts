import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '../validators/password-validator';
import { AuthService } from '../services/auth.service';
import { RegistrationData } from './models/registration.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailTakenValidator } from '../validators/last-email.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {

  isSubmitting: boolean = false;
  lastFailedEmail: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  registrationForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        emailTakenValidator(this.lastFailedEmail),
      ],
    ],
    password: ['', [Validators.required, passwordValidator()]],
  });

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      this.authService.register(this.registrationForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Registration successful', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => {
          if (err.error.type === 'PrimaryDuplicationException') {
            this.lastFailedEmail = this.registrationForm.value.email;
            // After updating lastFailedEmail
            this.registrationForm
              .get('email')
              ?.setValidators([
                Validators.required,
                Validators.email,
                emailTakenValidator(this.lastFailedEmail),
              ]);
            this.registrationForm.get('email')?.updateValueAndValidity();
          }
          this.isSubmitting = false;
          this.snackBar.open(
            'Registration failed: ' + err.error.message,
            'Close',
            {
              duration: 3000,
            }
          );

          console.log(
            `Error messfae ${err.error.message}, Type: ${err.error.type}`
          );
        },
      });
    }
  }
}
