import { createReducer, on } from "@ngrx/store";

import * as FavoriteActions from "../actions/favorite.actions";
import { FavoriteState } from "../state.model";

export const initialState: FavoriteState = {
    favoriteIds: [],
};

export const favoriteReducer = createReducer<FavoriteState>(
    initialState,
    on(
        FavoriteActions.addToFavorite,
        (state, { cardId }): FavoriteState => ({
            ...state,
            favoriteIds: state.favoriteIds.includes(cardId)
                ? state.favoriteIds
                : [...state.favoriteIds, cardId],
        })
    ),
    on(
        FavoriteActions.removeFromFavorite,
        (state, { cardId }): FavoriteState => ({
            ...state,
            favoriteIds: state.favoriteIds.filter((id) => id !== cardId),
        })
    ),
);
