import { Component, OnDestroy, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';
import { PrivateMessageListResponse } from '../main/models/private-message.model';
import { GroupService } from '../main/services/group.service';
import { PrivateMessageItem } from '../redux/models/redux.models';
import * as PrivateMessageSelectors from '../redux/selectors/private-message.selector';
import * as PrivateMessageActions from '../redux/actions/private-message.action';
import { Actions, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as UserSelector from '../redux/selectors/user.selector';
import * as UserActions from '../redux/actions/user.action';
import * as ConversationActions from '../redux/actions/conversation.actions';
import { GroupTimerService } from '../main/services/group-timer.service';
import { FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { ConversationDeleteDialogComponent } from '../main/conversation-delete-dialog/conversation-delete-dialog.component';
@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit, OnDestroy {
  userUID = localStorage.getItem('uid');
  conversationID!: string;
  countdownPrivateMessageUpdate$!: Observable<number>;
  messages!: PrivateMessageListResponse;
  loading$: Observable<boolean> = this.store.select(
    PrivateMessageSelectors.selectPrivateMessagesLoading(this.conversationID)
  );
  messages$: Observable<PrivateMessageItem[]> = this.store.select(
    PrivateMessageSelectors.selectPrivateMessages(this.conversationID)
  );
  sortedMessages$: Observable<PrivateMessageItem[]> = this.store.select(
    PrivateMessageSelectors.selectSortedPrivateMessages(this.conversationID)
  );
  initialLoadCompleted$: Observable<boolean> = this.store.select(
    PrivateMessageSelectors.selectInitialLoadCompleted(this.conversationID)
  );
  latestMessageTimestamp: number = 0;
  lastUpdated$: Observable<number | null> = this.store.select(
    PrivateMessageSelectors.selectLastFetchedTimestamp(this.conversationID)
  );

  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private timerService: GroupTimerService,
    public dialog: MatDialog
  ) {}

  messageInput = new FormControl('', Validators.required);

  ngOnInit(): void {
    this.conversationID =
      this.route.snapshot.paramMap.get('conversationID') || '';

    this.messages$ = this.store.select(
      PrivateMessageSelectors.selectPrivateMessages(this.conversationID)
    );

    this.sortedMessages$ = this.store.select(
      PrivateMessageSelectors.selectSortedPrivateMessages(this.conversationID)
    );

    this.lastUpdated$ = this.store.select(
      PrivateMessageSelectors.selectLastFetchedTimestamp(this.conversationID)
    );

    this.initialLoadCompleted$ = this.store.select(
      PrivateMessageSelectors.selectInitialLoadCompleted(this.conversationID)
    );

    this.countdownPrivateMessageUpdate$ =
      this.timerService.getCountdownForGroup(this.conversationID);
    this.setupLatestMessageTimestampSubscription();
    this.subscribeToLoadPrivateMessages();
    this.subscribeToLoadUsersFailure();
    this.subscribeToLoadUsers();
    this.checkInitialLoad();
    this.subscribeToLoadPrivateMessagesFailure();
    this.subscribeToSendPrivateMessagesFailure();
    this.subscribeToGroupDeleteSuccess();
    this.subscribeToGroupDeleteFailure();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openDeleteDialog(conversationID: string): void {
    const dialogRef = this.dialog.open(ConversationDeleteDialogComponent, {
      width: '380px',
      disableClose: true,
      data: { conversationId: conversationID },
    });
  }

  onSendMessage(): void {
    if (this.messageInput.valid && this.conversationID) {
      const message = this.messageInput.value || '';
      if (this.conversationID !== '') {
        this.groupService
          .sendPrivateMessage(this.conversationID, message)
          .subscribe({
            next: () => {
              this.store.dispatch(
                PrivateMessageActions.loadPrivateMessagesSince({
                  conversationId: this.conversationID,
                  since: this.latestMessageTimestamp,
                })
              );
            },
            error: (err) => {
              this.showSnackbar(`Error loadidng users: ${err.error.message}`);
            },
          });
      } else {
        this.showSnackbar(`Group ID is not valid.`);
      }

      this.messageInput.reset();
    }
  }

  private subscribeToLoadPrivateMessages() {
    const initialLoadSubscription = this.initialLoadCompleted$
      .pipe(take(1))
      .subscribe((initialLoadCompleted) => {
        if (initialLoadCompleted === true) {
          this.store.dispatch(
            PrivateMessageActions.loadPrivateMessagesSince({
              conversationId: this.conversationID,
              since: this.latestMessageTimestamp,
            })
          );
        } else {
          this.store.dispatch(
            PrivateMessageActions.loadPrivateMessages({
              conversationId: this.conversationID,
            })
          );
        }
      });
  }

  private subscribeToLoadUsers() {
    this.subscriptions.add(
      this.store
        .pipe(select(UserSelector.selectUsers), take(1))
        .subscribe((users) => {
          if (users.length === 0) {
            this.store.dispatch(UserActions.loadUsers());
          }
        })
    );
  }

  private subscribeToLoadUsersFailure() {
    const subscription = this.actions$
      .pipe(ofType(UserActions.loadUsersFailure))
      .subscribe(({ error }) =>
        this.showSnackbar(`Error loadidng users: ${error.message}`)
      );
    this.subscriptions.add(subscription);
  }

  private subscribeToLoadPrivateMessagesFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(PrivateMessageActions.loadPrivateMessagesFailure))
      .subscribe((error) => {
        this.showSnackbar(error.error.message);
      });
    this.subscriptions.add(failureSubscription);
  }
  showSnackbar(
    message: string,
    action: string = 'Close',
    duration: number = 3000
  ): void {
    this.snackBar.open(message, action, { duration });
  }

  onUpdate() {
    this.store.dispatch(
      PrivateMessageActions.loadPrivateMessagesSince({
        conversationId: this.conversationID,
        since: this.latestMessageTimestamp,
      })
    );
    this.reactToPrivateMessageSuccessAction();
  }

  private reactToPrivateMessageSuccessAction() {
    this.actions$
      .pipe(
        ofType(PrivateMessageActions.loadPrivateMessagesSinceSuccess),
        take(1)
      )
      .subscribe(() => {
         this.timerService.startCountdownForGroup(this.conversationID), take(1);
      });
  }

  private setupLatestMessageTimestampSubscription() {
    this.subscriptions.add(
      this.store
        .select(
          PrivateMessageSelectors.selectLatestMessageTimestamp(
            this.conversationID
          )
        )
        .subscribe((timestamp) => {
          this.latestMessageTimestamp = timestamp ? Number(timestamp) : 0;
        })
    );
  }

  private checkInitialLoad() {
    this.subscriptions.add(
      this.store
        .select(
          PrivateMessageSelectors.selectInitialLoadCompleted(
            this.conversationID
          )
        )
        .subscribe((messages) => {})
    );
  }

  private subscribeToSendPrivateMessagesFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(PrivateMessageActions.loadPrivateMessagesSinceFailure))
      .subscribe((error) => {
        this.showSnackbar(error.error.message);
      });
    this.subscriptions.add(failureSubscription);
  }

  private subscribeToGroupDeleteSuccess() {
    const subscription = this.actions$
      .pipe(ofType(ConversationActions.deleteConversationSuccess))
      .subscribe(() => this.showSnackbar('Conversation deleted successfully'));
    this.subscriptions.add(subscription);
  }

  private subscribeToGroupDeleteFailure() {
    const subscription = this.actions$
      .pipe(ofType(ConversationActions.deleteConversationFailure))
      .subscribe(({ error }) => this.showSnackbar(`Error: ${error.message}`));
    this.subscriptions.add(subscription);
  }
}
