import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { GroupState } from 'src/app/redux/models/redux.models';
import * as GroupCreateActions from 'src/app/redux/actions/group-create.action';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-group-name-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './group-name-dialog.component.html',
  styleUrls: ['./group-name-dialog.component.scss'],
})
export class GroupNameDialogComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  isSubmitting = false;
  groupNameForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern(/^[\p{L}\d\s]*$/u),
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<GroupNameDialogComponent>,
    private store: Store<GroupState>,
    private actions$: Actions
  ) { }
  
  ngOnInit(): void {
    this.subscribeToCreateGroupSuccess();
    this.subscribeToCreateGroupFailure(); 
  }

  private subscribeToCreateGroupSuccess() {
    this.subscription.add(
      this.actions$
        .pipe(ofType(GroupCreateActions.createGroupSuccess))
        .subscribe(() => {
          this.isSubmitting = false;
          this.groupNameForm.enable();
          this.dialogRef.close();
        })
    );
  }

  private subscribeToCreateGroupFailure() {
    this.subscription.add(
      this.actions$
        .pipe(ofType(GroupCreateActions.createGroupFailure))
        .subscribe(() => {
          this.isSubmitting = false;
           this.groupNameForm.enable();
        })
    );
  }

  onSave() {
    if (this.groupNameForm.valid) {
        this.isSubmitting = true;
        this.groupNameForm.disable();
      const groupName = this.groupNameForm.get('name')?.value;
      if (groupName) {
        this.store.dispatch(
          GroupCreateActions.createGroup({
            requestBody: { name: groupName },
          })
        );
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
