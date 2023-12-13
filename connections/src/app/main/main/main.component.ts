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
import { GroupState } from 'src/app/redux/models/redux.models';
import * as groupSelectors from '../../redux/selectors/groups.selector';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { GroupNameDialogComponent } from '../group-name-dialog/group-name-dialog.component';

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

  constructor(
    public dialog: MatDialog,
    private groupService: GroupService,
    private store: Store<GroupState>,
    private actions$: Actions
  ) {
    this.groups$ = this.store.select(groupSelectors.selectGroups);
    this.loading$ = this.store.select(groupSelectors.selectGroupsLoading);
    this.error$ = this.store.select(groupSelectors.selectGroupsError);
    this.lastUpdateTimestamp$ = this.store.select(
      groupSelectors.selectLastUpdateTimestamp
    );
  }

  ngOnInit(): void {
    this.subscribeToLeadGroups();

    this.subscribeToLoadGroupSuccess();

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

  private subscribeToLeadGroups() {
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

  openDialog(): void {
    const dialogRef = this.dialog.open(GroupNameDialogComponent, {
      width: '360px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed. Result:', result);
      // Here you can handle the data returned from the dialog
      this.createGroup(result);
    });
  }

  private createGroup(groupName: GroupCreateRequestBody) {
    this.groupService.createGroup(groupName).subscribe({
      next: (data) => {
        this.myGroupData = data;
        console.log(this.myGroupData);
        // You might want to dispatch a success action or update state here
      },
      error: (error) => {
        console.error('Error creating group:', error);
        // Handle the error, maybe show a user-friendly message
      },
    });
  }
}
