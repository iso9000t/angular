import {
    Component, OnDestroy, OnInit
} from "@angular/core";
import { Subscription } from "rxjs";
import { SortFilterService } from "src/app/core/services/sort-filter/sort-filter.service";
import { SortOrder } from "src/app/youtube/enums/sort.enum";

import { SearchResponse } from "../../models/search-response.model";
import { YoutubeService } from "../../services/youtube/youtube.service";

@Component({
    selector: "app-search-results",
    templateUrl: "./search-results.component.html",
    styleUrls: ["./search-results.component.scss"],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
    displayData: Partial<SearchResponse> = { items: [] };
    originalData: Partial<SearchResponse> = { items: [] };

    filterKeyword: string = "";
    private sortOrder: SortOrder = SortOrder.NONE;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private youtubeService: YoutubeService,
        private sortFilterService: SortFilterService
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.youtubeService.fetchData().subscribe((response) => {
                this.originalData = response;
                this.displayData = structuredClone(this.originalData);
                this.applyFilterAndSort();
            })
        );

        // Subscribe to sortOrder changes
        this.subscriptions.add(
            this.sortFilterService.sortOrder$.subscribe((order) => {
                this.sortOrder = order;
                this.applyFilterAndSort();
            })
        );

        // Subscribe to filterKeyword changes
        this.subscriptions.add(
            this.sortFilterService.filterKeyword$.subscribe((keyword) => {
                this.filterKeyword = keyword;
                this.applyFilterAndSort();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    applyFilterAndSort() {
        this.displayData = structuredClone(this.originalData);
        this.filterData();
        this.sortData();
    }
    filterData() {
        if (!this.filterKeyword) return;
        this.displayData.items = this.displayData.items?.filter((item) => item.snippet.title
            .toLowerCase()
            .includes(this.filterKeyword.toLowerCase()));
    }
    sortData() {
        if (!this.displayData.items) {
            return;
        }
        const sortedData = [...this.displayData.items];
        if (this.sortOrder === SortOrder.NONE) {
            return;
        }
        sortedData.sort((a, b) => {
            const dateA = new Date(a.snippet.publishedAt).getTime();
            const dateB = new Date(b.snippet.publishedAt).getTime();
            const viewsA = +a.statistics.viewCount;
            const viewsB = +b.statistics.viewCount;

            switch (this.sortOrder) {
                case SortOrder.DATE_ASC:
                    return dateA - dateB;
                case SortOrder.DATE_DESC:
                    return dateB - dateA;
                case SortOrder.VIEWS_ASC:
                    return viewsA - viewsB;
                case SortOrder.VIEWS_DESC:
                    return viewsB - viewsA;
                default:
                    return 0;
            }
        });

        this.displayData.items = sortedData;
    }
}
