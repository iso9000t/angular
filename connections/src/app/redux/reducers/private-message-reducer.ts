import { createReducer, on } from '@ngrx/store';
import * as PrivateMessageActions from '../actions/private-message.action';
import { PrivateMessages, PrivateMessageState } from '../models/redux.models';

const initialPrivateMessages: PrivateMessages = {
  messages: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  initialLoadCompleted: false,
};

const initialPrivateMessageState: PrivateMessageState = {
  conversations: {},
};

export const privateMessageReducer = createReducer(
  initialPrivateMessageState,
  on(
    PrivateMessageActions.loadPrivateMessages,
    (state, { conversationId }) => ({
      ...state,
      conversations: {
        ...state.conversations,
        [conversationId]: {
          ...state.conversations[conversationId],
          isLoading: true,
          error: null,
        },
      },
    })
  ),
  on(
    PrivateMessageActions.loadPrivateMessagesSuccess,
    (state, { conversationId, messages }) => ({
      ...state,
      conversations: {
        ...state.conversations,
        [conversationId]: {
          messages,
          isLoading: false,
          error: null,
          lastFetched: Date.now(),
          initialLoadCompleted: true,
        },
      },
    })
  ),
  on(
    PrivateMessageActions.loadPrivateMessagesSince,
    (state, { conversationId }) => ({
      ...state,
      conversations: {
        ...state.conversations,
        [conversationId]: {
          ...state.conversations[conversationId],
          isLoading: true,
          error: null,
        },
      },
    })
  ),
  on(
    PrivateMessageActions.loadPrivateMessagesSinceSuccess,
    (state, { conversationId, newMessages }) => ({
      ...state,
      conversations: {
        ...state.conversations,
        [conversationId]: {
          ...state.conversations[conversationId],
          messages: [
            ...(state.conversations[conversationId]?.messages || []),
            ...newMessages,
          ],
          isLoading: false,
          error: null,
          lastFetched: Date.now(),
        },
      },
    })
  ),
  on(
    PrivateMessageActions.loadPrivateMessagesFailure,
    (state, { conversationId, error }) => ({
      ...state,
      conversations: {
        ...state.conversations,
        [conversationId]: {
          ...state.conversations[conversationId],
          isLoading: false,
          error,
        },
      },
    })
  ),
  on(
    PrivateMessageActions.loadPrivateMessagesSinceFailure,
    (state, { conversationId, error }) => ({
      ...state,
      conversations: {
        ...state.conversations,
        [conversationId]: {
          ...state.conversations[conversationId],
          isLoading: false,
          error,
        },
      },
    })
  ),
  on(
    PrivateMessageActions.resetPrivateMessageState,
    () => initialPrivateMessageState
  )
);
