import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as GroupSelectors from '../redux/selectors/groups.selector';
import * as GroupMessageSelectors from '../redux/selectors/group-message.selector';
import * as GroupMessageActions from '../redux/actions/group-message.action';
import * as UserActions from '../redux/actions/user.action';
import * as UserSelector from '../redux/selectors/user.selector';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  GroupMessageItem,
  GroupMessageError,
} from 'src/app/main/models/group.model'; // Ensure GroupMessageError is imported

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss'],
})
export class GroupDialogComponent implements OnInit, OnDestroy {
  userUID = localStorage.getItem('uid');
  groupID!: string;
  isGroupCreator: boolean = false;

  messages$: Observable<GroupMessageItem[]> = this.store.select(
    GroupMessageSelectors.selectGroupMessages
  );
  loading$: Observable<boolean> = this.store.select(
    GroupMessageSelectors.selectGroupMessagesLoading
  );
  error$: Observable<GroupMessageError | null> = this.store.select(
    GroupMessageSelectors.selectGroupMessagesError
  );
  sortedMessages$: Observable<GroupMessageItem[]> = this.store.select(
    GroupMessageSelectors.selectSortedGroupMessages
  );
  latestMessageTimestamp: number = 0;
  lastUpdated$: Observable<number | null> = this.store.select(
    GroupMessageSelectors.selectLastFetchedTimestamp
  );
  private subscriptions = new Subscription();

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.groupID = this.route.snapshot.paramMap.get('groupID') || '';
    this.subscribeToLoadGroups();
    this.subscribeToLoadUsers();
    this.setupGroupCreatorSubscription();
    this.setupLatestMessageTimestampSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToLoadGroups() {
    this.subscriptions.add(
      this.store
        .pipe(select(GroupMessageSelectors.selectSortedGroupMessages), take(1))
        .subscribe((messages) => {
          if (messages.length === 0) {
            this.store.dispatch(
              GroupMessageActions.loadGroupMessages({ groupId: this.groupID })
            );
          }
        })
    );
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

  private setupGroupCreatorSubscription() {
    this.subscriptions.add(
      this.store
        .select(GroupSelectors.isUserGroupCreator, { groupId: this.groupID })
        .subscribe((isCreator) => {
          this.isGroupCreator = isCreator;
        })
    );
  }

  private setupLatestMessageTimestampSubscription() {
    this.subscriptions.add(
      this.store
        .select(GroupMessageSelectors.selectLatestMessageTimestamp)
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
  }

  onDelete() {
    // Dispatch an action to delete the group if necessary
  }
}
