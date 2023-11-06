import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { SearchItem } from "../../models/search-item.model";

@Component({
    selector: "app-search-item",
    templateUrl: "./search-item.component.html",
    styleUrls: ["./search-item.component.scss"],
})
export class SearchItemComponent {
    @Input() item!: SearchItem;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { }

    onMoreButtonClick(): void {
        this.router.navigate([this.item.id], { relativeTo: this.route });
    }
}
