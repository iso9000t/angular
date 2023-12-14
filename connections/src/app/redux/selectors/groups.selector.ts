import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupState } from '../models/redux.models';


// Selector for the entire group feature state
export const selectGroupFeatureState =
  createFeatureSelector<GroupState>('group');

// Selector for the groups array
export const selectGroups = createSelector(
  selectGroupFeatureState,
  (state: GroupState) => state.groups
);

// Selector for the loading status
export const selectGroupsLoading = createSelector(
  selectGroupFeatureState,
  (state: GroupState) => state.loading
);

// Selector for the error
export const selectGroupsError = createSelector(
  selectGroupFeatureState,
  (state: GroupState) => state.error
);

// Selector for the last update timestamp
export const selectLastUpdateTimestamp = createSelector(
  selectGroupFeatureState,
  (state: GroupState) => state.lastUpdateTimestamp
);


