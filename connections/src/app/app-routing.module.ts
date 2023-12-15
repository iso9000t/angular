import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration/registration.component';
import { LoginComponent } from './login/login/login.component';
import { MainComponent } from './main/main/main.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { authGuard, reverseAuthGuard } from './guards/auth.guard';
import { HeaderMainPageComponent } from './main/pages/header-main-page/header-main-page.component';
import { HeaderProfilePageComponent } from './registration/pages/header-profile-page/header-profile-page.component';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
const routes: Routes = [
  { path: '', component: HeaderMainPageComponent, canActivate: [authGuard] },
  {
    path: 'signin',
    component: LoginComponent,
    canActivate: [reverseAuthGuard],
  },
  {
    path: 'signup',
    component: RegistrationComponent,
    canActivate: [reverseAuthGuard],
  },
  {
    path: 'profile',
    component: HeaderProfilePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'group/:groupID',
    component: GroupDialogComponent,
    canActivate: [authGuard],
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
