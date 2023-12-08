import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from '../models/redux.models';


export const selectProfileFeature =
  createFeatureSelector<ProfileState>('profile');

export const selectProfile = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.profile
);

export const selectProfileError = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.error
);

export const selectHasProfileData = createSelector(
  selectProfileFeature,
  (profileState) => Boolean(profileState.profile)
);
