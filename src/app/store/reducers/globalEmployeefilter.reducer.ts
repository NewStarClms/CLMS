import { Actions, SAVE_EMPLOYEEDASHBOARDSETTING, SAVE_GLOBALEMPLOYEEFILTER } from '../actions/globalemployeefirlder.action';
import { EmployeeDashboardSetting } from '../model/employee-dashboard-setting.model';
import {  GlobalEmployeeFilter } from '../model/globalemployeefilter.model';

export interface GlobalEmployeeFilterState {
  globalEmployeeFilterList: GlobalEmployeeFilter | null;
  }
export const initialGlobalEmployeeFilterState: GlobalEmployeeFilterState = {
  globalEmployeeFilterList: null
};

export function globalEmployeeFilterReducer(
  state = initialGlobalEmployeeFilterState.globalEmployeeFilterList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_GLOBALEMPLOYEEFILTER:
      return { ...state, globalEmployeeFilterkList: action.payload};
    default:
      return state;
  }
}

export interface EmployeeDashboardSettingState{
  employeeDashboardSettingList : EmployeeDashboardSetting[] | null;
}
export const initialEmployeeDashboardSettingState: EmployeeDashboardSettingState={
  employeeDashboardSettingList: null
}
export function employeeDashboardSettingReducer(state = initialEmployeeDashboardSettingState.employeeDashboardSettingList,
  action: Actions){
    switch (action.type) {
      case SAVE_EMPLOYEEDASHBOARDSETTING:
        return { ...state, employeeDashboardSettingList: action.payload};
      default:
        return state;
    }
}
