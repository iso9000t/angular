import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { selectFavoriteIds } from "src/app/redux/selectors/favorite.selectors";
import { YoutubeService } from "src/app/youtube/services/youtube/youtube.service";

import { VideoListResponse } from "../../models/favorite.model";

@Component({
    selector: "app-favorite",
    templateUrl: "./favorite.component.html",
    styleUrls: ["./favorite.component.scss"],
})
export class FavoriteComponent implements OnInit, OnDestroy {
    allFavoriteIds: string[] = [];
    favoriteVideos: VideoListResponse | null = null;
    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store, private youtubeService: YoutubeService) {}

    ngOnInit(): void {
        this.subscriptions = this.store
            .select(selectFavoriteIds)
            .subscribe((favoriteIds) => {
                this.allFavoriteIds = favoriteIds;
                this.fetchFavoriteVideos();
            });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private fetchFavoriteVideos(): void {
        if (this.allFavoriteIds.length > 0) {
            this.youtubeService
                .fetchVideosByIds(this.allFavoriteIds)
                .subscribe((response) => {
                    this.favoriteVideos = response;
                    console.log(
                        "The FAV video object is",
                        JSON.stringify(this.favoriteVideos, null, 2)
                    );
                });
        } else {
            this.favoriteVideos = null;
        }
    }

    onFavoriteToggled(videoId: string): void {
        console.log("favorite click", videoId);
        // Update the local favorite IDs array
        this.allFavoriteIds = this.allFavoriteIds.filter((id) => id !== videoId);
        // Refetch the favorite videos with the updated IDs
        this.fetchFavoriteVideos();
    }
}
