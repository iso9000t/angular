import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HeaderComponent } from "./core/components/header/header.component";

const routes: Routes = [
    { path: 'main', component: HeaderComponent }
/*  EXAMPLE:   { path: 'home', component: HomeComponent }, */
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
