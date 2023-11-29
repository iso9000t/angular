import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { LoginService } from "src/app/auth/services/login.service";
import { SortOrder } from "src/app/youtube/enums/sort.enum";
import { YoutubeService } from "src/app/youtube/services/youtube/youtube.service";

import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                FormsModule,
                MatToolbarModule,
                MatIconModule,
                MatFormFieldModule,
                MatInputModule,
                BrowserAnimationsModule,
            ],
            providers: [LoginService, YoutubeService],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should have default values", () => {
        expect(component.searchQuery).toBe("");
        expect(component.filterKeyword).toBe("");
        expect(component.filterIsActive).toBe(false);
        expect(component.showSearchResults).toBe(false);
        expect(component.sortOrder).toBe(SortOrder.NONE);
        expect(component.username).toBe("");
        expect(component.isDisabled).toBe(true);
        expect(component.isSearchDisabled).toBe(false);
    });

    it("should toggle filterIsActive", () => {
        const initialFilterIsActive = component.filterIsActive;
        component.toggleFilter();
        expect(component.filterIsActive).toBe(!initialFilterIsActive);
    });

    it("sortByDate should toggle sortOrder", () => {
        component.sortOrder = SortOrder.NONE;
        component.sortByDate();
        expect(component.sortOrder).toBe(SortOrder.DATE_ASC);
        component.sortByDate();
        expect(component.sortOrder).toBe(SortOrder.DATE_DESC);
    });

    it("sortByViews should toggle sortOrder", () => {
        component.sortOrder = SortOrder.NONE;
        component.sortByViews();
        expect(component.sortOrder).toBe(SortOrder.VIEWS_ASC);
        component.sortByViews();
        expect(component.sortOrder).toBe(SortOrder.VIEWS_DESC);
    });

    it("should call logout method when logout button is clicked", () => {
        component.isDisabled = false;
        fixture.detectChanges();

        const logoutButton = fixture.debugElement.nativeElement.querySelector("#logout-button");

        if (!logoutButton) throw new Error("Logout button not found");

        const logoutSpy = jest.spyOn(component, "logout");
        logoutButton.click();

        expect(logoutSpy).toHaveBeenCalled();
    });

    it("should display Logout button when user is logged in", () => {
        component.isDisabled = false;
        fixture.detectChanges();
        const logoutButton = fixture.debugElement.nativeElement.querySelector("#logout-button");
        expect(logoutButton).toBeTruthy();
    });

    it("should display Login button when user is not logged in", () => {
        component.isDisabled = true;
        fixture.detectChanges();
        const loginButton = fixture.debugElement.nativeElement.querySelector("#login-button");
        expect(loginButton).toBeTruthy();
    });

    // Similar tests for Favorites and Main links
});
