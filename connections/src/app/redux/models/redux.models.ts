import { ProfileResponse } from "src/app/profile/models/profile.model";

export interface ProfileState {
  profile: ProfileResponse | null;
  error: string | null;
}