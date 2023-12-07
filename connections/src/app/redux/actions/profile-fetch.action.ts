import { createAction, props } from '@ngrx/store';
import { ProfileResponse, ProfileError, NameData } from 'src/app/profile/models/profile.model';


export const loadProfile = createAction('[Profile] Load Profile');

export const loadProfileSuccess = createAction(
  '[Profile] Load Profile Success',
  props<{ profile: ProfileResponse }>()
);

export const loadProfileFailure = createAction(
  '[Profile] Load Profile Failure',
  props<{ error: ProfileError }>()
);

export const updateProfile = createAction(
  '[Profile] Update Profile',
  props<NameData>()
);

// Update Profile Success Action
export const updateProfileSuccess = createAction(
  '[Profile] Update Profile Success',
  props<{ updatedProfile: ProfileResponse }>()
);

// Update Profile Failure Action
export const updateProfileFailure = createAction(
  '[Profile] Update Profile Failure',
  props<{ error: string }>() // Expect a string instead of ProfileError
);
