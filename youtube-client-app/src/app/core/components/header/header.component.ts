import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ShowSearchResultsService } from "src/app/youtube/services/show-search-result/show-search-results.service";
import { SortOrder } from "src/enums/sort.enum";

import { SortFilterService } from "../../services/sort-filter.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
    filterKeyword: string = "";
    filterIsActive: boolean = false;
    showSearchResults: boolean = false;
    sortOrder: SortOrder = SortOrder.NONE;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private showSearchResultsService: ShowSearchResultsService,
        private sortFilterService: SortFilterService
    ) {}

    ngOnInit(): void {
        this.subscriptions = this.showSearchResultsService.showSearchResults$.subscribe(
            (isVisible) => {
                this.showSearchResults = isVisible;
            }
        );
        this.subscriptions.add(
            this.sortFilterService.filterKeyword$.subscribe((keyword) => {
                this.filterKeyword = keyword;
            })
        );
        this.subscriptions.add(
            this.sortFilterService.filterIsActive$.subscribe((isActive) => {
                this.filterIsActive = isActive;
            })
        );
        this.subscriptions.add(
            this.sortFilterService.sortOrder$.subscribe((order) => {
                this.sortOrder = order;
            })
        );
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    sortByDate(): void {
        this.sortFilterService.toggleSortOrder(
            this.sortOrder,
            SortOrder.DATE_ASC,
            SortOrder.DATE_DESC
        );
    }

    sortByViews() {
        this.sortFilterService.toggleSortOrder(
            this.sortOrder,
            SortOrder.VIEWS_ASC,
            SortOrder.VIEWS_DESC
        );
    }

    toggleFilter(): void {
        this.sortFilterService.toggleFilterIsActive();
    }

    onKeywordInput(value: string): void {
        this.filterKeyword = value;
        this.sortFilterService.setFilterKeyword(value);
    }

    onSearch() {
        this.showSearchResultsService.onSearch();
    }
}
