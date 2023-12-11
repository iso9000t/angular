import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  interval,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  take,
  takeWhile,
} from 'rxjs';
import {
  GroupError,
  GroupItem,
  GroupUpdateResponse,
} from '../models/group.model';
import { GroupService } from '../services/group.service';
import * as GroupActions from '../../redux/actions/group-fetch.action';
import { GroupState } from 'src/app/redux/models/redux.models';
import * as groupSelectors from '../../redux/selectors/groups.selector';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  groupData: GroupUpdateResponse | undefined = undefined;
  groups$!: Observable<GroupItem[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<GroupError | null>;
  lastUpdateTimestamp$!: Observable<number | null>;
  countdown$!: Observable<number>;
  hasUpdatedSuccessfully: boolean = false;

  constructor(
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
    this.store
      .pipe(select(groupSelectors.selectGroups), take(1))
      .subscribe((groups) => {
        if (groups.length === 0) {
          this.store.dispatch(GroupActions.loadGroups());
        }
      });

    // Listen for the loadGroupsSuccess action
    this.actions$.pipe(ofType(GroupActions.loadGroupsSuccess)).subscribe(() => {
      this.hasUpdatedSuccessfully = true;
    });

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
}
