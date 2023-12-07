import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as ProfileActions from '../actions/profile-fetch.action';
import { ProfileService } from '../../profile/service/profile.service';
import { selectHasProfileData, selectProfile } from '../selectors/profile.selector';
import { ProfileError } from 'src/app/profile/models/profile.model';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
    private store: Store
  ) {}

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      withLatestFrom(this.store.pipe(select(selectHasProfileData))),
      switchMap(([action, hasProfileData]) => {
        if (!hasProfileData) {
          return this.profileService.getProfile().pipe(
            map((profile) => ProfileActions.loadProfileSuccess({ profile })),
            catchError((error) =>
              of(ProfileActions.loadProfileFailure({ error }))
            )
          );
        }
        return EMPTY;
      })
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap((action) => {
        console.log('Dispatching updateProfile action:', action); // Log the action
        return this.profileService.updateProfileName(action).pipe(
          withLatestFrom(this.store.pipe(select(selectProfile))),
          map(([response, currentProfile]) => {
            if (!currentProfile) {
              throw new Error('Current profile is null');
            }
            const updatedProfile = {
              ...currentProfile,
              name: { S: action.name },
            };
            return ProfileActions.updateProfileSuccess({ updatedProfile });
          }),
          catchError((error) => {
            console.log('Caught error in updateProfile effect:', error.message); // Log the error
            return of(
              ProfileActions.updateProfileFailure({ error: error.message })
            );
          })
        );
      })
    )
  );
}
