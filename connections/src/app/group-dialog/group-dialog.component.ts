import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as GroupSelectors from '../redux/selectors/groups.selector';
import * as GroupMessageSelectors from '../redux/selectors/group-message.selector';
import * as GroupMessageActions from '../redux/actions/group-message.action';

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

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.groupID = this.route.snapshot.paramMap.get('groupID') || '';
    this.store.dispatch(
      GroupMessageActions.loadGroupMessages({ groupId: this.groupID })
    );

    this.store
      .select(GroupSelectors.isUserGroupCreator, { groupId: this.groupID })
      .subscribe((isCreator) => {
        this.isGroupCreator = isCreator;
        console.log('Is user the group creator?', isCreator);
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
