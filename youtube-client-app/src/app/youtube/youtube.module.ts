import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeywordFilterPipe } from './pipes/keyword-filter.pipe';
import { VideoAgeBorderDirective } from '../video-age-border.directive';
import { SharedModule } from '../shared/shared.module';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SearchItemComponent } from './components/search-item/search-item.component';



@NgModule({
  declarations: [
    SearchResultsComponent,
    SearchItemComponent,
    VideoAgeBorderDirective,
    KeywordFilterPipe,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    SearchResultsComponent,
    SearchItemComponent,
    VideoAgeBorderDirective,
    KeywordFilterPipe,
    SharedModule
  ],
})
export class YoutubeModule {}
