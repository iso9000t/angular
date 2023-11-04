import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { SearchItemComponent } from "./components/search-item/search-item.component";
import { SearchResultsComponent } from "./components/search-results/search-results.component";
import { VideoAgeBorderDirective } from "./directives/video-age-border.directive";
import { KeywordFilterPipe } from "./pipes/keyword-filter.pipe";

@NgModule({
    declarations: [
        SearchResultsComponent,
        SearchItemComponent,
        VideoAgeBorderDirective,
        KeywordFilterPipe,
    ],
    imports: [CommonModule, SharedModule],
    exports: [
        SearchResultsComponent,
        SearchItemComponent,
        VideoAgeBorderDirective,
        KeywordFilterPipe,
        SharedModule,
    ],
})
export class YoutubeModule {}
