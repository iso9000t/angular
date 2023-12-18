import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DirtyErrorStateMatcher } from './shared/dirty-error-state-matcher';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from './login/login/login.component';
import { MainComponent } from './main/main/main.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthInterceptor } from './login/interceptors/auth.interceptor';
import { profileReducer } from './redux/reducers/profile-fetch.reducer';
import { ProfileEffects } from './redux/effects/profile.effect';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from './header/header/header.component';
import { HeaderMainPageComponent } from './main/pages/header-main-page/header-main-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HeaderProfilePageComponent } from './registration/pages/header-profile-page/header-profile-page.component';
import { groupReducer } from './redux/reducers/group.reducer';
import { GroupEffects } from './redux/effects/group.effect';
import { MatDialogModule } from '@angular/material/dialog';
import { DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { GroupDeleteDialogComponent } from './main/group-delete-dialog/group-delete-dialog.component';
import { userReducer } from './redux/reducers/user.reducer';
import { UserEffects } from './redux/effects/user.effect';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
import { conversationReducer } from './redux/reducers/conversation.reducer';
import { ConversationEffects } from './redux/effects/conversation.effect';
import { ConversationComponent } from './conversation/conversation.component';
import { groupMessageReducer } from './redux/reducers/group-message.reducer';
import { GroupMessageEffects } from './redux/effects/group-message.effect';
import { UserNamePipe } from './pipes/user-name.pipe';
import { privateMessageReducer } from './redux/reducers/private-message-reducer';
import { PrivateMessageEffects } from './redux/effects/private-message.effect';

/* import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';*/

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    MainComponent,
    ProfileComponent,
    HeaderComponent,
    HeaderMainPageComponent,
    HeaderProfilePageComponent,
    GroupDeleteDialogComponent,
    GroupDialogComponent,
    ConversationComponent,
    UserNamePipe,
  ],
  imports: [
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    StoreModule.forRoot({
      profile: profileReducer,
      group: groupReducer,
      user: userReducer,
      conversation: conversationReducer,
      groupMessage: groupMessageReducer,
      privateMessage: privateMessageReducer,
    }),
    EffectsModule.forRoot([
      ProfileEffects,
      GroupEffects,
      UserEffects,
      ConversationEffects,
      GroupMessageEffects,
      PrivateMessageEffects,
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    { provide: ErrorStateMatcher, useClass: DirtyErrorStateMatcher },
    { provide: DEFAULT_DIALOG_CONFIG, useValue: { hasBackdrop: false } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
