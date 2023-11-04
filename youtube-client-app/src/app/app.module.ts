
import { NgModule } from "@angular/core";


import { MatCardModule } from "@angular/material/card";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";


import { KeywordFilterPipe } from "./youtube/pipes/keyword-filter.pipe";
import { SearchItemComponent } from "./youtube/components/search-item/search-item.component";
import { SearchResultsComponent } from "./youtube/components/search-results/search-results.component";
import { VideoAgeBorderDirective } from "./video-age-border.directive";
import { CoreModule } from "./core/core.module"; 
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [
    AppComponent,
    
   
  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
   
    SharedModule,
    
    
    
    
    MatCardModule,
    CoreModule
  ],
})
export class AppModule {}
