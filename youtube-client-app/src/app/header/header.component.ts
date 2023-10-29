import { Component } from "@angular/core";
import { SortOrder } from "src/enums/sort.enum";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
    searchTerm: string = "";
    filterKeyword: string = "";
    filterIsActive: boolean = false;
    showSearchResults: boolean = false;

    sortOrder: SortOrder = SortOrder.NONE;

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
        this.showSearchResults = true;
    }
}
