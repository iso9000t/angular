import { createFeatureSelector, createSelector } from "@ngrx/store";

import { AdminState } from "../state.model";

export const selectAdminState = createFeatureSelector<AdminState>("admin");

export const selectAdminCards = createSelector(
    selectAdminState,
    (state: AdminState) => state.cards
);
