import { createReducer, on } from '@ngrx/store';
import * as GroupMessageActions from '../actions/group-message.action';
import { GroupMessageState } from '../models/redux.models';

const initialGroupMessageState: GroupMessageState = {
  messages: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const groupMessageReducer = createReducer(
  initialGroupMessageState,
  on(GroupMessageActions.loadGroupMessages, (state: GroupMessageState) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(
    GroupMessageActions.loadGroupMessagesSince,
    (state: GroupMessageState) => ({
      ...state,
      isLoading: true,
      error: null, // Optionally reset the error state
    })
  ),
  on(
    GroupMessageActions.loadGroupMessagesSuccess,
    (state: GroupMessageState, { groupId, messages }) => ({
      ...state,
      messages,
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    })
  ),
  on(
    GroupMessageActions.loadGroupMessagesSinceSuccess,
    (state: GroupMessageState, { newMessages }) => ({
      ...state,
      messages: [...state.messages, ...newMessages], // Append new messages
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    })
  ),
  on(
    GroupMessageActions.loadGroupMessagesFailure,
    (state: GroupMessageState, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })
  ),
  on(
    GroupMessageActions.loadGroupMessagesSinceFailure,
    (state: GroupMessageState, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })
  ),
  on(GroupMessageActions.resetGroupMessageState, () => initialGroupMessageState)
);
