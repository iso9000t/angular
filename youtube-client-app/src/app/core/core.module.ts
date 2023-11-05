import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../shared/shared.module";
import { YoutubeModule } from "../youtube/youtube.module";
import { HeaderComponent } from "./components/header/header.component";

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    YoutubeModule,
    RouterModule,
  ],
  exports: [HeaderComponent],
})
export class CoreModule {}
