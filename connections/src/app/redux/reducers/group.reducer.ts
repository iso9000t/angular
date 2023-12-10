import { createReducer, on } from '@ngrx/store';
import * as GroupActions from '../actions/group-fetch.action';
import { GroupState } from '../models/redux.models';

const initialGroupState: GroupState = {
  groups: [],
  loading: false,
  error: null,
  lastUpdateTimestamp: null
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
  }))
);