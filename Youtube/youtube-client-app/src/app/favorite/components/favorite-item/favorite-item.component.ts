import {
    Component, EventEmitter, Input, OnInit, Output
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as FavoriteActions from "src/app/redux/actions/favorite.actions";

import { VideoItem } from "../../models/favorite.model";

@Component({
    selector: "app-favorite-item",
    templateUrl: "./favorite-item.component.html",
    styleUrls: ["./favorite-item.component.scss"],
})
export class FavoriteItemComponent implements OnInit {
    @Input() item!: VideoItem;
    @Output() favoriteToggled = new EventEmitter<string>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store
    ) {}

    ngOnInit(): void {
        console.log(`the favorite id is  ${this.item.id}`);
    }

    toggleFavorite(videoId: string): void {
        this.store.dispatch(
            FavoriteActions.removeFromFavorite({ cardId: videoId })
        );
        this.favoriteToggled.emit(videoId);
    }

    onMoreButtonClick(): void {
        this.router.navigate([this.item.id], { relativeTo: this.route });
    }
}
