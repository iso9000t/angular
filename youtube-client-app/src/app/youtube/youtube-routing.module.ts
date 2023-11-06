import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SearchResultsComponent } from "./components/search-results/search-results.component";
import { DetailedInformationPageComponent }
    from "./pages/detailed-information-page/detailed-information-page.component";

const routes: Routes = [
    { path: "", component: SearchResultsComponent },
    { path: ":id", component: DetailedInformationPageComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YoutubeRoutingModule {}
