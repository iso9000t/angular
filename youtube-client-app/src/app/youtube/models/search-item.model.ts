export interface SearchItem {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
    statistics: Statistics;
}

export interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: Localized;
    defaultAudioLanguage: string;
}

// Interface for the 'thumbnails' property inside 'snippet'
export interface Thumbnails {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
    standard: Thumbnail;
    maxres: Thumbnail;
}

// Interface for each individual thumbnail type
export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

// Interface for the 'localized' property inside 'snippet'
export interface Localized {
    title: string;
    description: string;
}

export interface Statistics {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
}
