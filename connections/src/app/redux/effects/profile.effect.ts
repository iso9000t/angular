import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as ProfileActions from '../actions/profile-fetch.action';
import { ProfileService } from '../../profile/service/profile.service';
import { selectHasProfileData } from '../selectors/profile.selector';

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
}
