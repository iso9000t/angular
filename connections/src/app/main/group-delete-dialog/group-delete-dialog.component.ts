import { Component, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GroupState } from 'src/app/redux/models/redux.models';
import * as GroupDeleteActions from 'src/app/redux/actions/group-delete.action';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-group-delete-dialog',
  templateUrl: './group-delete-dialog.component.html',
  styleUrls: ['./group-delete-dialog.component.scss'],
})
export class GroupDeleteDialogComponent implements OnDestroy {
  private subscription = new Subscription();
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<GroupDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupId: string },
    private store: Store<GroupState>,
    private actions$: Actions
  ) {
    this.subscribeToDeleteGroupSuccess();
    this.subscribeToDeleteGroupFailure();
  }

  private subscribeToDeleteGroupSuccess() {
    this.subscription.add(
      this.actions$
        .pipe(ofType(GroupDeleteActions.deleteGroupSuccess))
        .subscribe(() => {
          this.isSubmitting = false;
          this.dialogRef.close();
        })
    );
  }

  private subscribeToDeleteGroupFailure() {
    this.subscription.add(
      this.actions$
        .pipe(ofType(GroupDeleteActions.deleteGroupFailure))
        .subscribe(() => {
          this.isSubmitting = false;
        })
    );
  }

  onDelete() {
    this.isSubmitting = true;
    this.store.dispatch(
      GroupDeleteActions.deleteGroup({ groupId: this.data.groupId })
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
