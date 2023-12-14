import { AttributeValue } from "./group.model";

export interface UserListResponse {
  Count: number;
  Items: UserItem[];
}

export interface UserItem {
  name: AttributeValue;
  uid: AttributeValue;
}

export interface UserError {
  type: string;
  message: string;
}
