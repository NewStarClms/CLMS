import { Actions, SAVE_USER_ATTENDANCE_DETAIL } from '../actions/userAttendanceDetail.action';
import {  AttendancesDetail } from '../model/userActionAttendanceDetail.model';

export interface UserAttendanceDetailState {
  userAttendanceDeatilList: AttendancesDetail | null;
  }
export const initialUserAttendanceDetailState: UserAttendanceDetailState = {
  userAttendanceDeatilList: null
};

export function UserAttendanceDetailReducer(
  state = initialUserAttendanceDetailState.userAttendanceDeatilList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_USER_ATTENDANCE_DETAIL:
      return { ...state, userAttendanceDeatilList: action.payload};
    default:
      return state;
  }
}
