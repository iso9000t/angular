import { Store } from "@ngrx/store";
import { SortFilterService } from "src/app/core/services/sort-filter/sort-filter.service";

import { SearchResultsComponent } from "./search-results.component";

describe("SearchResultsComponent", () => {
    let component: SearchResultsComponent;
    let sortFilterService: SortFilterService;
    let store: Store;
    beforeEach(() => {
        sortFilterService = new SortFilterService();
        component = new SearchResultsComponent(sortFilterService, store);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have initial properties set correctly", () => {
        expect(component.displayData).toEqual({ items: [] });
        expect(component.originalData).toEqual({ items: [] });
        expect(component.displayPageIndex).toBe(1);
        expect(component.isTimeoutActive).toBe(false);
    });
});
