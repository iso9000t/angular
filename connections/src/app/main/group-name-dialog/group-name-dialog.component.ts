import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { nameValidator } from 'src/app/registration/validators/name.validator';

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
export class GroupNameDialogComponent {
  constructor(public dialogRef: MatDialogRef<GroupNameDialogComponent>) {}
  groupNameForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern(/^[\p{L}\d\s]*$/u),
    ]),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }
}
