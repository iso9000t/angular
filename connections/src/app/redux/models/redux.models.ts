import { ConversationError, ConversationItem } from "src/app/main/models/conversation.model";
import { GroupError, GroupItem, GroupMessageError, GroupMessageItem } from "src/app/main/models/group.model";
import { UserError, UserItem } from "src/app/main/models/user.model";
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
}

export interface UserState {
  users: UserItem[];
  isLoading: boolean;
  error: UserError | null;
  lastUpdated: number | null;
}

export interface ConversationState {
  conversations: ConversationItem[];
  isLoading: boolean;
  error: ConversationError | null;
  lastUpdated: number | null;
}

export interface GroupMessages {
  messages: GroupMessageItem[];
  isLoading: boolean;
  error: GroupMessageError | null;
  lastFetched: number | null;
  initialLoadCompleted: boolean;
}

export interface GroupMessageState {
  groups: { [groupId: string]: GroupMessages };
}

