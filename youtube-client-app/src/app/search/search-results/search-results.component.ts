import {
    Component, Input, OnChanges, OnInit
} from "@angular/core";
import { DataService } from "src/app/services/data.service";

import { SearchResponse } from "../search-response.model";

@Component({
    selector: "app-search-results",
    templateUrl: "./search-results.component.html",
    styleUrls: ["./search-results.component.scss"],
})
export class SearchResultsComponent implements OnInit, OnChanges {
    data!: SearchResponse;

    @Input() filterKeyword = "";

    @Input() sortOrder:
    | "none"
    | "dateAsc"
    | "dateDesc"
    | "viewsAsc"
    | "viewsDesc" = "none";

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.dataService.fetchData().subscribe((response) => {
            this.data = response;
            this.sortData();
        });
    }

    ngOnChanges(): void {
        this.dataService.fetchData().subscribe((response) => {
            this.data = response;
            this.sortData();
        });
        this.sortData();
    }

    sortData() {
        const sortedData = [...this.data.items];
        if (this.sortOrder === "none") {
            return;
        }
        sortedData.sort((a, b) => {
            const dateA = new Date(a.snippet.publishedAt).getTime();
            const dateB = new Date(b.snippet.publishedAt).getTime();
            const viewsA = +a.statistics.viewCount;
            const viewsB = +b.statistics.viewCount;

            switch (this.sortOrder) {
                case "dateAsc":
                    return dateA - dateB;
                case "dateDesc":
                    return dateB - dateA;
                case "viewsAsc":
                    return viewsA - viewsB;
                case "viewsDesc":
                    return viewsB - viewsA;
                default:
                    return 0;
            }
        });

        this.data.items = sortedData;
    }
}
