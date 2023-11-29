import * as AdminActions from "../actions/custom.actions";
import { Card } from "../state.model";
import { adminReducer, initialState } from "./custom.reducer";

describe("Admin Reducer", () => {
    const mockCard: Card = {
        kind: "testKind",
        etag: "testEtag",
        id: {
            kind: "testIdKind",
            videoId: "testVideoId",
        },
        snippet: {
            publishedAt: "2023-01-01T00:00:00Z",
            channelId: "testChannelId",
            title: "testTitle",
            description: "testDescription",
            thumbnails: {
                default: {
                    url: "http://example.com/default.jpg",
                    width: 120,
                    height: 90,
                },
                medium: {
                    url: "http://example.com/medium.jpg",
                    width: 320,
                    height: 180,
                },
                high: { url: "http://example.com/high.jpg", width: 480, height: 360 },
            },
            channelTitle: "testChannelTitle",
            liveBroadcastContent: "none",
            publishTime: "2023-01-01T00:00:00Z",
        },
        statistics: {
            viewCount: "1000",
            likeCount: "100",
            favoriteCount: "50",
            commentCount: "20",
        },
    };

    it("should return the initial state", () => {
        const action = { type: "NOOP" };
        const state = adminReducer(undefined, action);

        expect(state.cards).toEqual(initialState.cards);
    });

    it("should add a card on addCard action", () => {
        const action = AdminActions.addCard({ card: mockCard });
        const state = adminReducer(undefined, action);

        expect(state.cards).toContain(mockCard);
    });

    it("should remove a card on removeCard action", () => {
        const initial = {
            ...initialState,
            cards: [mockCard],
        };
        const action = AdminActions.removeCard({ cardId: mockCard.id.videoId });
        const state = adminReducer(initial, action);

        expect(state.cards.length).toBe(0);
    });
});
