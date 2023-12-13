import { createAction, props } from '@ngrx/store';
import { GroupItem, GroupError, GroupCreateRequestBody } from 'src/app/main/models/group.model';


export const createGroup = createAction(
  '[Groups] Create Group',
  props<{ requestBody: GroupCreateRequestBody }>()
);

export const createGroupSuccess = createAction(
    '[Groups] Create Group Success',
    props<{ group: GroupItem }>()
);

export const createGroupFailure = createAction(
  '[Groups] Create Group Failure',
  props<{ error: GroupError }>()
);