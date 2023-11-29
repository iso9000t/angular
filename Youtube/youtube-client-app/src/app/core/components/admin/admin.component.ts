import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as AdminActions from "src/app/redux/actions/custom.actions";
import { selectAdminCards } from "src/app/redux/selectors/custom.selector";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit, OnDestroy {
    adminForm!: FormGroup;
    customCardsCount: number = 0;
    private unsubscribe$ = new Subject<void>();

    constructor(private fb: FormBuilder, private store: Store) {}

    ngOnInit(): void {
        this.store
            .select(selectAdminCards)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((cards) => {
                this.customCardsCount = cards.length;
            });
        this.adminForm = this.fb.group({
            title: [
                "",
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(20),
                ],
            ],
            description: [
                "",
                {
                    validators: [Validators.maxLength(255)],
                },
            ],
            img: ["", Validators.required],
            videoLink: ["", Validators.required],
            creationDate: ["", [Validators.required, this.dateValidator]],
            tags: this.fb.array([this.fb.control("", Validators.required)]),
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    // eslint-disable-next-line class-methods-use-this
    dateValidator(control: FormControl): { [key: string]: boolean } | null {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (control.value && new Date(control.value) > currentDate) {
            return { futureDate: true };
        }
        return null;
    }

    get tags(): FormArray {
        return this.adminForm.get("tags") as FormArray;
    }

    addTag(): void {
        const tags = this.adminForm.get("tags") as FormArray;
        if (tags.length < 5) {
            tags.push(this.fb.control("", Validators.required));
        }
    }

    onSubmit(): void {
        if (this.adminForm.valid) {
            if (this.customCardsCount < 20) {
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                const uniqueId = this.generateUniqueId();

                const customCard = {
                    kind: "custom#card",
                    etag: "custom#card",
                    id: {
                        kind: "custom#card",
                        videoId: uniqueId,
                    },
                    snippet: {
                        publishedAt: this.adminForm.value.creationDate,
                        channelId: this.adminForm.value.videoLink,
                        title: this.adminForm.value.title,
                        description: this.adminForm.value.description,
                        thumbnails: {
                            default: {
                                url: this.adminForm.value.img,
                                width: 120,
                                height: 90,
                            },
                            medium: {
                                url: this.adminForm.value.img,
                                width: 320,
                                height: 180,
                            },
                            high: {
                                url: this.adminForm.value.img,
                                width: 480,
                                height: 360,
                            },
                        },
                        channelTitle: "",
                        liveBroadcastContent: "none",
                        publishTime: currentDate.toISOString(),
                    },
                    statistics: {
                        viewCount: "0",
                        likeCount: "0",
                        favoriteCount: "0",
                        commentCount: "0",
                    },
                };

                console.log("Custom Card Submitted", customCard);
                this.store.dispatch(AdminActions.addCard({ card: customCard }));
                console.log(this.customCardsCount);
                this.resetForm();
            } else {
                console.log("Maximum limit of 20 custom cards reached");
            }
        } else {
            console.log("Form did not validate");
        }
    }

    resetForm(): void {
        this.adminForm.reset();
        const tags = this.adminForm.get("tags") as FormArray;
        while (tags.length !== 1) {
            tags.removeAt(0);
        }
        tags.reset([{ value: "", disabled: false }]);

        console.log("Form reset");
    }

    // eslint-disable-next-line class-methods-use-this
    generateUniqueId(): string {
        const timestamp = Date.now().toString();
        const randomComponent = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0");
        return `custom-${timestamp}-${randomComponent}`;
    }
}
