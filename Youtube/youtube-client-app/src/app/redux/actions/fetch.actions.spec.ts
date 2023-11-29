import { SearchResponse } from "../../youtube/models/search-response.model";
import * as YouTubeApiActions from "./fetch.actions";

describe("YouTube API Actions", () => {
    it("should create an action to fetch videos", () => {
        const maxResults = 10;
        const action = YouTubeApiActions.fetchVideos({ maxResults });

        expect(action.type).toBe("[YouTube/API] Fetch Videos");
        expect(action.maxResults).toBe(maxResults);
    });

    it("should create an action to update videos state", () => {
        const videos: SearchResponse = {
            TODO: "",
            kind: "",
            etag: "",
            pageInfo: {
                totalResults: 10,
                resultsPerPage: 10
            },
            items: []
        };
        const action = YouTubeApiActions.updateVideosState({ videos });

        expect(action.type).toBe("[YouTube/API] Update Videos State");
        expect(action.videos).toEqual(videos);
    });

    it("should create an action to fetch videos with token", () => {
        const maxResults = 10;
        const pageToken = "token123";
        const action = YouTubeApiActions.fetchVideosWithToken({
            maxResults,
            pageToken,
        });

        expect(action.type).toBe("[YouTube/API] Fetch Videos With Token");
        expect(action.maxResults).toBe(maxResults);
        expect(action.pageToken).toBe(pageToken);
    });
});
