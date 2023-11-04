import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-custom-button",
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: "./custom-button.component.html",
    styleUrls: ["./custom-button.component.scss"]
})
export class CustomButtonComponent {

}
