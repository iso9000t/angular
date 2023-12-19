import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ConversationActions from '../actions/conversation.actions';
import { ConversationError } from 'src/app/main/models/conversation.model';
import { GroupService } from 'src/app/main/services/group.service';

@Injectable()
export class ConversationEffects {
  constructor(private actions$: Actions, private groupService: GroupService) {}

  loadConversations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.loadConversations),
      mergeMap(() =>
        this.groupService.getConversationList().pipe(
          map((response) =>
            ConversationActions.loadConversationsSuccess({
              conversations: response.Items,
            })
          ),
          catchError((error) =>
            of(
              ConversationActions.loadConversationsFailure({
                error: error as ConversationError,
              })
            )
          )
        )
      )
    )
  );

  deleteConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.deleteConversation),
      mergeMap((action) =>
        this.groupService.deleteConversation(action.conversationId).pipe(
          map(() =>
            ConversationActions.deleteConversationSuccess({
              conversationId: action.conversationId,
            })
          ),
          catchError((error) =>
            of(
              ConversationActions.deleteConversationFailure({
                error: error as ConversationError,
              })
            )
          )
        )
      )
    )
  );
}
