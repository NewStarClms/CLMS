import { Actions, GET_ATTENDANCE_POLICY_DATA } from '../actions/master.action';
import {  policyMasters } from '../model/master-data.model';

export interface AttendancePolicyMasterState {
  attendancePolicyMasterList: policyMasters | null;
  }
export const initialAttendancePolicyMasterState: AttendancePolicyMasterState = {
  attendancePolicyMasterList: null
};

export function AttendancePolicyMasterReducer(
  state = initialAttendancePolicyMasterState.attendancePolicyMasterList,
  action: Actions
) {
  switch (action.type) {
    case GET_ATTENDANCE_POLICY_DATA:
      return { ...state, attendancePolicyMasterList: action.payload};
    default:
      return state;
  }
}
