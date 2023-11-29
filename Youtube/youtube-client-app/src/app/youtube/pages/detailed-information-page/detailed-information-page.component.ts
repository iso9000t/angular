import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import {
    addToFavorite,
    removeFromFavorite,
} from "src/app/redux/actions/favorite.actions";
import { selectFavoriteIds } from "src/app/redux/selectors/favorite.selectors";

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
    favoriteIds$!: Observable<string[]>;
    isFavorite: boolean = false;

    private subscriptions: Subscription = new Subscription();
    constructor(
        private youtubeService: YoutubeService,
        private route: ActivatedRoute,
        private store: Store
    ) {}

    ngOnInit(): void {
        this.favoriteIds$ = this.store.select(selectFavoriteIds);
        this.videoId = this.route.snapshot.paramMap.get("id");
        if (this.videoId) {
            this.subscriptions.add(
                this.youtubeService
                    .fetchVideoDetails(this.videoId)
                    .subscribe((videoDetails) => {
                        this.selectedItem = videoDetails;
                    })
            );
        }
        this.subscribeToFavId();
    }

    // eslint-disable-next-line class-methods-use-this
    goBack(): void {
        window.history.back();
    }

    get dislikeCount(): number {
        const likeCount = Number(this.selectedItem?.statistics?.likeCount) || 0;
        return Math.round(likeCount * 0.1);
    }
    private subscribeToFavId() {
        this.subscriptions.add(
            this.favoriteIds$.subscribe((favoriteIds) => {
                this.isFavorite = favoriteIds.includes(this.videoId || "");
            })
        );
    }

    addCardToFavorites(cardId: string): void {
        this.store.dispatch(addToFavorite({ cardId }));
    }

    removeCardFromFavorites(cardId: string): void {
        this.store.dispatch(removeFromFavorite({ cardId }));
    }

    toggleFavoriteStatus(): void {
        if (this.videoId) {
            if (this.isFavorite) {
                this.removeCardFromFavorites(this.videoId);
            } else {
                this.addCardToFavorites(this.videoId);
            }
        }
    }
}
