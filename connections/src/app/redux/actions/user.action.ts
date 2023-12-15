import { createAction, props } from '@ngrx/store';
import { UserError, UserItem } from 'src/app/main/models/user.model';

export const loadUsers = createAction('[Users] Load Users');

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: UserItem[] }>()
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: UserError }>()
);

export const resetUserState = createAction('[Users] Reset Users State');
