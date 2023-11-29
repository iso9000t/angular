import { SearchResponse } from "../youtube/models/search-response.model";

export interface YoutubeState {
    videos: SearchResponse | null;
    nextPageToken?: string | null;
    prevPageToken?: string | null;
}

export interface Card {
    kind: string;
    etag: string;
    id: {
        kind: string;
        videoId: string;
    };
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            default: { url: string; width: number; height: number };
            medium: { url: string; width: number; height: number };
            high: { url: string; width: number; height: number };
        };
        channelTitle: string;
        liveBroadcastContent: string;
        publishTime: string;
    };
    statistics: {
        viewCount: string;
        likeCount: string;
        favoriteCount: string;
        commentCount: string;
    };
}
export interface AdminState {
    cards: Card[];
}

export interface AppState {
    youtube: YoutubeState;
    admin: AdminState;
    favorite: FavoriteState;
}

export interface FavoriteState {
    favoriteIds: string[];
    testMessage?: string;
}
