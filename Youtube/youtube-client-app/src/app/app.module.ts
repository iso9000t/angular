import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { isDevMode, NgModule } from "@angular/core";
import { ErrorStateMatcher } from "@angular/material/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthModule } from "./auth/auth.module";
import { CoreModule } from "./core/core.module";
import { YoutubeEffects } from "./redux/effects/fetch.effects";
import { adminReducer } from "./redux/reducers/custom.reducer";
import { favoriteReducer } from "./redux/reducers/favorite.reducer";
import { youtubeReducer } from "./redux/reducers/fetch.reducer";
import { localStorageMetaReducer } from "./redux/reducers/meta-reducers";
import { AppState } from "./redux/state.model";
import { DirtyErrorStateMatcher } from "./shared/dirty-error-state-matcher";
import { SharedModule } from "./shared/shared.module";
import { ApiInterceptor } from "./youtube/interceptors/api.interceptor";

@NgModule({
    declarations: [AppComponent],
    providers: [
        provideHttpClient(withInterceptors([ApiInterceptor])),
        { provide: ErrorStateMatcher, useClass: DirtyErrorStateMatcher },
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        CoreModule,
        AuthModule,
        StoreModule.forRoot<AppState>(
            {
                youtube: youtubeReducer,
                admin: adminReducer,
                favorite: favoriteReducer,
            },
            {
                metaReducers: [localStorageMetaReducer],
            }
        ),
        EffectsModule.forRoot([YoutubeEffects]),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode(), connectInZone: true }),
    ],
})
export class AppModule {}
