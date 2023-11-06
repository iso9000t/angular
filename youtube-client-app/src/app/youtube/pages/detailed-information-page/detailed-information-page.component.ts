import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { SearchItem } from "../../models/search-item.model";
import { SearchResponse } from "../../models/search-response.model";
import { YoutubeService } from "../../services/youtube/youtube.service";

@Component({
    selector: "app-detailed-information-page",
    templateUrl: "./detailed-information-page.component.html",
    styleUrls: ["./detailed-information-page.component.scss"],
})
export class DetailedInformationPageComponent implements OnInit {
    videoId: string | null = null;
    originalData: Partial<SearchResponse> = { items: [] };
    selectedItem?: SearchItem;
    private subscriptions: Subscription = new Subscription();
    constructor(
        private youtubeService: YoutubeService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.videoId = this.route.snapshot.paramMap.get("id");
        this.subscriptions.add(
            this.youtubeService.fetchData().subscribe((response) => {
                this.originalData = response;
                this.selectedItem = response.items.find(
                    (item) => item.id === this.videoId
                );
                if (!this.selectedItem) {
                    console.error(`No item found with id: ${this.videoId}`);
                }
            })
        );
    }

    goBack(): void {
        this.router.navigate(["/main/search-results"]);
    }
}
