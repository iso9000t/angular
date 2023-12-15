import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.action';
import { UserState } from '../models/redux.models';

const initialUserState: UserState = {
  users: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadUsers, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    isLoading: false,
    error: null,
    lastUpdated: Date.now(),
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(UserActions.resetUserState, () => initialUserState)
);
