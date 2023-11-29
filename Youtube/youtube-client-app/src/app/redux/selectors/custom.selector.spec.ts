import { AdminState, Card } from "../state.model";
import * as fromSelectors from "./custom.selector";

describe("Admin Selectors", () => {
    it("should select the admin cards", () => {
        const mockCard: Card = {
            kind: "someKind",
            etag: "someEtag",
            id: {
                kind: "video",
                videoId: "12345",
            },
            snippet: {
                publishedAt: "2021-01-01T00:00:00Z",
                channelId: "channelId",
                title: "Video Title",
                description: "Video description",
                thumbnails: {
                    default: { url: "url", width: 120, height: 90 },
                    medium: { url: "url", width: 320, height: 180 },
                    high: { url: "url", width: 480, height: 360 },
                },
                channelTitle: "Channel Title",
                liveBroadcastContent: "none",
                publishTime: "2021-01-01T00:00:00Z",
            },
            statistics: {
                viewCount: "100",
                likeCount: "10",
                favoriteCount: "5",
                commentCount: "2",
            },
        };

        const mockState: AdminState = {
            cards: [mockCard],
        };

        const selected = fromSelectors.selectAdminCards.projector(mockState);
        expect(selected).toEqual(mockState.cards);
    });
});
