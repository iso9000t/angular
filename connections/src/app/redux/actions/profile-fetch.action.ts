import { createAction, props } from '@ngrx/store';
import { ProfileResponse, ProfileError } from 'src/app/profile/models/profile.model';


export const loadProfile = createAction('[Profile] Load Profile');

export const loadProfileSuccess = createAction(
  '[Profile] Load Profile Success',
  props<{ profile: ProfileResponse }>()
);

export const loadProfileFailure = createAction(
  '[Profile] Load Profile Failure',
  props<{ error: ProfileError }>()
);
