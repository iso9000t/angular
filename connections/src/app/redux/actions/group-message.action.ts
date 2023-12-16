import { createAction, props } from '@ngrx/store';
import {
  GroupMessageError,
  GroupMessageItem,
} from 'src/app/main/models/group.model';

export const loadGroupMessages = createAction(
  '[Group Messages] Load Group Messages',
  props<{ groupId: string }>()
);

export const loadGroupMessagesSuccess = createAction(
  '[Group Messages] Load Group Messages Success',
  props<{ groupId: string; messages: GroupMessageItem[] }>()
);

export const loadGroupMessagesFailure = createAction(
  '[Group Messages] Load Group Messages Failure',
  props<{ error: GroupMessageError }>()
);

export const resetGroupMessageState = createAction(
  '[Group Messages] Reset Group Messages State'
);

export const loadGroupMessagesSince = createAction(
  '[Group Messages] Load Group Messages Since',
  props<{ groupId: string; since: number }>()
);

export const loadGroupMessagesSinceSuccess = createAction(
  '[Group Messages] Load Group Messages Since Success',
  props<{ newMessages: GroupMessageItem[] }>()
);

export const loadGroupMessagesSinceFailure = createAction(
  '[Group Messages] Load Group Messages Since Failure',
  props<{ error: GroupMessageError }>()
);
