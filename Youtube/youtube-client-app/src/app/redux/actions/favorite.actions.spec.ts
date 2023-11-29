import * as fromFavoriteActions from "./favorite.actions";

describe("Favorite Actions", () => {
    it("should create an action to add to favorite", () => {
        const cardId = "ABC123";
        const action = fromFavoriteActions.addToFavorite({ cardId });

        expect(action.type).toBe("[Favorite] Add To Favorite");
        expect(action.cardId).toBe(cardId);
    });

    it("should create an action to remove from favorite", () => {
        const cardId = "XYZ789";
        const action = fromFavoriteActions.removeFromFavorite({ cardId });

        expect(action.type).toBe("[Favorite] Remove From Favorite");
        expect(action.cardId).toBe(cardId);
    });
});
