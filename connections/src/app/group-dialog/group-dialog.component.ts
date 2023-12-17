import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as GroupSelectors from '../redux/selectors/groups.selector';
import * as GroupActions from '../redux/actions/group-fetch.action';

import * as GroupMessageSelectors from '../redux/selectors/group-message.selector';
import * as GroupMessageActions from '../redux/actions/group-message.action';
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
  isCreatorFromStorage: boolean = false;
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
      // Use a default value for the message if the form control value is null
      const message = this.messageInput.value || '';
      console.log('Sending message:', message);

      if (this.groupID !== '') {
        this.groupService.sendGroupMessage(this.groupID, message).subscribe({
          next: () => {
            // Dispatch action to update messages
            this.store.dispatch(
              GroupMessageActions.loadGroupMessagesSince({
                groupId: this.groupID,
                since: this.latestMessageTimestamp,
              })
            );
          },
          error: (err) => {
            this.showSnackbar(`Error loadidng users: ${err.error.message}`);
          },
        });
      } else {
        console.error('Group ID is not valid.');
        // Handle invalid group ID case here
      }

      this.messageInput.reset();
    }
  }

  ngOnInit(): void {
    this.groupID = this.route.snapshot.paramMap.get('groupID') || '';

    // Within ngOnInit()
    this.groupsList$.subscribe((groups) => {
      if (groups.length === 0) {
        this.store.dispatch(GroupActions.loadGroups());
      }
    });
    // Initialize Observables after setting groupID
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

    this.subscribeToLoadUsersFailure();
    this.subscribeToLoadGroupMessagesFailure();
    this.subscribeToLoadGroupMessagesSinceFailure();
    this.subscribeToSendGroupMessagesSinceFailure();
    /*  this.countdownGroupMessageUpdate$ = this.timerService
      .getGroupMessageCountdown()
      .pipe(startWith(0)); */
    /*     this.isGroupCreator =
      localStorage.getItem(`isGroupCreator_${this.groupID}`) === 'true'; */

    /*     const storedValue = localStorage.getItem(`isGroupCreator_${this.groupID}`);
    this.isCreatorFromStorage = storedValue === 'true';
    console.log(`isCreatorFromStorage`, this.isCreatorFromStorage); */
    // Add this line to your subscriptions in ngOnInit or another appropriate place
    /* this.subscriptions.add(
      this.initialLoadCompleted$.subscribe((result) => {
        console.log('Second time',result);
      })
    ); */

    this.lastmess$ = this.store.select(
      GroupMessageSelectors.selectLatestMessageTimestamp(this.groupID)
    );

    this.subscribeToLoadGroupMessages();
    this.subscribeToLoadUsers();
    this.setupGroupCreatorSubscription();
    this.setupLatestMessageTimestampSubscription();
    this.debugSelectors();
    this.checkInitialLoad();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    localStorage.removeItem(`isGroupCreator_${this.groupID}`);
  }

  openDeleteDialog(groupId: string): void {
    const dialogRef = this.dialog.open(GroupDeleteDialogComponent, {
      width: '360px',
      disableClose: true,
      data: { groupId },
    });
  }

  private checkInitialLoad() {
    this.subscriptions.add(
      this.store
        .select(GroupMessageSelectors.selectInitialLoadCompleted(this.groupID))
        .subscribe((messages) => {
          console.log('Initial load is:', messages);
        })
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
    // Create a new subscription
    const initialLoadSubscription = this.initialLoadCompleted$
      .pipe(take(1))
      .subscribe((initialLoadCompleted) => {
        if (initialLoadCompleted === true) {
          // Load new messages only
          this.store.dispatch(
            GroupMessageActions.loadGroupMessagesSince({
              groupId: this.groupID,
              since: this.latestMessageTimestamp,
            })
          );
        } else {
          // Load all messages initially (for false and undefined)
          this.store.dispatch(
            GroupMessageActions.loadGroupMessages({ groupId: this.groupID })
          );
        }
      });

    // Add the new subscription to this.subscriptions
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

  /*   private subscribeToLoadGroupMessagesSuccess() {
    const successSubscription = this.actions$
      .pipe(ofType(GroupMessageActions.loadGroupMessagesSinceSuccess))
      .subscribe(() => {
        this.showSnackbar(`Group messages successdully loaded`);
      });
    this.subscriptions.add(successSubscription);
  }
 */
  private subscribeToLoadGroupMessagesFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(GroupMessageActions.loadGroupMessagesFailure))
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
        console.log(error);
      });
    this.subscriptions.add(failureSubscription);
  }

  private subscribeToSendGroupMessagesSinceFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(GroupMessageActions.loadGroupMessagesSinceFailure))
      .subscribe((error) => {
        this.showSnackbar(error.error.message);
      });
    this.subscriptions.add(failureSubscription);
  }

  /* private setupGroupCreatorSubscription() {
    this.subscriptions.add(
      this.store
        .select(GroupSelectors.isUserGroupCreator, { groupId: this.groupID })
        .subscribe((isCreator) => {
          localStorage.setItem(
            `isGroupCreator_${this.groupID}`,
            String(isCreator)
          );
          this.isGroupCreator = isCreator;
          console.log('Is Group Creator AAAAAAAAAAAAA:', this.isGroupCreator);
        })
    );
  } */
  private setupGroupCreatorSubscription() {
    this.subscriptions.add(
      this.store
        .select(GroupSelectors.isUserGroupCreator, { groupId: this.groupID })
        .subscribe((isCreator) => {
          if (isCreator !== undefined) {
            // If isCreator is defined, use it and store in localStorage
            localStorage.setItem(
              `isGroupCreator_${this.groupID}`,
              String(isCreator)
            );
            this.isGroupCreator = isCreator;
            console.log('Is Group Creator:', this.isGroupCreator);
          } else {
            // If isCreator is undefined, dispatch an action to fetch the data
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
        console.log('Group message update successful');
        // Start countdown for this specific group
        this.timerService.startCountdownForGroup(this.groupID);
      });
  }

  private reactToGroupMessageFailureAction() {
    this.actions$
      .pipe(ofType(GroupMessageActions.loadGroupMessagesSinceSuccess), take(1))
      .subscribe(() => {
        console.log('Group message update successful');
        // Start countdown for this specific group
        this.timerService.startCountdownForGroup(this.groupID);
      });
  }

  private debugSelectors() {
    // Debugging sorted messages
    this.subscriptions.add(
      this.store
        .select(GroupMessageSelectors.selectSortedGroupMessages(this.groupID))
        .subscribe((messages) => {
          console.log('Sorted Messages B:', messages);
        })
    );

    // Debugging loading state
    this.subscriptions.add(
      this.loading$.subscribe((loading) => {
        console.log('Loading:', loading);
      })
    );

    // Debugging error state
    this.subscriptions.add(
      this.error$.subscribe((error) => {
        console.log('Error:', error?.message);
      })
    );

    // Debugging last updated timestamp
    this.subscriptions.add(
      this.lastUpdated$.subscribe((lastUpdated) => {
        console.log('Last Updated Timestamp:', lastUpdated);
      })
    );

    // Debugging group creator status
    this.subscriptions.add(
      this.store
        .select(GroupSelectors.isUserGroupCreator, { groupId: this.groupID })
        .subscribe((isCreator) => {
          this.isGroupCreator = isCreator;
          console.log('Is Group Creator lfffff:', this.isGroupCreator);
          localStorage.setItem(
            `isGroupCreator_${this.groupID}`,
            String(isCreator)
          );
        })
    );
  }
}
