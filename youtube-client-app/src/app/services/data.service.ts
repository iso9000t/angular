import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

import { SearchResponse } from "../search/search-response.model";

@Injectable({
  providedIn: 'root',
})
export class DataService {
   readonly url =
    'https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/angular/response.json';

  constructor(private http: HttpClient) {}

  fetchData(): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(this.url).pipe(
      catchError((error) => {
        console.error('An error occurred while fetching:', error);
        return throwError(
          () => new Error('Something went wrong; please try again later.')
        );
      })
    );
  }
}
