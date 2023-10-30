import {
    Component, Input, OnChanges, OnInit
} from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { SortOrder } from "src/enums/sort.enum";

import { SearchResponse } from "../search-response.model";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit, OnChanges {
  data: Partial<SearchResponse> = { items: [] };

  @Input() filterKeyword = '';

  @Input() sortOrder: SortOrder = SortOrder.NONE;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.fetchData().subscribe((response) => {
      this.data = response;
      this.sortData();
    });
  }

  ngOnChanges(): void {
    this.dataService.fetchData().subscribe((response) => {
      this.data = response;
      this.sortData();
    });
    this.sortData();
  }

    sortData() {
     if (!this.data.items) {
       return;
     }
    const sortedData = [...this.data.items];
    if (this.sortOrder === SortOrder.NONE) {
      return;
    }
    sortedData.sort((a, b) => {
      const dateA = new Date(a.snippet.publishedAt).getTime();
      const dateB = new Date(b.snippet.publishedAt).getTime();
      const viewsA = +a.statistics.viewCount;
      const viewsB = +b.statistics.viewCount;

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

    this.data.items = sortedData;
  }
}
