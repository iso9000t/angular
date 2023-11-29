import { SearchItem } from "./search-item.model";

export interface SearchResponse {
    TODO: string;
    kind: string;
    etag: string;
    pageInfo: PageInfo;
    items: SearchItem[];
    nextPageToken?: string;
    prevPageToken?: string;
}

export interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
}

export { SearchItem };
