import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupMessageState, GroupMessages } from '../models/redux.models';

// Selector for the entire group message feature state
export const selectGroupMessageFeatureState =
  createFeatureSelector<GroupMessageState>('groupMessage');

// Helper selector to select a group's messages state by groupId
const selectGroupMessagesState = (groupId: string) =>
  createSelector(
    selectGroupMessageFeatureState,
    (state: GroupMessageState) =>
      state.groups[groupId] || {
        messages: [],
        isLoading: false,
        error: null,
        lastFetched: null,
      }
  );

// Selector for the messages array of a specific group
export const selectGroupMessages = (groupId: string) =>
  createSelector(
    selectGroupMessagesState(groupId),
    (groupMessages: GroupMessages) => groupMessages.messages
  );

// Selector for the loading status of a specific group
export const selectGroupMessagesLoading = (groupId: string) =>
  createSelector(
    selectGroupMessagesState(groupId),
    (groupMessages: GroupMessages) => groupMessages.isLoading
  );

// Selector for the error of a specific group
export const selectGroupMessagesError = (groupId: string) =>
  createSelector(
    selectGroupMessagesState(groupId),
    (groupMessages: GroupMessages) => groupMessages.error
  );

// Selector for the last fetched timestamp of a specific group
export const selectLastFetchedTimestamp = (groupId: string) =>
  createSelector(
    selectGroupMessagesState(groupId),
    (groupMessages: GroupMessages) => groupMessages.lastFetched
  );

// Selector for sorted messages of a specific group
export const selectSortedGroupMessages = (groupId: string) =>
  createSelector(
    selectGroupMessagesState(groupId),
    (groupMessages: GroupMessages) => {
      if (!groupMessages.messages) {
        return [];
      }

      // Create a new array from the original messages and then sort it
      return [...groupMessages.messages].sort((a, b) => {
        const timeA = parseInt(a.createdAt.S, 10);
        const timeB = parseInt(b.createdAt.S, 10);
        return timeA - timeB; // For ascending order
      });
    }
  );

// Selector for the timestamp of the latest message of a specific group
export const selectLatestMessageTimestamp = (groupId: string) =>
  createSelector(selectSortedGroupMessages(groupId), (sortedMessages) => {
    if (sortedMessages.length === 0) {
      return null;
    }
    const latestMessage = sortedMessages[sortedMessages.length - 1];
    return latestMessage.createdAt.S;
  });
  
export const selectInitialLoadCompleted = (groupId: string) =>
  createSelector(
    selectGroupMessagesState(groupId),
    (groupMessages: GroupMessages) => groupMessages.initialLoadCompleted
  );