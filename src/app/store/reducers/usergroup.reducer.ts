import { Actions, SAVE_USER_GROUP } from '../actions/usermanage.action';
import {  UserGroup } from '../model/usermanage.model';

export interface UserGroupState {
  userGroupList: UserGroup | null;
  }
export const initialUserGroupState: UserGroupState = {
  userGroupList: null
};

export function userGroupReducer(
  state = initialUserGroupState.userGroupList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_USER_GROUP:
      return { ...state, userGroupList: action.payload};
    default:
      return state;
  }
}
