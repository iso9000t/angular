import { ElementRef } from "@angular/core";

import { VideoAgeBorderDirective } from "./video-age-border.directive";

describe("VideoAgeBorderDirective", () => {
    it("should create an instance and set border color", () => {
    // Mock ElementRef for testing
        const elementRefMock: ElementRef = {
            nativeElement: document.createElement("div")
        };

        // Instantiate the directive with the mock ElementRef
        const directive = new VideoAgeBorderDirective(elementRefMock);

        // Define a test date that would trigger setting the border color
        const testDate = new Date(Date.now() - (1000 * 60 * 60 * 24 * 10)).toISOString(); // 10 days ago

        // Call the input setter with a test date
        directive.publishedAt = testDate;

        // Check if the border color is set correctly
        expect(elementRefMock.nativeElement.style.borderBottom).toContain("green");
        expect(directive).toBeTruthy();
    });
});
