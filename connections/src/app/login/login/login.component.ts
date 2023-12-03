import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { passwordValidator } from 'src/app/registration/validators/password-validator';
import { LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { notFoundErrorValidator } from '../validators/not-found.validator';
import { emailTakenValidator } from 'src/app/registration/validators/last-email.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isSubmitting: boolean = false;
  lastFailedEmail: string | null = null;
  lastFailedPassword: string | null = null;
  notFoundErrorOccurred: boolean = false;
  loginForm!: FormGroup;
  private formChangeSubscription: Subscription = new Subscription();
  

  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        emailTakenValidator(this.lastFailedEmail),
        notFoundErrorValidator(this.notFoundErrorOccurred),
      ]),
      password: new FormControl('', [
        Validators.required,
        passwordValidator(),
        notFoundErrorValidator(this.notFoundErrorOccurred),
      ]),
    });
    if (this.loginForm) {
      this.formChangeSubscription.add(this.loginForm
        .get('email')!
        .valueChanges.subscribe((value) => {
          this.updateNotFoundFlag();
        }));

      this.formChangeSubscription.add(this.loginForm
        .get('password')!
        .valueChanges.subscribe((value) => {
          this.updateNotFoundFlag();
        }));
    }
  }

  private updateNotFoundFlag() {
    const currentEmail = this.loginForm.get('email')?.value;
    const currentPassword = this.loginForm.get('password')?.value;

    const newNotFoundErrorOccurred =
      currentEmail === this.lastFailedEmail &&
      currentPassword === this.lastFailedPassword;

    if (newNotFoundErrorOccurred !== this.notFoundErrorOccurred) {
      this.notFoundErrorOccurred = newNotFoundErrorOccurred;

      this.loginForm
        .get('email')
        ?.setValidators([
          Validators.required,
          Validators.email,
          notFoundErrorValidator(this.notFoundErrorOccurred),
        ]);
      this.loginForm
        .get('password')
        ?.setValidators([
          Validators.required,
          passwordValidator(),
          notFoundErrorValidator(this.notFoundErrorOccurred),
        ]);

      this.loginForm.get('email')?.updateValueAndValidity({ emitEvent: false });
      this.loginForm
        .get('password')
        ?.updateValueAndValidity({ emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.formChangeSubscription.unsubscribe();  
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.loginService.login(this.loginForm.value).subscribe({
        next: (responce) => {
          this.snackBar.open('Logged in successfully', 'Close', {
            duration: 3000,
          });
          console.log(responce);
        },
        error: (err) => {
          if (err.error.type === 'NotFoundException') {
            this.lastFailedEmail = this.loginForm.value.email;
            this.lastFailedPassword = this.loginForm.value.password;
            this.notFoundErrorOccurred = true;
            this.loginForm
              .get('email')
              ?.setValidators([
                Validators.required,
                Validators.email,
                notFoundErrorValidator(this.notFoundErrorOccurred),
              ]);
            this.loginForm
              .get('password')
              ?.setValidators([
                Validators.required,
                passwordValidator(),
                notFoundErrorValidator(this.notFoundErrorOccurred),
              ]);
            this.loginForm.get('email')?.updateValueAndValidity();
            this.loginForm.get('password')?.updateValueAndValidity();
            console.log('NotFoundException error returned');
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
