import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { GroupService } from 'src/app/main/services/group.service';
import * as GroupActions from '../actions/group-fetch.action'
import { selectGroups } from '../selectors/groups.selector';
import * as CreateGroupActions from '../actions/group-create.action';
import { GroupError, GroupItem } from 'src/app/main/models/group.model';
import * as GroupDeleteActions from '../actions/group-delete.action';


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

  createGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreateGroupActions.createGroup),
      mergeMap((action) =>
        this.groupService.createGroup(action.requestBody).pipe(
          map((response) => {
            const newGroup: GroupItem = {
              id: { S: response.groupID },
              name: { S: action.requestBody.name },
              createdBy: { S: localStorage.getItem('uid') || 'defaultUserId' },
              createdAt: { S: new Date().getTime().toString() },
            };
            return CreateGroupActions.createGroupSuccess({ group: newGroup });
          }),
          catchError((error) =>
            of(
              CreateGroupActions.createGroupFailure({
                error: error as GroupError,
              })
            )
          )
        )
      )
    )
  );

  deleteGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupDeleteActions.deleteGroup),
      mergeMap((action) =>
        this.groupService.deleteGroup(action.groupId).pipe(
          map(() =>
            GroupDeleteActions.deleteGroupSuccess({ groupId: action.groupId })
          ),
          catchError((error) =>
            of(
              GroupDeleteActions.deleteGroupFailure({
                error: error as GroupError,
              })
            )
          )
        )
      )
    )
  );
}
     

 