import { createAction, props } from "@ngrx/store";

import { Card } from "../state.model";

export const addCard = createAction(
    "[Admin] Add Card",
    props<{ card: Card }>()
);

export const removeCard = createAction(
    "[Admin] Remove Card",
    props<{ cardId: string }>()
);
