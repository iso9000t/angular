import { Component } from "@angular/core";

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

    sortOrder: "none" | "dateAsc" | "dateDesc" | "viewsAsc" | "viewsDesc" = "none";

    sortByDate() {
        if (this.sortOrder === "dateAsc") {
            this.sortOrder = "dateDesc";
        } else {
            this.sortOrder = "dateAsc";
        }
    }

    sortByViews() {
        if (this.sortOrder === "viewsAsc") {
            this.sortOrder = "viewsDesc";
        } else {
            this.sortOrder = "viewsAsc";
        }
    }

    toggleFilter() {
        this.filterIsActive = !this.filterIsActive;
        if (!this.filterIsActive) {
            this.sortOrder = "none";
            this.filterKeyword = "";
        }
    }

    onSearch() {
        this.showSearchResults = true;
    }
}
