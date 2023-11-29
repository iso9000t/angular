import { createAction, props } from "@ngrx/store";
import { SearchResponse } from "src/app/youtube/models/search-response.model";

export const fetchVideos = createAction(
    "[YouTube/API] Fetch Videos",
    props<{ maxResults: number }>()
);

export const updateVideosState = createAction(
    "[YouTube/API] Update Videos State",
    props<{ videos: SearchResponse }>()
);

export const fetchVideosWithToken = createAction(
    "[YouTube/API] Fetch Videos With Token",
    props<{ maxResults: number; pageToken: string }>()
);
