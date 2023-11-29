import { createFeatureSelector, createSelector } from "@ngrx/store";

import { YoutubeState } from "../reducers/fetch.reducer";

export const selectYoutubeFeature = createFeatureSelector<YoutubeState>("youtube");

export const selectVideos = createSelector(
    selectYoutubeFeature,
    (state: YoutubeState) => state.videos
);
