import {
    Component, Input, OnChanges, OnInit
} from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { SortOrder } from "src/enums/sort.enum";

import { SearchResponse } from "../search-response.model";

@Component({
    selector: "app-search-results",
    templateUrl: "./search-results.component.html",
    styleUrls: ["./search-results.component.scss"],
})
export class SearchResultsComponent implements OnInit, OnChanges {
    displayData: Partial<SearchResponse> = { items: [] };
    originalData: Partial<SearchResponse> = { items: [] };

    @Input() filterKeyword = "";

    @Input() sortOrder: SortOrder = SortOrder.NONE;

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.dataService.fetchData().subscribe((response) => {
            this.originalData = response;
            this.displayData = structuredClone(this.originalData);
            this.sortData();
        });
    }

    ngOnChanges(): void {
        this.displayData = structuredClone(this.originalData);

        this.sortData();
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
