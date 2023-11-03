import { Component, OnDestroy, OnInit } from "@angular/core";
import { SortOrder } from "src/enums/sort.enum";
import { ShowSearchResultsService } from "../services/show-search-results.service";
import { Subscription } from "rxjs"
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
    private subscription: Subscription = new Subscription();

    constructor(private showSearchResultsService: ShowSearchResultsService) { };
    
    ngOnInit(): void {
        // Subscribe to the observable provided by the service.
        this.subscription = this.showSearchResultsService.showSearchResults$.subscribe((isVisible) => {
            this.showSearchResults = isVisible;
        });
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    sortByDate() {
        if (this.sortOrder === SortOrder.DATE_ASC) {
            this.sortOrder = SortOrder.DATE_DESC;
        } else {
            this.sortOrder = SortOrder.DATE_ASC;
        }
    }

    sortByViews() {
        if (this.sortOrder === SortOrder.VIEWS_ASC) {
            this.sortOrder = SortOrder.VIEWS_DESC;
        } else {
            this.sortOrder = SortOrder.VIEWS_ASC;
        }
    }

    toggleFilter() {
        this.filterIsActive = !this.filterIsActive;
        if (!this.filterIsActive) {
            this.sortOrder = SortOrder.NONE;
            this.filterKeyword = "";
        }
    }

    onSearch() {
        this.showSearchResultsService.onSearch();
        console.log(this.showSearchResultsService.showSearchResults);
    }
}
