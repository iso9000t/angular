import { SortOrder } from "src/app/youtube/enums/sort.enum";

import { SortFilterService } from "./sort-filter.service";

describe("SortFilterService", () => {
    let service: SortFilterService;

    beforeEach(() => {
        service = new SortFilterService();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should default filter keyword to empty string", (done) => {
        service.filterKeyword$.subscribe((keyword) => {
            expect(keyword).toEqual("");
            done();
        });
    });

    it("should set filter keyword correctly", (done) => {
        const testKeyword = "test";
        service.setFilterKeyword(testKeyword);
        service.filterKeyword$.subscribe((keyword) => {
            expect(keyword).toEqual(testKeyword);
            done();
        });
    });

    it("should default filter is active to false", (done) => {
        service.filterIsActive$.subscribe((isActive) => {
            expect(isActive).toBeFalsy();
            done();
        });
    });

    it("should toggle filter is active status correctly", () => {
        service.toggleFilterIsActive();
        service.filterIsActive$.subscribe((isActive) => {
            expect(isActive).toBeTruthy();
        });
        service.toggleFilterIsActive();
        service.filterIsActive$.subscribe((isActive) => {
            expect(isActive).toBeFalsy();
        });
    });

    it("should default sort order to NONE", (done) => {
        service.sortOrder$.subscribe((order) => {
            expect(order).toEqual(SortOrder.NONE);
            done();
        });
    });

    it("should set sort order correctly", (done) => {
        service.setSortOrder(SortOrder.DATE_ASC);
        service.sortOrder$.subscribe((order) => {
            expect(order).toEqual(SortOrder.DATE_ASC);
            done();
        });
    });

    it("should toggle sort order correctly", () => {
        service.toggleSortOrder(
            SortOrder.NONE,
            SortOrder.DATE_ASC,
            SortOrder.DATE_DESC
        );
        service.sortOrder$.subscribe((order) => {
            expect(order).toEqual(SortOrder.DATE_ASC);
        });
        service.toggleSortOrder(
            SortOrder.DATE_ASC,
            SortOrder.DATE_ASC,
            SortOrder.DATE_DESC
        );
        service.sortOrder$.subscribe((order) => {
            expect(order).toEqual(SortOrder.DATE_DESC);
        });
    });
});
