import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SortOrder } from "src/enums/sort.enum";

@Injectable({
    providedIn: "root",
})
export class SortFilterService {
    private filterKeywordSubject = new BehaviorSubject<string>("");
    readonly filterKeyword$ = this.filterKeywordSubject.asObservable();

    private filterIsActiveSubject = new BehaviorSubject<boolean>(false);
    readonly filterIsActive$ = this.filterIsActiveSubject.asObservable();

    private sortOrderSubject = new BehaviorSubject<SortOrder>(SortOrder.NONE);
    readonly sortOrder$ = this.sortOrderSubject.asObservable();

    setFilterKeyword(keyword: string): void {
        this.filterKeywordSubject.next(keyword);
    }

    toggleFilterIsActive(): void {
        this.filterIsActiveSubject.next(!this.filterIsActiveSubject.getValue());
        if (!this.filterIsActiveSubject.getValue()) {
            this.setSortOrder(SortOrder.NONE);
            this.setFilterKeyword("");
        }
    }

    setSortOrder(sortOrder: SortOrder): void {
        this.sortOrderSubject.next(sortOrder);
    }
    toggleSortOrder(
        currentSortOrder: SortOrder,
        ascOrder: SortOrder,
        descOrder: SortOrder
    ): void {
        const newSortOrder = currentSortOrder === ascOrder ? descOrder : ascOrder;
        this.setSortOrder(newSortOrder);
    }
}
