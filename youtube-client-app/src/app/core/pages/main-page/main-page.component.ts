import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { ShowSearchResultsService } from "../../services/show-search-result/show-search-results.service";

@Component({
    templateUrl: "./main-page.component.html",
    styleUrls: ["./main-page.component.scss"],
})
export class MainPageComponent implements OnInit, OnDestroy {
    showSearchResults: boolean = false;
    private subscriptions: Subscription = new Subscription();
    constructor(private showSearchResultsService: ShowSearchResultsService) {}
    ngOnInit(): void {
        this.subscriptions = this.showSearchResultsService.showSearchResults$.subscribe(
            (isVisible) => {
                this.showSearchResults = isVisible;
            }
        );
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
