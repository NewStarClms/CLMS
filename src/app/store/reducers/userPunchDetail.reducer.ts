import { Actions, SAVE_USER_PUNCH_DETAIL } from '../actions/userAttendanceDetail.action';
import {  PunchDetail } from '../model/userActionAttendanceDetail.model';

export interface UserPunchDetailState {
  userPunchDeatilList: PunchDetail | null;
  }
export const initialUserPunchDetailState: UserPunchDetailState = {
  userPunchDeatilList: null
};

export function UserPunchDetailReducer(
  state = initialUserPunchDetailState.userPunchDeatilList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_USER_PUNCH_DETAIL:
      return { ...state, userPunchDeatilList: action.payload};
    default:
      return state;
  }
}
