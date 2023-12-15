import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GroupService } from 'src/app/main/services/group.service';
import * as UserActions from '../actions/user.action';
import { UserError } from 'src/app/main/models/user.model';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private groupService: GroupService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.groupService.updateUserList().pipe(
          map((response) =>
            UserActions.loadUsersSuccess({ users: response.Items })
          ),
          catchError((error) =>
            of(UserActions.loadUsersFailure({ error: error as UserError }))
          )
        )
      )
    )
  );
}
