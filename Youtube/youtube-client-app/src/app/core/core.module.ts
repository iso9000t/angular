import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AuthModule } from "../auth/auth.module";
import { FavoriteModule } from "../favorite/favorite.module";
import { SharedModule } from "../shared/shared.module";
import { YoutubeModule } from "../youtube/youtube.module";
import { AdminComponent } from "./components/admin/admin.component";
import { HeaderComponent } from "./components/header/header.component";
import { HeaderFavoritePageComponent } from "./pages/header-favorite-page/header-favorite-page.component";
import { HeaderLoginPageComponent } from "./pages/header-login-page/header-login-page.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";

@NgModule({
    declarations: [
        HeaderComponent,
        MainPageComponent,
        HeaderLoginPageComponent,
        AdminComponent,
        HeaderFavoritePageComponent,
    ],
    exports: [HeaderComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        SharedModule,
        YoutubeModule,
        RouterModule,
        AuthModule,
        SharedModule,
        FavoriteModule,

    ],
})
export class CoreModule {}
