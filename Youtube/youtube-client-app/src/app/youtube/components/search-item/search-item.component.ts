import {
    Component, Input, OnDestroy, OnInit
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { selectFavoriteIds } from "src/app/redux/selectors/favorite.selectors";

import * as FavoriteActions from "../../../redux/actions/favorite.actions";
import { SearchItem } from "../../models/search-item.model";

@Component({
    selector: "app-search-item",
    templateUrl: "./search-item.component.html",
    styleUrls: ["./search-item.component.scss"],
})
export class SearchItemComponent implements OnInit, OnDestroy {
    @Input() item!: SearchItem;
    isFavorite: boolean = false;
    allFavoriteIds: string[] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store
    ) {}
    private subscription: Subscription = new Subscription();

    onMoreButtonClick(): void {
        this.router.navigate([this.item.id.videoId], { relativeTo: this.route });
    }

    get dislikeCount(): number {
        const likeCount = Number(this.item.statistics?.likeCount) || 0;
        return Math.round(likeCount * 0.1);
    }

    toggleFavorite(videoId: string): void {
        if (this.isFavorite) {
            this.store.dispatch(
                FavoriteActions.removeFromFavorite({ cardId: videoId })
            );
            console.log("removed", videoId);
        } else {
            this.store.dispatch(FavoriteActions.addToFavorite({ cardId: videoId }));
            console.log("Added", videoId);
        }
    }

    ngOnInit(): void {
        this.subscription = this.store
            .select(selectFavoriteIds)
            .subscribe((favoriteIds) => {
                this.allFavoriteIds = favoriteIds;
                this.isFavorite = this.allFavoriteIds.includes(this.item.id.videoId);
                this.allFavoriteIds = favoriteIds;
                console.log("FAVORITE IDS: ", this.allFavoriteIds);
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
