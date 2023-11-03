import { Component, OnDestroy, OnInit } from '@angular/core';
import { SortOrder } from 'src/enums/sort.enum';
import { ShowSearchResultsService } from '../services/show-search-results.service';
import { Subscription } from 'rxjs';
import { SortFilterService } from '../services/sort-filter.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  filterKeyword: string = '';
  filterIsActive: boolean = false;
  showSearchResults: boolean = false;
  sortOrder: SortOrder = SortOrder.NONE;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private showSearchResultsService: ShowSearchResultsService,
    private sortFilterService: SortFilterService
  ) {}

  ngOnInit(): void {
    // Subscribe to the observables provided by the service.
    this.subscriptions =
      this.showSearchResultsService.showSearchResults$.subscribe(
        (isVisible) => {
          this.showSearchResults = isVisible;
        }
      );
    this.subscriptions.add(
      this.sortFilterService.filterKeyword$.subscribe(
        (keyword) => (this.filterKeyword = keyword)
      )
    );
    this.subscriptions.add(
      this.sortFilterService.filterIsActive$.subscribe(
        (isActive) => (this.filterIsActive = isActive)
      )
    );
    this.subscriptions.add(
      this.sortFilterService.sortOrder$.subscribe(
        (order) => (this.sortOrder = order)
      )
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  /* 
  sortByDate() {
    if (this.sortOrder === SortOrder.DATE_ASC) {
      this.sortOrder = SortOrder.DATE_DESC;
    } else {
      this.sortOrder = SortOrder.DATE_ASC;
    }
  } */
  sortByDate(): void {
    this.sortFilterService.toggleSortOrder(
      this.sortOrder,
      SortOrder.DATE_ASC,
      SortOrder.DATE_DESC
    );
  }

  /*   sortByViews() {
    if (this.sortOrder === SortOrder.VIEWS_ASC) {
      this.sortOrder = SortOrder.VIEWS_DESC;
    } else {
      this.sortOrder = SortOrder.VIEWS_ASC;
    }
  } */
    sortByViews() {
        this.sortFilterService.toggleSortOrder(
            this.sortOrder,
            SortOrder.VIEWS_ASC,
            SortOrder.VIEWS_DESC
      );
  };

/*   toggleFilter() {
    this.filterIsActive = !this.filterIsActive;
    if (!this.filterIsActive) {
      this.sortOrder = SortOrder.NONE;
      this.filterKeyword = '';
    }
  } */
    toggleFilter(): void {
        this.sortFilterService.toggleFilterIsActive();
     }

  onSearch() {
    this.showSearchResultsService.onSearch();
    console.log(this.showSearchResultsService.showSearchResults);
  }
}
