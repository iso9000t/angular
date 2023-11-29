import { Action } from "@ngrx/store";

import * as FavoriteActions from "../actions/favorite.actions";
import { favoriteReducer, initialState } from "./favorite.reducer";

describe("FavoriteReducer", () => {
    it("should return the default state", () => {
        const mockAction: Action = { type: "[Test] Mock Action" };
        const state = favoriteReducer(undefined, mockAction);
        expect(state).toBe(initialState);
    });

    it("should add a card ID to favorites", () => {
        const cardId = "test-id";
        const action = FavoriteActions.addToFavorite({ cardId });
        const state = favoriteReducer(undefined, action);
        expect(state.favoriteIds).toContain(cardId);
    });

    it("should remove a card ID from favorites", () => {
        const initialStateWithFavorite = {
            favoriteIds: ["test-id"],
        };
        const action = FavoriteActions.removeFromFavorite({ cardId: "test-id" });
        const state = favoriteReducer(initialStateWithFavorite, action);
        expect(state.favoriteIds).not.toContain("test-id");
    });
});
