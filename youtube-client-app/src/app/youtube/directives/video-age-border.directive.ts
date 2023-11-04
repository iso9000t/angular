import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
    selector: "[appVideoAgeBorder]",
})
export class VideoAgeBorderDirective {
    @Input() set publishedAt(value: string) {
        this.calculateAndSetBorderColor(value);
    }

    constructor(private el: ElementRef) {}

    private calculateAndSetBorderColor(publishedAt: string) {
        const currentDate = new Date();
        const publicationDate = new Date(publishedAt);
        const differenceInMonths = (currentDate.getFullYear() - publicationDate.getFullYear()) * 12
      + currentDate.getMonth()
      - publicationDate.getMonth();
        const differenceInDays = (currentDate.getTime() - publicationDate.getTime())
      / (1000 * 60 * 60 * 24);

        let borderColor = "red";

        if (differenceInDays <= 7) {
            borderColor = "lightblue";
        } else if (differenceInDays <= 30) {
            borderColor = "green";
        } else if (differenceInMonths <= 6) {
            borderColor = "yellow";
        }

        this.el.nativeElement.style.borderBottom = `5px solid ${borderColor}`;
    }
}
