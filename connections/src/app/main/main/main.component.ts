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
    private snackBar: MatSnackBar
  ) {
    this.groups$ = this.store.select(groupSelectors.selectGroups);
    this.loading$ = this.store.select(groupSelectors.selectGroupsLoading);
    this.error$ = this.store.select(groupSelectors.selectGroupsError);
    this.lastUpdateTimestamp$ = this.store.select(
      groupSelectors.selectLastUpdateTimestamp
    );
  }

  ngOnInit(): void {
    this.currentUserUid = localStorage.getItem('uid');
    this.subscribeToLoadGroups();

    this.subscribeToGroupCreateSuccess();
    this.subscribeToGroupCreateFailure();
    this.subscribeToGroupDeleteSuccess();
    this.subscribeToGroupDeleteFailure();

    this.subscribeToLoadGroupSuccess();
    console.log(`my uid is: ${localStorage.getItem('uid')}`);
    this.countdown$ = this.store.pipe(
      select(groupSelectors.selectHasUpdated),
      switchMap((hasUpdated) => {
        if (!hasUpdated) {
          return of(0);
        }
        return this.lastUpdateTimestamp$.pipe(
          switchMap((lastUpdate) => {
            const endTime = (lastUpdate || 0) + 60000;
            return interval(1000).pipe(
              startWith(0),
              map(() => Math.max(0, endTime - Date.now())),
              takeWhile((timeLeft) => timeLeft > 0, true)
            );
          })
        );
      }),
      startWith(60000)
    );
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
    this.actions$
      .pipe(
        ofType(GroupActions.loadGroupsSuccess),
        take(1) // Ensure it only reacts once to the next success action
      )
      .subscribe(() => {
        this.store.dispatch(GroupActions.setHasUpdated());
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

    /*     dialogRef.afterClosed().subscribe((result) => {
      if (result && result.name) {
        this.store.dispatch(
          GroupCreateActions.createGroup({ requestBody: { name: result.name } })
        );
      }
    }); */
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
