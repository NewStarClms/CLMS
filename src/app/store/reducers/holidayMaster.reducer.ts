import { Actions, GET_HOLIDAY_MASTER } from '../actions/master.action';
import { HolidayMaster } from '../model/holidayMaster.model';

export interface HolidayMasterState {
  holidayMasterList: HolidayMaster | null;
  }
export const initialHolidayMasterState: HolidayMasterState = {
  holidayMasterList: null
};

export function HolidayMasterReducer(
  state = initialHolidayMasterState.holidayMasterList,
  action: Actions
) {
  switch (action.type) {
    case GET_HOLIDAY_MASTER:
      return { ...state, HolidayMaster: action.payload}
    default:
      return state;
  }
}
