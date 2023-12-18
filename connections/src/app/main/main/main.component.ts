import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  Observable,
  Subscription,
  take,
} from 'rxjs';
import {
  GroupCreateRequestBody,
  GroupCreateResponse,
  GroupError,
  GroupItem,
  GroupUpdateResponse,
} from '../models/group.model';
import { GroupService } from '../services/group.service';
import * as GroupActions from '../../redux/actions/group-fetch.action';
import * as UserActions from '../../redux/actions/user.action';
import * as ConversationActions from '../../redux/actions/conversation.actions';
import * as GroupCreateActions from '../../redux/actions/group-create.action';
import { GroupState } from 'src/app/redux/models/redux.models';
import * as UserState from '../../redux/models/redux.models';
import * as groupSelectors from '../../redux/selectors/groups.selector';
import * as userSelectors from '../../redux/selectors/user.selector';
import * as conversationSelectors from '../../redux/selectors/conversation.selector';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { GroupNameDialogComponent } from '../group-name-dialog/group-name-dialog.component';
import * as GroupDeleteActions from '../../redux/actions/group-delete.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupDeleteDialogComponent } from '../group-delete-dialog/group-delete-dialog.component';
import { TimerService } from '../services/timer-service';
import { UserError, UserItem, UserListResponse } from '../models/user.model';
import { ConversationError, ConversationItem, ConversationListResponse } from '../models/conversation.model';
import { selectUsersExceptCurrent } from '../../redux/selectors/user.selector';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  conversationIDs$!: Observable<string[]>;
  companionIDs$!: Observable<string[]>;
  groupData: GroupUpdateResponse | undefined = undefined;
  userData: UserListResponse | undefined = undefined;
  groups$!: Observable<GroupItem[]>;
  users$!: Observable<UserItem[]>;
  conversations$!: Observable<ConversationItem[]>;
  loadingGroups$!: Observable<boolean>;
  loadingUsers$!: Observable<boolean>;
  loadingConversations$!: Observable<boolean>;
  errorGroups$!: Observable<GroupError | null>;
  errorUsers$!: Observable<UserError | null>;
  errorConversations$!: Observable<ConversationError | null>;
  lastUpdateTimeGroup$!: Observable<number | null>;
  lastUpdateTimeUser$!: Observable<number | null>;
  countdownGroupUpdate$!: Observable<number>;
  countdownUserUpdate$!: Observable<number>;
  /*   hasUpdatedGroupsSuccessfully: boolean = false; */
  /*   hasUpdatedUsersSuccessfully: boolean = false; */
  private subscriptions = new Subscription();
  myGroupData: GroupCreateResponse | undefined = undefined;
  myUserData: UserListResponse | undefined = undefined;
  currentUserUid!: string;
  loadingUsers: boolean = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private store: Store,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private timerService: TimerService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.conversationIDs$ = this.store.select(
      conversationSelectors.selectConversationIDs
    );

    this.companionIDs$ = this.store.select(
      conversationSelectors.selectConversationCompanionIDs
    );

    this.currentUserUid = localStorage.getItem('uid')!;
    this.groups$ = this.store.select(groupSelectors.selectGroups);

    this.users$ = this.store.select(
      selectUsersExceptCurrent(this.currentUserUid)
    );

    this.loadingGroups$ = this.store.select(groupSelectors.selectGroupsLoading);
    this.loadingUsers$ = this.store.select(userSelectors.selectUsersLoading);
    this.loadingConversations$ = this.store.select(
      conversationSelectors.selectConversationsLoading
    );
    this.errorGroups$ = this.store.select(groupSelectors.selectGroupsError);
    this.errorUsers$ = this.store.select(userSelectors.selectUsersError);
    this.errorConversations$ = this.store.select(
      conversationSelectors.selectConversationsError
    );

    this.lastUpdateTimeGroup$ = this.store.select(
      groupSelectors.selectLastUpdateTimestamp
    );
    this.lastUpdateTimeUser$ = this.store.select(
      userSelectors.selectLastUserUpdateTimestamp
    );

    this.countdownGroupUpdate$ = this.timerService.getGroupCountdown();
    this.countdownUserUpdate$ = this.timerService.getUserCountdown();
    this.subscribeToLoadGroups();
    this.subscribeToLoadUsers();
    this.subscribeToGroupCreateSuccess();
    this.subscribeToGroupCreateFailure();
    this.subscribeToGroupDeleteSuccess();
    this.subscribeToGroupDeleteFailure();
    this.subscribeToLoadGroupSuccess();
    this.subscribeToLoadGroupFailure();
    this.subscribeToLoadUserSuccess();
    this.subscribeToLoadUserFailure();
    this.subscribeToLoadCompainionsIDSuccess();
    this.subscribeToLoadConversationsFailure();
    console.log(`my uid is: ${localStorage.getItem('uid')}`);
    this.subscribeToLoadConversationCompanionsIDs();
    this.subscribeToCompanionIDs();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  showSnackbar(
    message: string,
    action: string = 'Close',
    duration: number = 3000
  ): void {
    this.snackBar.open(message, action, { duration });
  }

  updateGroups() {
    this.store.dispatch(GroupActions.loadGroups());
    this.reactToGroupSuccessAction();
  }

  private reactToGroupSuccessAction() {
    this.actions$
      .pipe(ofType(GroupActions.loadGroupsSuccess), take(1))
      .subscribe(() => {
        this.timerService.startGroupCountdown();
      });
  }

  private subscribeToLoadGroups() {
    const groupsSubscription = this.store
      .pipe(select(groupSelectors.selectGroups), take(1))
      .subscribe((groups) => {
        if (groups.length === 0) {
          this.store.dispatch(GroupActions.loadGroups());
        }
      });
    this.subscriptions.add(groupsSubscription);
  }

  private subscribeToLoadGroupSuccess() {
    const successSubscription = this.actions$
      .pipe(ofType(GroupActions.loadGroupsSuccess))
      .subscribe(() => {
        /*      this.hasUpdatedGroupsSuccessfully = true; */
      });
    this.subscriptions.add(successSubscription);
  }

  private subscribeToLoadGroupFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(GroupActions.loadGroupsFailure))
      .subscribe(({ error }) => {
        this.showSnackbar(`Error loading groups: ${error.message}`);
      });

    this.subscriptions.add(failureSubscription);
  }

  isCompanion(userId: string): boolean {
    let companions: string[] = [];
    this.companionIDs$.subscribe((ids) => (companions = ids));
    return companions.includes(userId);
  }

  openSaveDialog(): void {
    const dialogRef = this.dialog.open(GroupNameDialogComponent, {
      width: '360px',
      disableClose: true,
    });
  }

  openDeleteDialog(groupId: string): void {
    const dialogRef = this.dialog.open(GroupDeleteDialogComponent, {
      width: '360px',
      disableClose: true,
      data: { groupId },
    });
  }

  private subscribeToConversationIDs() {
    const conversationIDsSubscription = this.conversationIDs$.subscribe(
      (result) => {
        console.log('conv', result);
      }
    );
    this.subscriptions.add(conversationIDsSubscription);
  }

  private subscribeToCompanionIDs() {
    const companionIDsSubscription = this.companionIDs$.subscribe((result) => {
      console.log('sobu 2', result);
    });
    this.subscriptions.add(companionIDsSubscription);
  }
  private subscribeToGroupCreateSuccess() {
    const subscription = this.actions$
      .pipe(ofType(GroupCreateActions.createGroupSuccess))
      .subscribe(() => this.showSnackbar('Group created successfully'));
    this.subscriptions.add(subscription);
  }

  private subscribeToGroupCreateFailure() {
    const subscription = this.actions$
      .pipe(ofType(GroupCreateActions.createGroupFailure))
      .subscribe(({ error }) => this.showSnackbar(`Error: ${error.message}`));
    this.subscriptions.add(subscription);
  }

  private subscribeToGroupDeleteSuccess() {
    const subscription = this.actions$
      .pipe(ofType(GroupDeleteActions.deleteGroupSuccess))
      .subscribe(() => this.showSnackbar('Group deleted successfully'));
    this.subscriptions.add(subscription);
  }

  private subscribeToGroupDeleteFailure() {
    const subscription = this.actions$
      .pipe(ofType(GroupDeleteActions.deleteGroupFailure))
      .subscribe(({ error }) => this.showSnackbar(`Error: ${error.message}`));
    this.subscriptions.add(subscription);
  }

  updateUsers() {
    this.store.dispatch(UserActions.loadUsers());
    this.reactToUserSuccessAction();
    this.reactToConversationSuccessAction();
  }

  private reactToUserSuccessAction() {
    this.actions$
      .pipe(ofType(UserActions.loadUsersSuccess), take(1))
      .subscribe(() => {
        this.store.dispatch(ConversationActions.loadConversations());
      });
  }

  private reactToConversationSuccessAction() {
    this.actions$
      .pipe(ofType(ConversationActions.loadConversationsSuccess), take(1))
      .subscribe(() => {
        this.timerService.startUserCountdown();
      });
  }

  private subscribeToLoadUsers() {
    const usersSubscription = this.store
      .pipe(select(userSelectors.selectUsers), take(1))
      .subscribe((users) => {
        if (users.length === 0) {
          this.store.dispatch(UserActions.loadUsers());
        }
      });
    this.subscriptions.add(usersSubscription);
  }
  //conversationIDs$
  private subscribeToLoadConversationCompanionsIDs() {
    const companionsIDSubscription = this.store
      .pipe(
        select(conversationSelectors.selectConversationCompanionIDs),
        take(1)
      )
      .subscribe((conversations) => {
        if (conversations.length === 0) {
          this.store.dispatch(ConversationActions.loadConversations());
        }
        console.log('Companions ac are', conversations);
      });
    this.subscriptions.add(companionsIDSubscription);
  }

  private subscribeToLoadUserSuccess() {
    const successSubscription = this.actions$
      .pipe(ofType(UserActions.loadUsersSuccess))
      .subscribe(() => {
        /*    this.hasUpdatedUsersSuccessfully = true; */
      });
    this.subscriptions.add(successSubscription);
  }

  private subscribeToLoadCompainionsIDSuccess() {
    const successSubscription = this.actions$
      .pipe(ofType(ConversationActions.loadConversationsSuccess))
      .subscribe(() => {
        /*     this.hasUpdatedUsersSuccessfully = true; */
      });
    this.subscriptions.add(successSubscription);
  }

  //conversations$;

  private subscribeToLoadUserFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(UserActions.loadUsersFailure))
      .subscribe(({ error }) => {
        this.showSnackbar(`Error loading users: ${error.message}`);
      });

    this.subscriptions.add(failureSubscription);
  }

  private subscribeToLoadConversationsFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(ConversationActions.loadConversationsFailure))
      .subscribe(({ error }) => {
        this.showSnackbar(`Error loading users: ${error.message}`);
      });

    this.subscriptions.add(failureSubscription);
  }

  navigateToGroup(groupId: string): void {
    this.router.navigate(['/group', groupId]);
  }

  createOrNavigateToConversation(userId: string): void {
    // Check if a conversation with this user already exists
    this.store
      .pipe(
        select(conversationSelectors.selectConversationByCompanionId, {
          userId,
        }),
        take(1)
      )
      .subscribe((existingConversation) => {
        if (existingConversation) {
          // If the conversation exists, navigate to it
          this.router.navigate(['/conversation', existingConversation.id.S]);
        } else {
          // If not, create a new conversation
          this.createAndNavigateToConversation(userId);
        }
      });
  }

  createAndNavigateToConversation(companionId: string): void {
    this.loadingUsers = true;
    this.groupService.createConversation(companionId).subscribe({
      next: (response) => {
        console.log('Create conversation response:', response);
        if (response && response.conversationID) {
          this.loadingUsers = false;
          this.router.navigate(['/conversation', response.conversationID]);
          this.showSnackbar('Conversation created successfully');
        } else {
          this.loadingUsers = false;
          this.showSnackbar('Unexpected response format');
        }
      },
      error: (error) => {
        this.loadingUsers = false;
        this.showSnackbar(`Error: ${error.error.message}`);
      },
    });
  }
}