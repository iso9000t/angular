import { createFeatureSelector, createSelector } from "@ngrx/store";

import { FavoriteState } from "../state.model";

export const selectFavoriteState = createFeatureSelector<FavoriteState>("favorite");

export const selectFavoriteIds = createSelector(
    selectFavoriteState,
    (state: FavoriteState) => state.favoriteIds
);

export const selectTestValue = createSelector(
    selectFavoriteState,
    (state: FavoriteState) => state.testMessage
);
