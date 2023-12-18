import { Component, OnDestroy, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { PrivateMessageListResponse } from '../main/models/private-message.model';
import { GroupService } from '../main/services/group.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit, OnDestroy {
  userUID = localStorage.getItem('uid');
  conversationID!: string;
  messages!: PrivateMessageListResponse;
  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute
  ) {}

   ngOnInit(): void {
    this.conversationID = this.route.snapshot.paramMap.get('conversationID') || '';
    console.log('Conversation ID:', this.conversationID);

    if (this.conversationID) {
      this.groupService.getPrivateMessages(this.conversationID).subscribe({
        next: (response) => {
          console.log('Messages:', response);
         console.log(response)// Assign the array of messages
        },
        error: (error) => console.error('Error fetching messages:', error),
      });
    }
  }

  ngOnDestroy(): void {}
}
