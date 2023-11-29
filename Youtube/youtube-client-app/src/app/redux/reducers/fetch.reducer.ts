import { createReducer, on } from "@ngrx/store";

import * as YoutubeActions from "../actions/fetch.actions";
import { YoutubeState } from "../state.model";

export const initialState: YoutubeState = {
    videos: null,
    nextPageToken: null,
    prevPageToken: null,
};

export const youtubeReducer = createReducer<YoutubeState>(
    initialState,
    on(
        YoutubeActions.updateVideosState,
        (state, { videos }): YoutubeState => ({
            ...state,
            videos,
            nextPageToken: videos.nextPageToken,
            prevPageToken: videos.prevPageToken,
        })
    )
);

export { YoutubeState };
