import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { PageNotFoundComponent } from "../core/components/page-not-found/page-not-found.component";
import { SharedModule } from "../shared/shared.module";
import { DetailedInformationPageComponent }
    from "./components/detailed-information-page/detailed-information-page.component";
import { SearchItemComponent } from "./components/search-item/search-item.component";
import { SearchResultsComponent } from "./components/search-results/search-results.component";
import { VideoAgeBorderDirective } from "./directives/video-age-border.directive";
import { KeywordFilterPipe } from "./pipes/keyword-filter.pipe";
import { YoutubeRoutingModule } from "./youtube-routing.module";

@NgModule({
    declarations: [
        SearchResultsComponent,
        SearchItemComponent,
        VideoAgeBorderDirective,
        KeywordFilterPipe,
        DetailedInformationPageComponent,
        PageNotFoundComponent,
    ],
    imports: [CommonModule, SharedModule, YoutubeRoutingModule],
    exports: [
        SearchResultsComponent,
        SearchItemComponent,
        VideoAgeBorderDirective,
        KeywordFilterPipe,
        SharedModule,
    ],
})
export class YoutubeModule {}
