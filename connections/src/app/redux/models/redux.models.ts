import { GroupError, GroupItem } from "src/app/main/models/group.model";
import { ProfileError, ProfileResponse } from "src/app/profile/models/profile.model";

export interface ProfileState {
  profile: ProfileResponse | null;
  error: ProfileError | null;
}
export interface GroupState {
  groups: GroupItem[];
  loading: boolean;
  error: GroupError | null;
  lastUpdateTimestamp: number | null;
  hasUpdated: boolean;
}

