import { SearchItem } from "./search-item.model";

export interface SearchResponse {
    TODO: string;
    kind: string;
    etag: string;
    pageInfo: PageInfo;
    items: SearchItem[];
}

export interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
}
