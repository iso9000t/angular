import { AttributeValue } from "./group.model";

export interface PrivateMessageItem {
  authorID: AttributeValue;
  message: AttributeValue;
  createdAt: AttributeValue;
}

export interface PrivateMessageListResponse {
  Count: number;
  Items: PrivateMessageItem[];
}
