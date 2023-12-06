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
        error: null
    })),
    on(ProfileActions.loadProfileFailure, (state: ProfileState, { error }) => ({
        ...state,
        profile: null,
        error: error.message
    }))
);