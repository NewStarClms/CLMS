import { Actions,SAVE_USER_GROUP_TYPE} from '../actions/usermanage.action';
import {  UserGroupType } from '../model/usermanage.model';

export interface UserGroupTypeState {
  userGroupTypeList: UserGroupType | null;
  }
export const initialUserGroupTypeState: UserGroupTypeState = {
  userGroupTypeList: null
};

export function userGroupTypeReducer(
  state = initialUserGroupTypeState.userGroupTypeList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_USER_GROUP_TYPE:
      return { ...state, userGroupTypeList: action.payload};
    default:
      return state;
  }
}
