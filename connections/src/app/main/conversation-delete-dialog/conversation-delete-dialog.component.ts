import { Component, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ConversationState } from 'src/app/redux/models/redux.models';
import * as ConversationActions from 'src/app/redux/actions/conversation.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversation-delete-dialog',
  templateUrl: './conversation-delete-dialog.component.html',
  styleUrls: ['./conversation-delete-dialog.component.scss'],
})

//ConversationDeleteDialogComponent
export class ConversationDeleteDialogComponent implements OnDestroy {
  private subscription = new Subscription();
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<ConversationDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { conversationId: string },
    private store: Store<ConversationState>,
    private actions$: Actions,
    private router: Router
  ) {
    console.log('Dialog Data:', this.data);
    this.subscribeToDeleteConversationSuccess();
    this.subscribeToDeleteConversationFailure();
  }

  private subscribeToDeleteConversationSuccess() {
    this.subscription.add(
      this.actions$
        .pipe(ofType(ConversationActions.deleteConversationSuccess))
        .subscribe(() => {
          this.isSubmitting = false;
          this.dialogRef.close();
          this.router.navigate(['/']);
        })
    );
  }

  private subscribeToDeleteConversationFailure() {
    this.subscription.add(
      this.actions$
        .pipe(ofType(ConversationActions.deleteConversationFailure))
        .subscribe(() => {
          this.isSubmitting = false;
        })
    );
  }

  onDelete() {
    this.isSubmitting = true;
    console.log('Dispatching delete action with ID:', this.data.conversationId); // Add this line for debugging
    this.store.dispatch(
      ConversationActions.deleteConversation({
        conversationId: this.data.conversationId,
      })
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

