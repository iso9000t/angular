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
