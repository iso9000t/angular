import { Pipe, PipeTransform } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserState } from '../redux/models/redux.models';
import { selectUsers } from '../redux/selectors/user.selector';

@Pipe({
  name: 'userName',
  pure: false,
})
export class UserNamePipe implements PipeTransform {
  constructor(private store: Store<UserState>) {}

  transform(userId: string): Observable<string> {
    if (!userId) {
      return of('Unknown User');
    }
    return this.store.pipe(
      select(selectUsers),
      map(
        (users) =>
          users.find((user) => user.uid.S === userId)?.name.S || 'Unknown User'
      )
    );
  }
}
