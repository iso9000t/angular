import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { SearchResponse } from "../../models/search-response.model";

@Injectable({ providedIn: "root" })
export class SearchStateService {
    private searchResultSource = new BehaviorSubject<Partial<SearchResponse>>({
        items: [],
    });
    currentSearchResult = this.searchResultSource.asObservable();

    updateSearchResult(result: Partial<SearchResponse>) {
        this.searchResultSource.next(result);
    }
}
