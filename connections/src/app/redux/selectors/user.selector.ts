import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../models/redux.models';


// Selector for the entire user feature state
export const selectUserFeatureState = createFeatureSelector<UserState>('user');

//users except for the current one
export const selectUsersExceptCurrent = (currentUserUid: string) =>
  createSelector(selectUserFeatureState, (state: UserState) =>
    state.users.filter((user) => user.uid.S !== currentUserUid)
  );

// Selector for the users array
export const selectUsers = createSelector(
  selectUserFeatureState,
  (state: UserState) => state.users
);


// Selector for the loading status
export const selectUsersLoading = createSelector(
  selectUserFeatureState,
  (state: UserState) => state.isLoading
);

// Selector for the error
export const selectUsersError = createSelector(
  selectUserFeatureState,
  (state: UserState) => state.error
);

// Selector for the last update timestamp
export const selectLastUserUpdateTimestamp = createSelector(
  selectUserFeatureState,
  (state: UserState) => state.lastUpdated
);

