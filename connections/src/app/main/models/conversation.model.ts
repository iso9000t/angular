import { AttributeValue } from "./group.model";

export interface ConversationListResponse {
  Count: number;
  Items: ConversationItem[];
}

export interface ConversationItem {
  id: AttributeValue;
  companionID: AttributeValue;
}

export interface ConversationError {
  type: string;
  message: string;
}

export interface ConversationCreateResponse {
  conversationID: string;
}
