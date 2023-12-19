import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupItem } from 'src/app/main/models/group.model';
import { GroupState } from '../models/redux.models';

const getUserUID = () => localStorage.getItem('uid');

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

export const selectGroupById = createSelector(
  selectGroupFeatureState,
  (state: GroupState, props: { groupId: string }) =>
    state.groups.find((group) => group.id.S === props.groupId)
);

export const isUserGroupCreator = createSelector(
  selectGroupById,
  (group: GroupItem | undefined) => {
    const userUID = getUserUID();
    return group ? group.createdBy?.S === userUID : false;
  }
);





