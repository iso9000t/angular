import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs";
import { YoutubeService } from "src/app/youtube/services/youtube/youtube.service";

import * as YoutubeActions from "../actions/fetch.actions";

@Injectable()
export class YoutubeEffects {
    constructor(
        private actions$: Actions,
        private youtubeService: YoutubeService
    ) {}

    fetchVideos$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(YoutubeActions.fetchVideos),
            switchMap((action) => this.youtubeService.fetchVideos(action.maxResults).pipe(
                map((response) => YoutubeActions.updateVideosState({
                    videos: response,
                }))
            ))
        );
    });

    fetchVideosWithToken$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(YoutubeActions.fetchVideosWithToken),
            switchMap((action) => this.youtubeService
                .fetchVideosWithToken(action.maxResults, action.pageToken)
                .pipe(
                    map((response) => YoutubeActions.updateVideosState({
                        videos: response,
                    }))
                ))
        );
    });
}
