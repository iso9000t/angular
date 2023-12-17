import { createReducer, on } from '@ngrx/store';
import * as GroupMessageActions from '../actions/group-message.action';
import { GroupMessages, GroupMessageState } from '../models/redux.models';

const initialGroupMessages: GroupMessages = {
  messages: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  initialLoadCompleted: false 
};

const initialGroupMessageState: GroupMessageState = {
  groups: {},
};

export const groupMessageReducer = createReducer(
  initialGroupMessageState,
  on(GroupMessageActions.loadGroupMessages, (state, { groupId }) => ({
    ...state,
    groups: {
      ...state.groups,
      [groupId]: {
        ...state.groups[groupId],
        isLoading: true,
        error: null,
      },
    },
  })),
  on(
    GroupMessageActions.loadGroupMessagesSuccess,
    (state, { groupId, messages }) => ({
      ...state,
      groups: {
        ...state.groups,
        [groupId]: {
          messages,
          isLoading: false,
          error: null,
          lastFetched: Date.now(),
          initialLoadCompleted: true,
        },
      },
    })
  ),
  on(GroupMessageActions.loadGroupMessagesSince, (state, { groupId }) => ({
    ...state,
    groups: {
      ...state.groups,
      [groupId]: {
        ...state.groups[groupId],
        isLoading: true,
        error: null,
      },
    },
  })),
  on(
    GroupMessageActions.loadGroupMessagesSinceSuccess,
    (state, { groupId, newMessages }) => ({
      ...state,
      groups: {
        ...state.groups,
        [groupId]: {
          ...state.groups[groupId],
          messages: [
            ...(state.groups[groupId]?.messages || []),
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
    GroupMessageActions.loadGroupMessagesFailure,
    (state, { groupId, error }) => ({
      ...state,
      groups: {
        ...state.groups,
        [groupId]: {
          ...state.groups[groupId],
          isLoading: false,
          error,
        },
      },
    })
  ),
  on(
    GroupMessageActions.loadGroupMessagesSinceFailure,
    (state, { groupId, error }) => ({
      ...state,
      groups: {
        ...state.groups,
        [groupId]: {
          ...state.groups[groupId],
          isLoading: false,
          error,
        },
      },
    })
  ),
  on(GroupMessageActions.resetGroupMessageState, () => initialGroupMessageState)
);
