import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, EMPTY, Observable } from "rxjs";

import { SearchResponse } from "../../models/search-response.model";

@Injectable({
    providedIn: "root",
})
export class YoutubeService {
    readonly url = "https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/angular/response.json";

    constructor(private http: HttpClient) {}

    fetchData(): Observable<SearchResponse> {
        return this.http.get<SearchResponse>(this.url).pipe(
            catchError((error) => {
                // eslint-disable-next-line no-console
                console.error("An error occurred while fetching:", error);
                return EMPTY;
            })
        );
    }
}
