import { createAction, props } from '@ngrx/store';
import {
  ConversationError,
  ConversationItem,
} from 'src/app/main/models/conversation.model';

export const loadConversations = createAction(
  '[Conversations] Load Conversations'
);

export const loadConversationsSuccess = createAction(
  '[Conversations] Load Conversations Success',
  props<{ conversations: ConversationItem[] }>()
);

export const loadConversationsFailure = createAction(
  '[Conversations] Load Conversations Failure',
  props<{ error: ConversationError }>()
);

export const resetConversationState = createAction(
  '[Conversations] Reset Conversations State'
);

export const deleteConversation = createAction(
  '[Conversations] Delete Conversation',
  props<{ conversationId: string }>()
);

export const deleteConversationSuccess = createAction(
  '[Conversations] Delete Conversation Success',
  props<{ conversationId: string }>()
);

export const deleteConversationFailure = createAction(
  '[Conversations] Delete Conversation Failure',
  props<{ error: ConversationError }>()
);
