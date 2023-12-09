import { createReducer, on } from '@ngrx/store';
import * as ProfileActions from '../actions/profile-fetch.action';
import { ProfileResponse } from 'src/app/profile/models/profile.model';
import { ProfileState } from '../models/redux.models';


export const initialState: ProfileState = {
    profile: null,
    error: null,
}

export const profileReducer = createReducer(
  initialState,
  on(ProfileActions.loadProfileSuccess, (state: ProfileState, { profile }) => ({
    ...state,
    profile,
    error: null,
  })),
  on(ProfileActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    error: error, // This should update the error in the state
    // Decide if I want to keep or change the profile field
  })),
  on(ProfileActions.updateProfileSuccess, (state, { updatedProfile }) => ({
    ...state,
    profile: updatedProfile,
    error: null,
  })),
  on(ProfileActions.resetProfileState, () => initialState)
);