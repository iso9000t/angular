import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { YoutubeModule } from "../youtube/youtube.module";
import { FavoriteComponent } from "./components/favorite/favorite.component";
import { FavoriteItemComponent } from "./components/favorite-item/favorite-item.component";
import { FavoriteRoutingModuleTsModule } from "./favorite-routing.module";

@NgModule({
    declarations: [FavoriteComponent, FavoriteItemComponent],
    imports: [
        CommonModule,
        FavoriteRoutingModuleTsModule,
        SharedModule,
        YoutubeModule
    ],
    exports: [FavoriteComponent],
})
export class FavoriteModule {}
