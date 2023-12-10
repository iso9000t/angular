import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GroupError, GroupItem, GroupUpdateResponse } from '../models/group.model';
import { GroupService } from '../services/group.service';
import * as GroupActions from '../../redux/actions/group-fetch.action';
import { GroupState } from 'src/app/redux/models/redux.models';
import * as gropuSelectors from '../../redux/selectors/groups.selector';

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

  constructor(
    private groupService: GroupService,
    private store: Store
  ) {
    this.groups$ = this.store.select(gropuSelectors.selectGroups);
    this.loading$ = this.store.select(gropuSelectors.selectGroupsLoading);
    this.error$ = this.store.select(gropuSelectors.selectGroupsError);
    this.lastUpdateTimestamp$ = this.store.select(gropuSelectors.selectLastUpdateTimestamp);
  }

  ngOnInit(): void {
    this.updateGroups();
  }

  updateGroups() {
    this.store.dispatch(GroupActions.loadGroups());
    /*     console.log('Update button clicked');
        this.groupService.updateGroupList().subscribe(
          (response: GroupUpdateResponse) => {
            console.log('Group list updated:', response);
            this.groupData = response;
          },
          (error) => {
            console.error('Error updating group list:', error.message);
            // Handle the error here
          }
        ); */
  }
}
