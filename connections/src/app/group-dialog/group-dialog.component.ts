import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as GroupSelectors from '../redux/selectors/groups.selector';
import * as GroupMessageSelectors from '../redux/selectors/group-message.selector';
import * as GroupMessageActions from '../redux/actions/group-message.action';
import * as Useractions from '../redux/actions/user.action';
import { Observable } from 'rxjs';
import { UserItem } from '../main/models/user.model';
import { GroupMessageItem } from '../main/models/group.model';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss'],
})
export class GroupDialogComponent implements OnInit {
  userUID = localStorage.getItem('uid');
  groupID!: string;
  isGroupCreator: boolean = false;
  messages$ = this.store.select(GroupMessageSelectors.selectGroupMessages);
  loading$ = this.store.select(
    GroupMessageSelectors.selectGroupMessagesLoading
  );
  error$ = this.store.select(GroupMessageSelectors.selectGroupMessagesError);
  sortedMessages$!: Observable<GroupMessageItem[]>;
  latestMessageTimestamp!: string | null; // Variable to store the latest message timestamp

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.groupID = this.route.snapshot.paramMap.get('groupID') || '';
    this.store.dispatch(
      GroupMessageActions.loadGroupMessages({ groupId: this.groupID })
    );
    this.store.dispatch(Useractions.loadUsers());

    this.store
      .select(GroupSelectors.isUserGroupCreator, { groupId: this.groupID })
      .subscribe((isCreator) => {
        this.isGroupCreator = isCreator;
        console.log('Is user the group creator?', isCreator);
      });

    this.sortedMessages$ = this.store.select(
      GroupMessageSelectors.selectSortedGroupMessages
    );

    // Subscribe to the latest message timestamp selector
    this.store
      .select(GroupMessageSelectors.selectLatestMessageTimestamp)
      .subscribe((timestamp) => {
        this.latestMessageTimestamp = timestamp;
        console.log('Latest message timestamp:', this.latestMessageTimestamp);
      });
  }

  onUpdate() {
    this.store.dispatch(
      GroupMessageActions.loadGroupMessages({ groupId: this.groupID })
    );
  }

  onDelete() {
    // Dispatch an action to delete the group if necessary
  }
}
