import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as GroupSelectors from '../redux/selectors/groups.selector';
import * as GroupActions from '../redux/actions/group-fetch.action';

import * as GroupMessageSelectors from '../redux/selectors/group-message.selector';
import * as GroupMessageActions from '../redux/actions/group-message.action';
import * as GroupDeleteActions from '../redux/actions/group-delete.action';
import * as UserActions from '../redux/actions/user.action';
import * as UserSelector from '../redux/selectors/user.selector';
import { Observable, Subscription } from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import {
  GroupMessageItem,
  GroupMessageError,
} from 'src/app/main/models/group.model'; // Ensure GroupMessageError is imported
import { FormControl, Validators } from '@angular/forms';
import { GroupService } from '../main/services/group.service';
import { Actions, ofType } from '@ngrx/effects';
import { GroupTimerService } from '../main/services/group-timer.service';
import { MatDialog } from '@angular/material/dialog';
import { GroupDeleteDialogComponent } from '../main/group-delete-dialog/group-delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss'],
})
export class GroupDialogComponent implements OnInit, OnDestroy {
  userUID = localStorage.getItem('uid');
  groupID!: string;
  countdownGroupMessageUpdate$!: Observable<number>;
  isGroupCreator: boolean = false;
  groupsList$ = this.store.select(GroupSelectors.selectGroups);

  itialLoadCompleted = false;
  isGroupCreator$!: Observable<boolean>;
  initialLoadCompleted$: Observable<boolean> = this.store.select(
    GroupMessageSelectors.selectInitialLoadCompleted(this.groupID)
  );
  messages$: Observable<GroupMessageItem[]> = this.store.select(
    GroupMessageSelectors.selectGroupMessages(this.groupID)
  );
  loading$: Observable<boolean> = this.store.select(
    GroupMessageSelectors.selectGroupMessagesLoading(this.groupID)
  );
  error$: Observable<GroupMessageError | null> = this.store.select(
    GroupMessageSelectors.selectGroupMessagesError(this.groupID)
  );
  sortedMessages$: Observable<GroupMessageItem[]> = this.store.select(
    GroupMessageSelectors.selectSortedGroupMessages(this.groupID)
  );
  latestMessageTimestamp: number = 0;
  lastUpdated$: Observable<number | null> = this.store.select(
    GroupMessageSelectors.selectLastFetchedTimestamp(this.groupID)
  );
  private subscriptions = new Subscription();
  lastmess$!: Observable<any>;

  constructor(
    public dialog: MatDialog,
    private groupService: GroupService,
    private store: Store,
    private route: ActivatedRoute,
    private timerService: GroupTimerService,
    private actions$: Actions,
    private snackBar: MatSnackBar
  ) {
    this.isGroupCreator$ = this.store.pipe(
      select(GroupSelectors.isUserGroupCreator, { groupId: this.groupID })
    );
  }

  messageInput = new FormControl('', Validators.required);

  onSendMessage(): void {
    if (this.messageInput.valid && this.groupID) {
      const message = this.messageInput.value || '';
      if (this.groupID !== '') {
        this.groupService.sendGroupMessage(this.groupID, message).subscribe({
          next: () => {
            this.store.dispatch(
              GroupMessageActions.loadGroupMessagesSince({
                groupId: this.groupID,
                since: this.latestMessageTimestamp,
              })
            );
          },
          error: (err) => {
            this.showSnackbar(`Error loadidng users: ${err.message}`);
          },
        });
      } else {
        this.showSnackbar(`Group ID is not valid.`);
      }
      this.messageInput.reset();
    }
  }

  ngOnInit(): void {
    this.groupID = this.route.snapshot.paramMap.get('groupID') || '';
    this.groupsList$.subscribe((groups) => {
      if (groups.length === 0) {
        this.store.dispatch(GroupActions.loadGroups());
      }
    });
    this.messages$ = this.store.select(
      GroupMessageSelectors.selectGroupMessages(this.groupID)
    );
    this.loading$ = this.store.select(
      GroupMessageSelectors.selectGroupMessagesLoading(this.groupID)
    );
    this.error$ = this.store.select(
      GroupMessageSelectors.selectGroupMessagesError(this.groupID)
    );
    this.sortedMessages$ = this.store.select(
      GroupMessageSelectors.selectSortedGroupMessages(this.groupID)
    );
    this.lastUpdated$ = this.store.select(
      GroupMessageSelectors.selectLastFetchedTimestamp(this.groupID)
    );
    this.initialLoadCompleted$ = this.store.select(
      GroupMessageSelectors.selectInitialLoadCompleted(this.groupID)
    );

    this.countdownGroupMessageUpdate$ = this.timerService.getCountdownForGroup(
      this.groupID
    );
    this.setupLatestMessageTimestampSubscription();
    this.subscribeToLoadUsersFailure();
    this.subscribeToLoadGroupMessagesFailure();
    this.subscribeToLoadGroupMessagesSinceFailure();
    this.subscribeToSendGroupMessagesFailure();
    this.lastmess$ = this.store.select(
      GroupMessageSelectors.selectLatestMessageTimestamp(this.groupID)
    );
    this.subscribeToLoadGroupMessages();
    this.subscribeToLoadUsers();
    this.setupGroupCreatorSubscription();
    this.subscribeToDeleteGroupSuccess();
    this.reactToGroupMessageFailureAction();
    this.subscribeToDeleteGroupFailure();
    this.checkInitialLoad();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openDeleteDialog(groupId: string): void {
    const dialogRef = this.dialog.open(GroupDeleteDialogComponent, {
      width: '380px',
      disableClose: true,
      data: { groupId },
    });
  }

  private checkInitialLoad() {
    this.subscriptions.add(
      this.store
        .select(GroupMessageSelectors.selectInitialLoadCompleted(this.groupID))
        .subscribe((messages) => {})
    );
  }

  showSnackbar(
    message: string,
    action: string = 'Close',
    duration: number = 3000
  ): void {
    this.snackBar.open(message, action, { duration });
  }

  private subscribeToLoadGroupMessages() {
    const initialLoadSubscription = this.initialLoadCompleted$
      .pipe(take(1))
      .subscribe((initialLoadCompleted) => {
        if (initialLoadCompleted === true) {
          this.store.dispatch(
            GroupMessageActions.loadGroupMessagesSince({
              groupId: this.groupID,
              since: this.latestMessageTimestamp,
            })
          );
        } else {
          this.store.dispatch(
            GroupMessageActions.loadGroupMessages({ groupId: this.groupID })
          );
        }
      });
    this.subscriptions.add(initialLoadSubscription);
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

  private subscribeToLoadGroupMessagesFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(GroupMessageActions.loadGroupMessagesFailure))
      .subscribe((error) => {
        this.showSnackbar(error.error.message);
      });
    this.subscriptions.add(failureSubscription);
  }

  private subscribeToDeleteGroupSuccess() {
    const successSubscription = this.actions$
      .pipe(ofType(GroupDeleteActions.deleteGroupSuccess))
      .subscribe(() => {
        this.showSnackbar(`Group has been successfully deleted.`);
      });
    this.subscriptions.add(successSubscription);
  }
  private subscribeToDeleteGroupFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(GroupDeleteActions.deleteGroupFailure))
      .subscribe((error) => {
        this.showSnackbar(error.error.message);
      });
    this.subscriptions.add(failureSubscription);
  }

  private subscribeToLoadGroupMessagesSinceFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(GroupMessageActions.loadGroupMessagesSinceFailure))
      .subscribe((error) => {
        this.showSnackbar(error.error.message);
      });
    this.subscriptions.add(failureSubscription);
  }

  private subscribeToSendGroupMessagesFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(GroupMessageActions.loadGroupMessagesSinceFailure))
      .subscribe((error) => {
        this.showSnackbar(error.error.message);
      });
    this.subscriptions.add(failureSubscription);
  }

  private setupGroupCreatorSubscription() {
    this.subscriptions.add(
      this.store
        .select(GroupSelectors.isUserGroupCreator, { groupId: this.groupID })
        .subscribe((isCreator) => {
          if (isCreator !== undefined) {
            this.isGroupCreator = isCreator;
          } else {
            this.store.dispatch(GroupActions.loadGroups());
          }
        })
    );
  }

  private setupLatestMessageTimestampSubscription() {
    this.subscriptions.add(
      this.store
        .select(
          GroupMessageSelectors.selectLatestMessageTimestamp(this.groupID)
        )
        .subscribe((timestamp) => {
          this.latestMessageTimestamp = timestamp ? Number(timestamp) : 0;
        })
    );
  }

  onUpdate() {
    this.store.dispatch(
      GroupMessageActions.loadGroupMessagesSince({
        groupId: this.groupID,
        since: this.latestMessageTimestamp,
      })
    );
    this.reactToGroupMessageSuccessAction();
  }

  private reactToGroupMessageSuccessAction() {
    this.actions$
      .pipe(ofType(GroupMessageActions.loadGroupMessagesSinceSuccess), take(1))
      .subscribe(() => {
        this.timerService.startCountdownForGroup(this.groupID);
      });
  }

  private reactToGroupMessageFailureAction() {
    this.actions$
      .pipe(ofType(GroupMessageActions.loadGroupMessagesSinceSuccess), take(1))
      .subscribe(() => {
        this.timerService.startCountdownForGroup(this.groupID);
      });
  }
}
