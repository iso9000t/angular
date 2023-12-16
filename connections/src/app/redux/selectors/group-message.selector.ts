import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupMessageState } from '../models/redux.models';

// Selector for the entire group message feature state
export const selectGroupMessageFeatureState =
  createFeatureSelector<GroupMessageState>('groupMessage');

// Selector for the messages array
export const selectGroupMessages = createSelector(
  selectGroupMessageFeatureState,
  (state: GroupMessageState) => state.messages
);

// Selector for the loading status
export const selectGroupMessagesLoading = createSelector(
  selectGroupMessageFeatureState,
  (state: GroupMessageState) => state.isLoading
);

// Selector for the error
export const selectGroupMessagesError = createSelector(
  selectGroupMessageFeatureState,
  (state: GroupMessageState) => state.error
);

// Selector for the last fetched timestamp
export const selectLastFetchedTimestamp = createSelector(
  selectGroupMessageFeatureState,
  (state: GroupMessageState) => state.lastFetched
);

// Selector for sorted messages
export const selectSortedGroupMessages = createSelector(
  selectGroupMessageFeatureState,
  (state: GroupMessageState) => {
    return [...state.messages].sort((a, b) => {
      const timeA = parseInt(a.createdAt.S, 10);
      const timeB = parseInt(b.createdAt.S, 10);
      return timeA - timeB; // For ascending order
      // Use `return timeB - timeA;` for descending order
    });
  }
);

// Selector for the timestamp of the latest message
export const selectLatestMessageTimestamp = createSelector(
  selectSortedGroupMessages,
  (sortedMessages) => {
    // If there are no messages, return null or a default value
    if (sortedMessages.length === 0) {
      return null;
    }

    // The last message in the sorted array is the most recent one
    const latestMessage = sortedMessages[sortedMessages.length - 1];
    return latestMessage.createdAt.S;
  }
);