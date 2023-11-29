import { createReducer, on } from "@ngrx/store";

import * as AdminActions from "../actions/custom.actions";
import { loadState } from "../local-storage";
import { AdminState } from "../state.model";

export const initialState: AdminState = loadState() || {
    cards: [],
};

export const adminReducer = createReducer<AdminState>(
    initialState,
    on(AdminActions.addCard, (state, { card }): AdminState => {
        if (state.cards.length < 20) {
            return {
                ...state,
                cards: [...state.cards, card],
            };
        }
        return state;
    }),
    on(
        AdminActions.removeCard,
        (state, { cardId }): AdminState => ({
            ...state,
            cards: state.cards.filter((card) => card.id.videoId !== cardId),
        })
    )
);
