import { createAction, props } from '@ngrx/store';
import { GroupError } from 'src/app/main/models/group.model';

export const deleteGroup = createAction(
  '[Groups] Delete Group',
  props<{ groupId: string }>()
);

export const deleteGroupSuccess = createAction(
  '[Groups] Delete Group Success',
  props<{ groupId: string }>()
);

export const deleteGroupFailure = createAction(
  '[Groups] Delete Group Failure',
  props<{ error: GroupError }>()
);
