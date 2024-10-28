import { Actions, SAVE_HOLIDAY_CALENDER_POLICY } from '../actions/master.action';
import {  HolidayCalenderPolicy } from '../model/holidaycalenderpolicy.model';

export interface HolidayCalenderPolicyState {
    holidayCalenderPolicyList: HolidayCalenderPolicy | null;
  }
export const initialHolidayCalenderPolicyState: HolidayCalenderPolicyState = {
    holidayCalenderPolicyList: null
};

export function HolidayCalenderPolicyReducer(
  state = initialHolidayCalenderPolicyState.holidayCalenderPolicyList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_HOLIDAY_CALENDER_POLICY:
      return { ...state, holidayCalenderPolicyList: action.payload};
    default:
      return state;
  }
}
