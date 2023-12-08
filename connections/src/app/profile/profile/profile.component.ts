import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadProfile, updateProfileSuccess } from 'src/app/redux/actions/profile-fetch.action';
import { updateProfile } from 'src/app/redux/actions/profile-fetch.action';
import {
  selectProfile,
  selectProfileError,
} from 'src/app/redux/selectors/profile.selector';
import { nameValidator } from 'src/app/registration/validators/name.validator';
import { ProfileService } from '../service/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile$ = this.store.select(selectProfile);
  error$ = this.store.select(selectProfileError);
  isEditing = false;
  currentName = '';
  isLoading: boolean = false;

  profileForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, nameValidator()]),
  });
  constructor(
    private router: Router,
    private store: Store,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadProfile());

    this.error$.subscribe((error) => {
      if (error) {
        this.snackBar.open(error, 'Close', {
          duration: 6000,
        });
      }
    });

    this.actions$
      .pipe(ofType(updateProfileSuccess))
      .subscribe(() => this.handleUpdateSuccess());
  }

  onEdit(name: string) {
    this.currentName = name;
    this.isEditing = true;
    console.log(this.currentName);
  }

  onCancel() {
    this.isEditing = false;
    this.profileForm.reset();
  }

  onSave() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.profileForm.disable();
      const newName = this.profileForm.value.name;
      this.store.dispatch(updateProfile({ name: newName }));
    } else {
      this.profileForm.markAsTouched();
    }
  }

  handleUpdateSuccess() {
    this.isLoading = false;
    this.isEditing = false;
    this.profileForm.enable();
  }
}
