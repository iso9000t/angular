import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { GroupService } from 'src/app/main/services/group.service';
import * as GroupActions from '../actions/group-fetch.action'
import { selectGroups } from '../selectors/groups.selector';


@Injectable()
export class GroupEffects {
  constructor(
    private actions$: Actions,
    private groupService: GroupService,
    private store: Store
  ) {}

  loadGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupActions.loadGroups),
      mergeMap(() =>
        this.groupService.updateGroupList().pipe(
          map((response) =>
            GroupActions.loadGroupsSuccess({ groups: response.Items })
          ),
          catchError((error) => of(GroupActions.loadGroupsFailure({ error })))
        )
      )
    )
  );
}
     

 