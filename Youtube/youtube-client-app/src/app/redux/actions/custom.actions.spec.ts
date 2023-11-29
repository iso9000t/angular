import * as AdminActions from "./custom.actions";

describe("Admin Actions", () => {
    it("should create an addCard action", () => {
        const card = {
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

        const action = AdminActions.addCard({ card });
        expect(action.type).toEqual("[Admin] Add Card");
        expect(action.card).toEqual(card);
    });

    it("should create a removeCard action", () => {
        const cardId = "testVideoId";
        const action = AdminActions.removeCard({ cardId });
        expect(action.type).toEqual("[Admin] Remove Card");
        expect(action.cardId).toBe(cardId);
    });
});
