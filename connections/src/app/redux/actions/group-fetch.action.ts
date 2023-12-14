import { createAction, props } from '@ngrx/store';
import { GroupError, GroupItem } from 'src/app/main/models/group.model';

export const loadGroups = createAction('[Groups] Load Group');

export const loadGroupsSuccess = createAction(
  '[Groups] Load Group Success',
  props<{ groups: GroupItem[] }>()
);

export const loadGroupsFailure = createAction(
    '[Groups] Load Group Failure',
    props<{ error: GroupError }>()
);

export const resetGroupState = createAction('[Groups] Reset Groups State');
