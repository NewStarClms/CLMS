import { Action } from '@ngrx/store';
import { AttendancesDetail, PunchDetail } from '../model/userActionAttendanceDetail.model';

export const SAVE_USER_ATTENDANCE_DETAIL = '[SL_UI] SAVE USER_ATTENDANCE_DETAIL';
export const UPDATE_USER_ATTENDANCE_DETAIL = '[SL_UI] UPDATE USER_ATTENDANCE_DETAIL';
export const SAVE_USER_PUNCH_DETAIL = '[SL_UI] SAVE USER_PUNCH_DETAIL';
export const UPDATE_USER_PUNCH_DETAIL = '[SL_UI] UPDATE USER_PUNCH_DETAIL';

// ATART USER_ATTENDANCE_DETAIL
export class saveUserAttendanceDetailAction implements Action {
    readonly type = SAVE_USER_ATTENDANCE_DETAIL;
    constructor(public payload: AttendancesDetail) { }
}

export class updateUserAttendanceDetailAction implements Action {
  readonly type = UPDATE_USER_ATTENDANCE_DETAIL;
  constructor(public payload: AttendancesDetail) { }
}
//end USER_ATTENDANCE_DETAIL
// ATART USER_PUNCH_DETAIL
export class saveUserPunchDetailAction implements Action {
  readonly type = SAVE_USER_PUNCH_DETAIL;
  constructor(public payload: PunchDetail) { }
}

export class updateUserPunchDetailAction implements Action {
readonly type = UPDATE_USER_PUNCH_DETAIL;
constructor(public payload: PunchDetail) { }
}
//end USER_PUNCH_DETAIL

  export type Actions = saveUserAttendanceDetailAction | updateUserAttendanceDetailAction |
                        saveUserPunchDetailAction | updateUserPunchDetailAction

