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
import * as GroupCreateActions from '../../redux/actions/group-create.action';
import { GroupState } from 'src/app/redux/models/redux.models';
import * as UserState from '../../redux/models/redux.models';
import * as groupSelectors from '../../redux/selectors/groups.selector';
import * as userSelectors from '../../redux/selectors/user.selector';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { GroupNameDialogComponent } from '../group-name-dialog/group-name-dialog.component';
import * as GroupDeleteActions from '../../redux/actions/group-delete.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupDeleteDialogComponent } from '../group-delete-dialog/group-delete-dialog.component';
import { TimerService } from '../services/timer-service';
import { UserItem, UserListResponse } from '../models/user.model';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  groupData: GroupUpdateResponse | undefined = undefined;
  userData: UserListResponse | undefined = undefined;
  groups$!: Observable<GroupItem[]>;
  users$!: Observable<UserItem[]>;
  loadingGroups$!: Observable<boolean>;
  loadingUsers$!: Observable<boolean>;
  errorGroups$!: Observable<GroupError | null>;
  errorUsers$!: Observable<GroupError | null>;
  lastUpdateTimeGroup$!: Observable<number | null>;
  lastUpdateTimeUser$!: Observable<number | null>;
  countdownGroupUpdate$!: Observable<number>;
  countdownUserUpdate$!: Observable<number>;
  hasUpdatedGroupsSuccessfully: boolean = false;
  hasUpdatedUsersSuccessfully: boolean = false;
  private subscriptions = new Subscription();
  myGroupData: GroupCreateResponse | undefined = undefined;
  myUserData: UserListResponse | undefined = undefined;
  currentUserUid: string | null = null;

  constructor(
    public dialog: MatDialog,
    private store: Store,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private timerService: TimerService
  ) {}

  ngOnInit(): void {
    this.groups$ = this.store.select(groupSelectors.selectGroups);
    this.users$ = this.store.select(userSelectors.selectUsers);
    this.loadingGroups$ = this.store.select(groupSelectors.selectGroupsLoading);
    this.loadingUsers$ = this.store.select(userSelectors.selectUsersLoading);
    this.errorGroups$ = this.store.select(groupSelectors.selectGroupsError);
    this.errorUsers$ = this.store.select(userSelectors.selectUsersError);

    this.lastUpdateTimeGroup$ = this.store.select(
      groupSelectors.selectLastUpdateTimestamp
    );
    this.lastUpdateTimeUser$ = this.store.select(
      userSelectors.selectLastUserUpdateTimestamp
    );

    this.currentUserUid = localStorage.getItem('uid');
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
    console.log(`my uid is: ${localStorage.getItem('uid')}`);
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
        this.hasUpdatedGroupsSuccessfully = true;
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
  }

  private reactToUserSuccessAction() {
    this.actions$
      .pipe(ofType(UserActions.loadUsersSuccess), take(1))
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

  private subscribeToLoadUserSuccess() {
    const successSubscription = this.actions$
      .pipe(ofType(UserActions.loadUsersSuccess))
      .subscribe(() => {
        this.hasUpdatedUsersSuccessfully = true;
      });
    this.subscriptions.add(successSubscription);
  }

  private subscribeToLoadUserFailure() {
    const failureSubscription = this.actions$
      .pipe(ofType(UserActions.loadUsersFailure))
      .subscribe(({ error }) => {
        this.showSnackbar(`Error loading users: ${error.message}`);
      });

    this.subscriptions.add(failureSubscription);
  }
}
