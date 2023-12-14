import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  interval,
  map,
  Observable,
  of,
  startWith,
  Subscription,
  switchMap,
  take,
  takeWhile,
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
import * as GroupCreateActions from '../../redux/actions/group-create.action';
import { GroupState } from 'src/app/redux/models/redux.models';
import * as groupSelectors from '../../redux/selectors/groups.selector';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { GroupNameDialogComponent } from '../group-name-dialog/group-name-dialog.component';
import * as GroupDeleteActions from '../../redux/actions/group-delete.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupDeleteDialogComponent } from '../group-delete-dialog/group-delete-dialog.component';
import { TimerService } from '../services/timer-service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  groupData: GroupUpdateResponse | undefined = undefined;
  groups$!: Observable<GroupItem[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<GroupError | null>;
  lastUpdateTimestamp$!: Observable<number | null>;
  countdown$!: Observable<number>;
  hasUpdatedSuccessfully: boolean = false;
  private subscriptions = new Subscription();
  myGroupData: GroupCreateResponse | undefined = undefined;
  currentUserUid: string | null = null;

  constructor(
    public dialog: MatDialog,
    private groupService: GroupService,
    private store: Store<GroupState>,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private timerService: TimerService
  ) {
    this.groups$ = this.store.select(groupSelectors.selectGroups);
    this.loading$ = this.store.select(groupSelectors.selectGroupsLoading);
    this.error$ = this.store.select(groupSelectors.selectGroupsError);
    /* this.lastUpdateTimestamp$ = this.store.select(
      groupSelectors.selectLastUpdateTimestamp
    ); */
  }

  ngOnInit(): void {
    this.lastUpdateTimestamp$ = this.store.select(
      groupSelectors.selectLastUpdateTimestamp
    );
    this.currentUserUid = localStorage.getItem('uid');
    this.countdown$ = this.timerService.getCountdown();
    this.subscribeToLoadGroups();
    this.subscribeToGroupCreateSuccess();
    this.subscribeToGroupCreateFailure();
    this.subscribeToGroupDeleteSuccess();
    this.subscribeToGroupDeleteFailure();

    this.subscribeToLoadGroupSuccess();
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

    // Listen for the loadGroupsSuccess action
    this.reactToGroupSuccessAction();
  }

  private reactToGroupSuccessAction() {
  
    this.actions$
      .pipe(
        ofType(GroupActions.loadGroupsSuccess),
        take(1)
      )
      .subscribe(() => {
        this.store.dispatch(GroupActions.setHasUpdated());
        this.timerService.startCountdown();
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
        this.hasUpdatedSuccessfully = true;
      });
    this.subscriptions.add(successSubscription);
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
}
