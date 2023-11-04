import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { YoutubeModule } from '../youtube/youtube.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    YoutubeModule
    
  ],
  exports: [HeaderComponent],
})
export class CoreModule {}
