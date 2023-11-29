import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subscription, take } from "rxjs";
import { SortFilterService } from "src/app/core/services/sort-filter/sort-filter.service";
import { YoutubeState } from "src/app/redux/reducers/fetch.reducer";
import { selectAdminCards } from "src/app/redux/selectors/custom.selector";
import { selectFavoriteIds } from "src/app/redux/selectors/favorite.selectors";
import { selectVideos, selectYoutubeFeature } from "src/app/redux/selectors/fetch.selectors";
import { Card } from "src/app/redux/state.model";
import { SortOrder } from "src/app/youtube/enums/sort.enum";

import * as YoutubeActions from "../../../redux/actions/fetch.actions";
import { SearchResponse } from "../../models/search-response.model";

@Component({
    selector: "app-search-results",
    templateUrl: "./search-results.component.html",
    styleUrls: ["./search-results.component.scss"],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
    displayData: Partial<SearchResponse> = { items: [] };
    originalData: Partial<SearchResponse> = { items: [] };
    youtubeState$!: Observable<YoutubeState>;

    filterKeyword: string = "";
    private sortOrder: SortOrder = SortOrder.NONE;
    private subscriptions: Subscription = new Subscription();
    nextPageToken: string | null | undefined;
    prevPageToken: string | null | undefined;
    displayPageIndex: number = 1;
    isTimeoutActive: boolean = false;
    customCards: Card[] = [];
    totalCardsOnPage: number = 20;
    customCardsCount: number = 0;
    numberOfCardsToFetch: number = 0;

    constructor(
        private sortFilterService: SortFilterService,
        private store: Store
    ) {}

    ngOnInit(): void {
        this.SubscribeToCustomCards();
        this.subscribeToGetPageTokens();
        this.getOriginalAndDisplayData();
        this.subscribeToSortFilterService();
        this.subscribeToFavIds();

        this.store.dispatch(
            YoutubeActions.fetchVideos({ maxResults: this.numberOfCardsToFetch })
        );

        this.subscriptions.add(
            this.sortFilterService.filterKeyword$.subscribe((keyword) => {
                this.filterKeyword = keyword;
                this.store
                    .select(selectAdminCards)
                    .pipe(take(1))
                    .subscribe((customCards) => {
                        if (this.filterKeyword) {
                            this.applyFilterAndSort();
                        } else {
                            this.customCards = customCards;
                        }
                    });
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private subscribeToFavIds(): void {
        this.subscriptions = this.store
            .select(selectFavoriteIds)
            .subscribe((favoriteIds) => {
                console.log("FAVORITE IDS from Search results: ", favoriteIds);
            });
    }

    private SubscribeToCustomCards() {
        this.subscriptions.add(
            this.store.select(selectAdminCards).subscribe((customCards) => {
                const previousCount = this.customCardsCount;
                this.customCards = customCards;
                this.customCardsCount = customCards.length;
                this.updateNumberOfCardsToFetch();

                if (this.customCardsCount < previousCount) {
                    this.displayPageIndex = 1;
                    this.store.dispatch(
                        YoutubeActions.fetchVideos({
                            maxResults: this.numberOfCardsToFetch,
                        })
                    );
                }
            })
        );
    }

    private subscribeToGetPageTokens() {
        this.youtubeState$ = this.store.select(selectYoutubeFeature);
        this.subscriptions.add(
            this.youtubeState$.subscribe((youtubeState) => {
                this.nextPageToken = youtubeState.nextPageToken;
                this.prevPageToken = youtubeState.prevPageToken;
            })
        );
    }

    private getOriginalAndDisplayData() {
        this.subscriptions.add(
            this.store.select(selectVideos).subscribe((videos) => {
                if (videos) {
                    this.originalData = { ...videos, items: [...videos.items] };
                    this.displayData = { ...videos, items: [...videos.items] };
                }
            })
        );
    }

    private subscribeToSortFilterService() {
        this.subscriptions.add(
            this.sortFilterService.sortOrder$.subscribe((order) => {
                this.sortOrder = order;
                this.applyFilterAndSort();
            })
        );
    }

    applyFilterAndSort() {
        const items = Array.isArray(this.originalData.items)
            ? this.originalData.items
            : [];
        this.displayData = { ...this.originalData, items: [...items] };
        this.filterData();
        this.sortData();
    }

    filterData() {
        if (!this.filterKeyword) return;
        this.displayData.items = this.displayData.items?.filter((item) => item.snippet.title
            .toLowerCase()
            .includes(this.filterKeyword.toLowerCase()));

        this.customCards = this.customCards.filter((card) => card.snippet.title
            .toLowerCase()
            .includes(this.filterKeyword.toLowerCase()));
    }

    sortData() {
        if (!this.displayData.items) {
            return;
        }
        const sortedData = [...this.displayData.items];
        if (this.sortOrder === SortOrder.NONE) {
            return;
        }
        sortedData.sort((a, b) => {
            const dateA = new Date(a.snippet.publishedAt).getTime();
            const dateB = new Date(b.snippet.publishedAt).getTime();
            const viewsA = +(a.statistics?.viewCount ?? 0);
            const viewsB = +(b.statistics?.viewCount ?? 0);

            switch (this.sortOrder) {
                case SortOrder.DATE_ASC:
                    return dateA - dateB;
                case SortOrder.DATE_DESC:
                    return dateB - dateA;
                case SortOrder.VIEWS_ASC:
                    return viewsA - viewsB;
                case SortOrder.VIEWS_DESC:
                    return viewsB - viewsA;
                default:
                    return 0;
            }
        });

        this.displayData.items = sortedData;
    }

    goToNextPage() {
        if (this.nextPageToken && !this.isTimeoutActive) {
            this.isTimeoutActive = true;
            setTimeout(() => {
                this.isTimeoutActive = false;
            }, 1000);

            this.displayPageIndex += 1;
            this.updateNumberOfCardsToFetch();
            this.store.dispatch(
                YoutubeActions.fetchVideosWithToken({
                    maxResults: this.numberOfCardsToFetch,
                    pageToken: this.nextPageToken,
                })
            );
        }
    }

    goToPrevPage() {
        if (this.prevPageToken && !this.isTimeoutActive) {
            this.isTimeoutActive = true;
            setTimeout(() => {
                this.isTimeoutActive = false;
            }, 1000);

            this.displayPageIndex = Math.max(1, this.displayPageIndex - 1);
            this.updateNumberOfCardsToFetch();
            this.store.dispatch(
                YoutubeActions.fetchVideosWithToken({
                    maxResults: this.numberOfCardsToFetch,
                    pageToken: this.prevPageToken,
                })
            );
        }
    }

    private updateNumberOfCardsToFetch() {
        this.numberOfCardsToFetch = this.totalCardsOnPage - this.customCardsCount;
        console.log("customCardsCount", this.customCardsCount);
        console.log("numberOfCardsToFetch", this.numberOfCardsToFetch);
    }
}
