import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environent';
import { ConversationListResponse } from '../models/conversation.model';
import { GroupCreateRequestBody, GroupCreateResponse, GroupUpdateResponse } from '../models/group.model';
import { UserListResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groupListURL: string = `${environment.apiUrl}/groups/list`;
  private groupCreateURL: string = `${environment.apiUrl}/groups/create`;
  private groupDeleteURL: string = `${environment.apiUrl}/groups/delete`;
  private userListURL: string = `${environment.apiUrl}/users`;
  private conversationListURL: string = `${environment.apiUrl}/conversations/list`;

  constructor(private http: HttpClient) {}

  updateUserList(): Observable<UserListResponse> {
    console.log('Updating group list');
    return this.http.get<UserListResponse>(this.userListURL);
  }

  updateGroupList(): Observable<GroupUpdateResponse> {
    console.log('Updating group list');
    return this.http.get<GroupUpdateResponse>(this.groupListURL);
  }

  createGroup(
    groupName: GroupCreateRequestBody
  ): Observable<GroupCreateResponse> {
    console.log('Creating group list');

    return this.http.post<GroupCreateResponse>(this.groupCreateURL, groupName);
  }

  deleteGroup(groupId: string): Observable<void> {
    const urlWithParam = `${this.groupDeleteURL}?groupID=${groupId}`;
    return this.http.delete<void>(urlWithParam);
  }

  getConversationList(): Observable<ConversationListResponse> {
    return this.http.get<ConversationListResponse>(this.conversationListURL);
  }
}