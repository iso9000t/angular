import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PrivateMessageState, PrivateMessages } from "../models/redux.models";

// Selector for the entire private message feature state
export const selectPrivateMessageFeatureState =
  createFeatureSelector<PrivateMessageState>('privateMessage');

// Helper selector to select a conversation's messages state by conversationId
const selectPrivateMessagesState = (conversationId: string) =>
  createSelector(
    selectPrivateMessageFeatureState,
    (state: PrivateMessageState) =>
      state.conversations[conversationId] || {
        messages: [],
        isLoading: false,
        error: null,
        lastFetched: null,
        initialLoadCompleted: false,
      }
  );

// Selector for the messages array of a specific conversation
export const selectPrivateMessages = (conversationId: string) =>
  createSelector(
    selectPrivateMessagesState(conversationId),
    (conversationMessages: PrivateMessages) => conversationMessages.messages
  );

// Selector for the loading status of a specific conversation
export const selectPrivateMessagesLoading = (conversationId: string) =>
  createSelector(
    selectPrivateMessagesState(conversationId),
    (conversationMessages: PrivateMessages) => conversationMessages.isLoading
  );

// Selector for the error of a specific conversation
export const selectPrivateMessagesError = (conversationId: string) =>
  createSelector(
    selectPrivateMessagesState(conversationId),
    (conversationMessages: PrivateMessages) => conversationMessages.error
  );

// Selector for the last fetched timestamp of a specific conversation
export const selectLastFetchedTimestamp = (conversationId: string) =>
  createSelector(
    selectPrivateMessagesState(conversationId),
    (conversationMessages: PrivateMessages) => conversationMessages.lastFetched
  );

// Selector for sorted messages of a specific conversation
export const selectSortedPrivateMessages = (conversationId: string) =>
  createSelector(
    selectPrivateMessagesState(conversationId),
    (conversationMessages: PrivateMessages) => {
      if (!conversationMessages.messages) {
        return [];
      }

      // Create a new array from the original messages and then sort it
      return [...conversationMessages.messages].sort((a, b) => {
        const timeA = parseInt(a.createdAt.S, 10);
        const timeB = parseInt(b.createdAt.S, 10);
        return timeA - timeB; // For ascending order
      });
    }
  );

// Selector for the timestamp of the latest message of a specific conversation
export const selectLatestMessageTimestamp = (conversationId: string) =>
  createSelector(
    selectSortedPrivateMessages(conversationId),
    (sortedMessages) => {
      if (sortedMessages.length === 0) {
        return null;
      }
      const latestMessage = sortedMessages[sortedMessages.length - 1];
      return latestMessage.createdAt.S;
    }
  );

export const selectInitialLoadCompleted = (conversationId: string) =>
  createSelector(
    selectPrivateMessagesState(conversationId),
    (conversationMessages: PrivateMessages) =>
      conversationMessages.initialLoadCompleted
  );
