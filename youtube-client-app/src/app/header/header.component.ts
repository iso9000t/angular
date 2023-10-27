import { Component } from "@angular/core";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
    searchTerm: string = "";
    filterIsActive: boolean = false;

    toggleFilter() {
        this.filterIsActive = !this.filterIsActive;
        console.log(this.filterIsActive);// Check if it is active
    }

    onSearch() {
        console.log("Searching for:", this.searchTerm);
    // Add my search logic here
    }
}
