import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { authGuard } from "./auth/guards/auth.guard";
import { AdminComponent } from "./core/components/admin/admin.component";
import { PageNotFoundComponent } from "./core/components/page-not-found/page-not-found.component";
import { MainPageComponent } from "./core/pages/main-page/main-page.component";

const routes: Routes = [
    { path: "", redirectTo: "main", pathMatch: "full" },
    {
        path: "main",
        component: MainPageComponent,
        canActivate: [authGuard],
        children: [
            {
                path: "search-results",
                loadChildren: () => import("./youtube/youtube.module").then((m) => m.YoutubeModule),
            },
        ],
    },
    {
        path: "login",
        loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
    },
    {
        path: "favorite",
        loadChildren: () => import("./favorite/favorite.module").then((m) => m.FavoriteModule),
    },

    { path: "404", component: PageNotFoundComponent },
    { path: "admin", component: AdminComponent },
    { path: "**", redirectTo: "/404" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
