import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";

import { SearchResponse } from "../search-response.model";

@Component({
    selector: "app-search-results",
    templateUrl: "./search-results.component.html",
    styleUrls: ["./search-results.component.scss"],
})
export class SearchResultsComponent implements OnInit {
    data!: SearchResponse;

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.dataService.fetchData().subscribe((response) => {
            this.data = response;
            console.log(this.data);
        });
    }
}
