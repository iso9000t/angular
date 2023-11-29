import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HeaderLoginPageComponent } from "../core/pages/header-login-page/header-login-page.component";

const routes: Routes = [{ path: "", component: HeaderLoginPageComponent }];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
})
export class AuthRoutingModule {}
