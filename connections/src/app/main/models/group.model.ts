export interface GroupUpdateResponse {
  Count: number;
  Items: GroupItem[];
}

export interface GroupItem {
  id: AttributeValue;
  name: AttributeValue;
  createdAt: AttributeValue;
  createdBy: AttributeValue;
}

export interface AttributeValue {
  S: string;
}
export interface GroupError {
    type: string;
    message: string;
}