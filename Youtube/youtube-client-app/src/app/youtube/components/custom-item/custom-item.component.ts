import { Component, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { removeCard } from "src/app/redux/actions/custom.actions";
import { Card } from "src/app/redux/state.model";

@Component({
    selector: "app-custom-item",
    templateUrl: "./custom-item.component.html",
    styleUrls: ["./custom-item.component.scss"],
})
export class CustomItemComponent {
    @Input() card!: Card;

    constructor(private store: Store) {}

    deleteCard(cardId: string): void {
        this.store.dispatch(removeCard({ cardId }));
    }
    // eslint-disable-next-line class-methods-use-this
    isValidImageUrl(url: string): boolean {
        const imageUrlPattern = /^(https?:\/\/)?.*\.(jpg|jpeg|png|gif|bmp|svg)$/i;
        return imageUrlPattern.test(url);
    }
}
