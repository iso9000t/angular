import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShowSearchResultsService {
  private showSearchResultsSubject = new BehaviorSubject<boolean>(false);
  readonly showSearchResults$ = this.showSearchResultsSubject.asObservable();

  set showSearchResults(value: boolean) {
    this.showSearchResultsSubject.next(value);
  }

  get showSearchResults(): boolean {
    return this.showSearchResultsSubject.value;
  }

  onSearch() {
    this.showSearchResults = true;
  }
}
