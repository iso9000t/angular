import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LoginService } from "src/app/auth/services/login.service";
import { ShowSearchResultsService } from "src/app/core/services/show-search-result/show-search-results.service";
import { SortOrder } from "src/app/youtube/enums/sort.enum";
import { YoutubeService } from "src/app/youtube/services/youtube/youtube.service";

import { SortFilterService } from "../../services/sort-filter/sort-filter.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
    searchQuery: string = "";
    filterKeyword: string = "";
    filterIsActive: boolean = false;
    showSearchResults: boolean = false;
    sortOrder: SortOrder = SortOrder.NONE;
    username: string = "";
    isDisabled: boolean = true;
    isSearchDisabled: boolean = false;

    private subscriptions: Subscription = new Subscription();

    constructor(
        private showSearchResultsService: ShowSearchResultsService,
        private sortFilterService: SortFilterService,
        private router: Router,
        private loginService: LoginService,
        private youtubeService: YoutubeService,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.loginService.isLoggedInObservable().subscribe((isLoggedIn) => {
                this.isDisabled = !isLoggedIn;
                this.username = isLoggedIn ? this.loginService.getUsername() : "";
            })
        );

        this.isSearchDisabled = this.router.url === "/favorite";

        this.subscriptions.add(
            this.showSearchResultsService.showSearchResults$.subscribe(
                (isVisible) => {
                    this.showSearchResults = isVisible;
                }
            )
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

        this.subscriptions.add(
            this.youtubeService.searchTerms$.subscribe((term) => this.performSearch(term))
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

    sortByViews(): void {
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

    updateSearchQuery(searchWord: string): void {
        this.youtubeService.updateSearchQuery(searchWord);
    }

    performSearch(word: string): void {
        console.log("Search activated", word);

        if (this.router.url !== "/favorite") {
            this.onSearch();
        }
    }

    onSearch(): void {
        this.showSearchResultsService.onSearch();
        this.router.navigate(["/main/search-results"]);
    }

    logout(): void {
        this.loginService.logout();
        this.username = "";
    }
}
