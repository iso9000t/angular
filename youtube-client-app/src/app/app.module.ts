import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HeaderComponent } from "./header/header/header.component";
import { SearchItemComponent } from "./search/search-item/search-item.component";
import { SearchResultsComponent } from "./search/search-results/search-results.component";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SearchResultsComponent,
        SearchItemComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
