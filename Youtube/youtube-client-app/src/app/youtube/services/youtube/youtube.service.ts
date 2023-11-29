import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    BehaviorSubject,
    catchError,
    debounceTime,
    distinctUntilChanged,
    EMPTY,
    filter,
    forkJoin,
    map,
    Observable,
    of,
    switchMap,
    tap,
} from "rxjs";
import { VideoListResponse } from "src/app/favorite/models/favorite.model";

import { SearchItem, Statistics } from "../../models/search-item.model";
import { SearchResponse } from "../../models/search-response.model";

@Injectable({
    providedIn: "root",
})
export class YoutubeService {
    private searchTermsSubject = new BehaviorSubject<string>("");
    searchTerms$: Observable<string> = this.searchTermsSubject
        .asObservable()
        .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter((term) => term.length >= 3)
        );

    private apiUrl: string = "https://www.googleapis.com/youtube/v3";

    constructor(private http: HttpClient) {}

    updateSearchQuery(searchQuery: string) {
        console.log("Current search query:", searchQuery);
        this.searchTermsSubject.next(searchQuery);
    }

    fetchVideoStatistics(videoIds: string[]): Observable<Statistics[]> {
        const ids = videoIds.join(",");
        const statsUrl = `${this.apiUrl}/videos?id=${ids}&part=statistics`;

        return this.http
            .get<{ items: Array<{ id: string; statistics: Statistics }> }>(statsUrl)
            .pipe(
                map((response) => response.items.map((item) => item.statistics)),
                catchError((error) => {
                    console.error(
                        "An error occurred while fetching video statistics:",
                        error
                    );
                    return EMPTY;
                })
            );
    }

    fetchVideos(maxResults: number): Observable<SearchResponse> {
        return this.searchTerms$.pipe(
            switchMap((searchQuery) => {
                const searchUrl = `${
                    this.apiUrl
                }/search?type=video&part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(
                    searchQuery
                )}`;
                return this.http.get<SearchResponse>(searchUrl);
            }),
            switchMap((searchResponse) => {
                const videoIds = searchResponse.items.map((item) => item.id.videoId);
                return forkJoin({
                    searchResponse: of(searchResponse),
                    statisticsResponse: this.fetchVideoStatistics(videoIds),
                });
            }),
            map(({ searchResponse, statisticsResponse }) => {
                const updatedSearchResponse = {
                    ...searchResponse,
                    items: searchResponse.items.map((item, index) => ({
                        ...item,
                        statistics: statisticsResponse[index],
                    })),
                };
                return updatedSearchResponse;
            }),
            tap((combinedResponse) => {
                console.log("Combined data:", combinedResponse);
            }),
            catchError((error) => {
                console.error("An error occurred while fetching YouTube data:", error);
                return EMPTY;
            })
        );
    }

    fetchVideoDetails(videoId: string): Observable<SearchItem> {
        const detailsUrl = `${this.apiUrl}/videos?id=${videoId}&part=snippet,statistics`;
        return this.http.get<{ items: Array<SearchItem> }>(detailsUrl).pipe(
            map((response) => response.items[0]),
            catchError((error) => {
                console.error("Error fetching video details:", error);
                return EMPTY;
            })
        );
    }

    fetchVideosWithToken(
        maxResults: number,
        pageToken: string
    ): Observable<SearchResponse> {
        return this.searchTerms$.pipe(
            switchMap((searchQuery) => {
                const searchUrl = `${
                    this.apiUrl
                }/search?type=video&part=snippet&maxResults=${maxResults}&pageToken=${pageToken}&q=${encodeURIComponent(
                    searchQuery
                )}`;
                return this.http.get<SearchResponse>(searchUrl);
            }),
            switchMap((searchResponse) => {
                const videoIds = searchResponse.items.map((item) => item.id.videoId);
                return forkJoin({
                    searchResponse: of(searchResponse),
                    statisticsResponse: this.fetchVideoStatistics(videoIds),
                });
            }),
            map(({ searchResponse, statisticsResponse }) => {
                const updatedSearchResponse = {
                    ...searchResponse,
                    items: searchResponse.items.map((item, index) => ({
                        ...item,
                        statistics: statisticsResponse[index],
                    })),
                };
                return updatedSearchResponse;
            }),
            tap((combinedResponse) => {
                console.log("Combined data:", combinedResponse);
            }),
            catchError((error) => {
                console.error("An error occurred while fetching YouTube data:", error);
                return EMPTY;
            })
        );
    }

    fetchVideosByIds(videoIds: string[]): Observable<VideoListResponse> {
        if (!videoIds.length) {
            console.log("No ids for fetching videos");
        }

        const ids = videoIds.join(",");
        const videosUrl = `${this.apiUrl}/videos?id=${ids}&part=snippet,statistics`;

        return this.http.get<VideoListResponse>(videosUrl).pipe(
            catchError((error) => {
                console.error("An error occurred while fetching videos by IDs:", error);
                return EMPTY;
            })
        );
    }
}
