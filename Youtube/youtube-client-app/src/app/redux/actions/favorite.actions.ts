import { createAction, props } from "@ngrx/store";

export const addToFavorite = createAction(
    "[Favorite] Add To Favorite",
    props<{ cardId: string }>()
);

export const removeFromFavorite = createAction(
    "[Favorite] Remove From Favorite",
    props<{ cardId: string }>()
);
