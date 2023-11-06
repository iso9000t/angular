import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { authGuard } from "./auth/guards/auth.guard";
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
    { path: "404", component: PageNotFoundComponent },
    { path: "**", redirectTo: "/404" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
