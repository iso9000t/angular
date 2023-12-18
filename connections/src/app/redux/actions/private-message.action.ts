import { createAction, props } from '@ngrx/store';
import { PrivateMessageItem, PrivateMessageError } from '../models/redux.models';

export const loadPrivateMessages = createAction(
  '[Private Messages] Load Private Messages',
  props<{ conversationId: string }>()
);

export const loadPrivateMessagesSuccess = createAction(
  '[Private Messages] Load Private Messages Success',
  props<{ conversationId: string; messages: PrivateMessageItem[] }>()
);

export const loadPrivateMessagesFailure = createAction(
  '[Private Messages] Load Private Messages Failure',
  props<{ conversationId: string; error: PrivateMessageError }>()
);

export const resetPrivateMessageState = createAction(
  '[Private Messages] Reset Private Messages State'
);

export const loadPrivateMessagesSince = createAction(
  '[Private Messages] Load Private Messages Since',
  props<{ conversationId: string; since: number }>()
);

export const loadPrivateMessagesSinceSuccess = createAction(
  '[Private Messages] Load Private Messages Since Success',
  props<{ conversationId: string; newMessages: PrivateMessageItem[] }>()
);

export const loadPrivateMessagesSinceFailure = createAction(
  '[Private Messages] Load Private Messages Since Failure',
  props<{ conversationId: string; error: PrivateMessageError }>()
);
