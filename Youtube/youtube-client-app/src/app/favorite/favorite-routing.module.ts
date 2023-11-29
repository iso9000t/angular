import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HeaderFavoritePageComponent } from "../core/pages/header-favorite-page/header-favorite-page.component";
import { DetailedInformationPageComponent }
    from "../youtube/pages/detailed-information-page/detailed-information-page.component";

const routes: Routes = [
    { path: "", component: HeaderFavoritePageComponent },
    { path: ":id", component: DetailedInformationPageComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FavoriteRoutingModuleTsModule {}
