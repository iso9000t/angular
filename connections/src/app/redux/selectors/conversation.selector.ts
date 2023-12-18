import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConversationItem } from 'src/app/main/models/conversation.model';
import { ConversationState } from '../models/redux.models';

// Selector for the entire conversation feature state
export const selectConversationFeatureState =
  createFeatureSelector<ConversationState>('conversation');

// Selector for the conversations array
export const selectConversations = createSelector(
  selectConversationFeatureState,
  (state: ConversationState) => state.conversations
);

// Selector for the loading status
export const selectConversationsLoading = createSelector(
  selectConversationFeatureState,
  (state: ConversationState) => state.isLoading
);

// Selector for the error
export const selectConversationsError = createSelector(
  selectConversationFeatureState,
  (state: ConversationState) => state.error
);

// Selector for the last update timestamp
export const selectLastConversationUpdateTimestamp = createSelector(
  selectConversationFeatureState,
  (state: ConversationState) => state.lastUpdated
);

// Selector for companionIDs from conversations
export const selectConversationCompanionIDs = createSelector(
  selectConversations,
  (conversations) => conversations.map(conversation => conversation.companionID.S)
);

// Selector for IDs from conversations
export const selectConversationIDs = createSelector(
  selectConversations,
  (conversations) => conversations.map(conversation => conversation.id.S)
);

// Add a new selector in conversation.selector.ts
export const selectConversationByCompanionId = createSelector(
  selectConversations,
  (conversations: ConversationItem[], props: { userId: string }) =>
    conversations.find(
      conversation => conversation.companionID.S === props.userId
    )
);
