import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HeaderComponent } from "./core/components/header/header.component";

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    component: HeaderComponent,
    children: [
      {
        path: 'search-results',
        loadChildren: () =>
          import('./youtube/youtube.module').then((m) => m.YoutubeModule),
      },
    ],
  },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
