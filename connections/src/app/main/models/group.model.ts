export interface GroupUpdateResponse {
  Count: number;
  Items: GroupItem[];
}

export interface GroupItem {
  id: AttributeValue;
  name: AttributeValue;
  createdAt?: AttributeValue;
  createdBy?: AttributeValue;
}

export interface AttributeValue {
  S: string;
}
export interface GroupError {
  type: string;
  message: string;
}

export interface GroupCreateResponse {
  groupID: string;
}
export interface GroupCreateRequestBody {
  name: string;
}

export interface GroupMessageItem {
  authorID: AttributeValue;
  message: AttributeValue;
  createdAt: AttributeValue;
}

export interface GroupMessageResponse {
  Count: number;
  Items: GroupMessageItem[];
}

export interface GroupMessageError {
  type: string;
  message: string;
}
