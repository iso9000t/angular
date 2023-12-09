import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration/registration.component';
import { LoginComponent } from './login/login/login.component';
import { MainComponent } from './main/main/main.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { authGuard, reverseAuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: MainComponent, canActivate: [authGuard] },
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
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
