import { createReducer, on } from '@ngrx/store';
import * as GroupActions from '../actions/group-fetch.action';
import { GroupState } from '../models/redux.models';
import * as GetGroupActions from '../actions/group-create.action';
import * as GroupDeleteActions from '../actions/group-delete.action';

const initialGroupState: GroupState = {
  groups: [],
  loading: false,
  error: null,
  lastUpdateTimestamp: null,
  hasUpdated: false,
};

export const groupReducer = createReducer(
  initialGroupState,
  on(GroupActions.loadGroups, (state: GroupState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GroupActions.loadGroupsSuccess, (state: GroupState, { groups }) => ({
    ...state,
    groups,
    loading: false,
    error: null,
    lastUpdateTimestamp: Date.now(),
  })),
  on(GroupActions.loadGroupsFailure, (state: GroupState, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GroupActions.resetGroupState, () => initialGroupState),
  on(GroupActions.setHasUpdated, (state) => ({
    ...state,
    hasUpdated: true,
  })),
  on(GetGroupActions.createGroup, (state) => ({
    ...state,
    loading: true,
    error: null, // Reset error state when starting a new operation
  })),

  // Handle successful group creation
  on(GetGroupActions.createGroupSuccess, (state, { group }) => ({
    ...state,
    groups: [...state.groups, group],
    loading: false, // Set loading to false as the operation is complete
  })),

  // Handle failure in group creation
  on(GetGroupActions.createGroupFailure, (state, { error }) => ({
    ...state,
    loading: false, // Set loading to false as the operation is complete
    error, // Update the error state with the received error
  })),
  on(GroupDeleteActions.deleteGroup, (state) => ({
    ...state,
    loading: true,
    error: null, // Reset error state when starting a new operation
  })),
  on(GroupDeleteActions.deleteGroupSuccess, (state, { groupId }) => ({
    ...state,
    groups: state.groups.filter((group) => group.id.S !== groupId),
    loading: false,
  })),
  on(GroupDeleteActions.deleteGroupFailure, (state, { error }) => ({
    ...state,
    error, // error is now of type GroupError
    loading: false,
  }))
);
