import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { GroupService } from 'src/app/main/services/group.service';
import * as PrivateMessageActions from '../actions/private-message.action';
import { PrivateMessageError } from '../models/redux.models';


@Injectable()
export class PrivateMessageEffects {
  constructor(private actions$: Actions, private groupService: GroupService) {}

  loadPrivateMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivateMessageActions.loadPrivateMessages),
      mergeMap((action) =>
        this.groupService.getPrivateMessages(action.conversationId).pipe(
          map((response) =>
            PrivateMessageActions.loadPrivateMessagesSuccess({
              conversationId: action.conversationId,
              messages: response.Items,
            })
          ),
          catchError((error: PrivateMessageError) =>
            of(
              PrivateMessageActions.loadPrivateMessagesFailure({
                conversationId: action.conversationId,
                error,
              })
            )
          )
        )
      )
    )
  );

  loadPrivateMessagesSince$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivateMessageActions.loadPrivateMessagesSince),
      mergeMap((action) =>
        this.groupService
          .getPrivateMessagesSince(action.conversationId, action.since)
          .pipe(
            map((response) =>
              PrivateMessageActions.loadPrivateMessagesSinceSuccess({
                conversationId: action.conversationId,
                newMessages: response.Items,
              })
            ),
            catchError((error: PrivateMessageError) =>
              of(
                PrivateMessageActions.loadPrivateMessagesSinceFailure({
                  conversationId: action.conversationId,
                  error,
                })
              )
            )
          )
      )
    )
  );
}
