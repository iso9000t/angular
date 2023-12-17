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
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss'],
})
export class GroupDialogComponent implements OnInit, OnDestroy {
  userUID = localStorage.getItem('uid');
  groupID!: string;
  isGroupCreator: boolean = false;
  itialLoadCompleted = false;
  initialLoadCompleted$: Observable<boolean> = this.store.select(
    GroupMessageSelectors.selectInitialLoadCompleted(this.groupID)
  );
  messages$: Observable<GroupMessageItem[]> = this.store.select(
    GroupMessageSelectors.selectGroupMessages(this.groupID)
  );
  loading$: Observable<boolean> = this.store.select(
    GroupMessageSelectors.selectGroupMessagesLoading(this.groupID)
  );
  error$: Observable<GroupMessageError | null> = this.store.select(
    GroupMessageSelectors.selectGroupMessagesError(this.groupID)
  );
  sortedMessages$: Observable<GroupMessageItem[]> = this.store.select(
    GroupMessageSelectors.selectSortedGroupMessages(this.groupID)
  );
  latestMessageTimestamp: number = 0;
  lastUpdated$: Observable<number | null> = this.store.select(
    GroupMessageSelectors.selectLastFetchedTimestamp(this.groupID)
  );
  private subscriptions = new Subscription();

  constructor(private store: Store, private route: ActivatedRoute) {}

  messageInput = new FormControl('', Validators.required);

  onSendMessage(): void {
    if (this.messageInput.valid) {
      const message = this.messageInput.value;
      console.log('Sending message:', message);
      this.messageInput.reset();
    }
  }

  ngOnInit(): void {
    this.groupID = this.route.snapshot.paramMap.get('groupID') || '';

    // Within ngOnInit()

    // Initialize Observables after setting groupID
    this.messages$ = this.store.select(
      GroupMessageSelectors.selectGroupMessages(this.groupID)
    );
    this.loading$ = this.store.select(
      GroupMessageSelectors.selectGroupMessagesLoading(this.groupID)
    );
    this.error$ = this.store.select(
      GroupMessageSelectors.selectGroupMessagesError(this.groupID)
    );
    this.sortedMessages$ = this.store.select(
      GroupMessageSelectors.selectSortedGroupMessages(this.groupID)
    );
    this.lastUpdated$ = this.store.select(
      GroupMessageSelectors.selectLastFetchedTimestamp(this.groupID)
    );
    this.initialLoadCompleted$ = this.store.select(
      GroupMessageSelectors.selectInitialLoadCompleted(this.groupID)
    );

    // Add this line to your subscriptions in ngOnInit or another appropriate place
    /* this.subscriptions.add(
      this.initialLoadCompleted$.subscribe((result) => {
        console.log('Second time',result);
      })
    ); */

    this.subscribeToLoadGroupMessages();
    this.subscribeToLoadUsers();
    this.setupGroupCreatorSubscription();
    this.setupLatestMessageTimestampSubscription();
    this.debugSelectors();
    this.checkInitialLoad();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private checkInitialLoad() {
    this.subscriptions.add(
      this.store
        .select(GroupMessageSelectors.selectInitialLoadCompleted(this.groupID))
        .subscribe((messages) => {
          console.log('Initial load is:', messages);
        })
    );
  }

  private subscribeToLoadGroupMessages() {
    // Create a new subscription
    const initialLoadSubscription = this.initialLoadCompleted$
      .pipe(take(1))
      .subscribe((initialLoadCompleted) => {
        if (initialLoadCompleted === true) {
          // Load new messages only
          this.store.dispatch(
            GroupMessageActions.loadGroupMessagesSince({
              groupId: this.groupID,
              since: this.latestMessageTimestamp,
            })
          );
        } else {
          // Load all messages initially (for false and undefined)
          this.store.dispatch(
            GroupMessageActions.loadGroupMessages({ groupId: this.groupID })
          );
        }
      });

    // Add the new subscription to this.subscriptions
    this.subscriptions.add(initialLoadSubscription);
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
        .select(
          GroupMessageSelectors.selectLatestMessageTimestamp(this.groupID)
        )
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

  private debugSelectors() {
    // Debugging sorted messages
    this.subscriptions.add(
      this.store
        .select(GroupMessageSelectors.selectSortedGroupMessages(this.groupID))
        .subscribe((messages) => {
          console.log('Sorted Messages B:', messages);
        })
    );

    // Debugging loading state
    this.subscriptions.add(
      this.loading$.subscribe((loading) => {
        console.log('Loading:', loading);
      })
    );

    // Debugging error state
    this.subscriptions.add(
      this.error$.subscribe((error) => {
        console.log('Error:', error);
      })
    );

    // Debugging last updated timestamp
    this.subscriptions.add(
      this.lastUpdated$.subscribe((lastUpdated) => {
        console.log('Last Updated Timestamp:', lastUpdated);
      })
    );

    // Debugging group creator status
    this.subscriptions.add(
      this.store
        .select(GroupSelectors.isUserGroupCreator, { groupId: this.groupID })
        .subscribe((isCreator) => {
          console.log('Is Group Creator:', isCreator);
        })
    );
  }
}
