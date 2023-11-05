import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailedInformationPageComponent } from './components/detailed-information-page/detailed-information-page.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';

const routes: Routes = [
  { path: '', component: SearchResultsComponent },
  { path: ':id', component: DetailedInformationPageComponent },
  { path: '**', redirectTo: '/404' }, // Catch all other paths that don't match.
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YoutubeRoutingModule {}
