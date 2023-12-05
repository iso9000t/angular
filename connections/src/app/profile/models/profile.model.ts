export interface StringValue {
  S: string;
}

export interface ProfileResponse {
  createdAt: StringValue;
  email: StringValue;
  name: StringValue;
  uid: StringValue;
}

export interface ProfileError {
  type: string;
  message: string;
}
