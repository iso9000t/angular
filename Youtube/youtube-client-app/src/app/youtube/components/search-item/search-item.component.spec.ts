import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCardActions, MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Store } from "@ngrx/store";
import { CustomButtonComponent } from "src/app/shared/components/custom-button/custom-button.component";

import { SearchItem } from "../../models/search-item.model";
import { SearchItemComponent } from "./search-item.component";

describe("SearchItemComponent", () => {
    let component: SearchItemComponent;
    let fixture: ComponentFixture<SearchItemComponent>;
    let router: Router;
    let route: ActivatedRoute;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchItemComponent, MatCardActions],
            imports: [
                MatToolbarModule,
                MatIconModule,
                MatFormFieldModule,
                MatInputModule,
                BrowserAnimationsModule,
                CustomButtonComponent,
                MatCardModule,
                RouterTestingModule,
            ],
            providers: [
                { provide: ActivatedRoute, useValue: {} },
                { provide: Store, useValue: {} },
            ],
        });
        fixture = TestBed.createComponent(SearchItemComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        route = TestBed.inject(ActivatedRoute);
    });

    it("should create SearchItemComponent", () => {
        expect(component).toBeTruthy();
    });

    it("should return correct dislikeCount", () => {
        component.item = { statistics: { likeCount: "20" } } as SearchItem;
        expect(component.dislikeCount).toEqual(2);
    });

    it("should navigate to the correct route when onMoreButtonClick is called", () => {
        const navigateSpy = jest.spyOn(router, "navigate");
        component.item = { id: { videoId: "VIDEO_ID" } } as SearchItem;
        component.onMoreButtonClick();
        expect(navigateSpy).toHaveBeenCalledWith(["VIDEO_ID"], {
            relativeTo: route,
        });
    });
});
