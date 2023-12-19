import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environment/environent';
import { ConversationCreateResponse, ConversationListResponse } from '../models/conversation.model';
import { GroupCreateRequestBody, GroupCreateResponse, GroupMessageResponse, GroupUpdateResponse } from '../models/group.model';
import { PrivateMessageListResponse } from '../models/private-message.model';
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
  private conversationCreateURL: string = `${environment.apiUrl}/conversations/create`;
  private groupReadURL: string = `${environment.apiUrl}/groups/read`;
  private groupAppendURL: string = `${environment.apiUrl}/groups/append`;
  private conversationReadURL: string = `${environment.apiUrl}/conversations/read`;
  private conversationAppendURL: string = `${environment.apiUrl}/conversations/append`;
  private conversationDeleteURL: string = `${environment.apiUrl}/conversations/delete`;

  constructor(private http: HttpClient) {}

  updateUserList(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(this.userListURL).pipe(
      catchError((error) => {
        return throwError(error.error);
      })
    );
  }

  updateGroupList(): Observable<GroupUpdateResponse> {
    return this.http.get<GroupUpdateResponse>(this.groupListURL).pipe(
      catchError((error) => {
        return throwError(error.error);
      })
    );
  }

  createConversation(
    companionId: string
  ): Observable<ConversationCreateResponse> {
    const body = { companion: companionId };
    return this.http
      .post<ConversationCreateResponse>(this.conversationCreateURL, body)
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  createGroup(
    groupName: GroupCreateRequestBody
  ): Observable<GroupCreateResponse> {
    return this.http
      .post<GroupCreateResponse>(this.groupCreateURL, groupName)
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  deleteGroup(groupId: string): Observable<void> {
    const urlWithParam = `${this.groupDeleteURL}?groupID=${groupId}`;
    return this.http.delete<void>(urlWithParam).pipe(
      catchError((error) => {
        return throwError(error.error);
      })
    );
  }

  deleteConversation(conversationID: string): Observable<void> {
    const urlWithParam = `${this.conversationDeleteURL}?conversationID=${conversationID}`;
    return this.http.delete<void>(urlWithParam).pipe(
      catchError((error) => {
        return throwError(error.error);
      })
    );
  }

  getConversationList(): Observable<ConversationListResponse> {
    return this.http
      .get<ConversationListResponse>(this.conversationListURL)
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  getGroupMessages(groupId: string): Observable<GroupMessageResponse> {
    return this.http
      .get<GroupMessageResponse>(`${this.groupReadURL}?groupID=${groupId}`)
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  getGroupMessagesSince(
    groupId: string,
    since: number
  ): Observable<GroupMessageResponse> {
    return this.http
      .get<GroupMessageResponse>(
        `${this.groupReadURL}?groupID=${groupId}&since=${since}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  sendGroupMessage(groupId: string, message: string): Observable<void> {
    const body = {
      groupID: groupId,
      message: message,
    };
    return this.http.post<void>(this.groupAppendURL, body).pipe(
      catchError((error) => {
        return throwError(error.error);
      })
    );
  }

  sendPrivateMessage(
    conversationID: string,
    message: string
  ): Observable<void> {
    const body = {
      conversationID: conversationID,
      message: message,
    };
    return this.http.post<void>(this.conversationAppendURL, body);
  }

  getPrivateMessages(
    conversationID: string
  ): Observable<PrivateMessageListResponse> {
    return this.http
      .get<PrivateMessageListResponse>(
        `${this.conversationReadURL}?conversationID=${conversationID}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  getPrivateMessagesSince(
    conversationID: string,
    since: number
  ): Observable<PrivateMessageListResponse> {
    return this.http
      .get<PrivateMessageListResponse>(
        `${this.conversationReadURL}?conversationID=${conversationID}&since=${since}`
      )
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }
}
