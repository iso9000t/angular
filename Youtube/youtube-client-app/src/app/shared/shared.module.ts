import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";

import { VideoAgeBorderDirective } from "../youtube/directives/video-age-border.directive";
import { CustomButtonComponent } from "./components/custom-button/custom-button.component";

@NgModule({
    declarations: [VideoAgeBorderDirective],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CustomButtonComponent,
        MatSlideToggleModule,
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatSnackBarModule,
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        CustomButtonComponent,
        MatSlideToggleModule,
        MatToolbarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        VideoAgeBorderDirective,
        MatSnackBarModule,
    ],
})
export class SharedModule {}
