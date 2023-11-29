import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { PageNotFoundComponent } from "../core/components/page-not-found/page-not-found.component";
import { SharedModule } from "../shared/shared.module";
import { CustomItemComponent } from "./components/custom-item/custom-item.component";
import { SearchItemComponent } from "./components/search-item/search-item.component";
import { SearchResultsComponent } from "./components/search-results/search-results.component";
import { DetailedInformationPageComponent }
    from "./pages/detailed-information-page/detailed-information-page.component";
import { KeywordFilterPipe } from "./pipes/keyword-filter.pipe";
import { YoutubeRoutingModule } from "./youtube-routing.module";

@NgModule({
    declarations: [
        SearchResultsComponent,
        SearchItemComponent,
        KeywordFilterPipe,
        DetailedInformationPageComponent,
        PageNotFoundComponent,
        CustomItemComponent,
    ],
    imports: [CommonModule, SharedModule, YoutubeRoutingModule],
    exports: [
        SearchResultsComponent,
        SearchItemComponent,
        KeywordFilterPipe,
        DetailedInformationPageComponent,
    ],
})
export class YoutubeModule {}
