import { FavoriteState } from "../state.model";
import * as fromSelectors from "./favorite.selectors";

describe("Favorite Selectors", () => {
    const mockFavoriteState: FavoriteState = {
        favoriteIds: ["id1", "id2"],
        testMessage: "Test Message",
    };

    it("should select favorite IDs", () => {
        const selected = fromSelectors.selectFavoriteIds.projector(mockFavoriteState);
        expect(selected).toEqual(mockFavoriteState.favoriteIds);
    });

    it("should select test value", () => {
        const selected = fromSelectors.selectTestValue.projector(mockFavoriteState);
        expect(selected).toBe(mockFavoriteState.testMessage);
    });
});
