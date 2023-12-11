import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  interval,
  map,
  Observable,
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

  constructor(
    private groupService: GroupService,
    private store: Store<GroupState>
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
    
   this.countdown$ = this.lastUpdateTimestamp$.pipe(
     switchMap((lastUpdate) => {
       const endTime = (lastUpdate || 0) + 60000; // 1 minute from the last update
       return interval(1000).pipe(
         startWith(0),
         map(() => {
           const timeLeft = Math.max(0, endTime - Date.now());
           return timeLeft;
         }),
         takeWhile((timeLeft) => timeLeft > 0, true) // true to include when timeLeft reaches 0
       );
     }),
     startWith(60000) // Initialize with 60 seconds
   );
  }

  updateGroups() {
    this.store.dispatch(GroupActions.loadGroups());
  }
}
