import { Action } from '@ngrx/store';
import { EmployeeDashboardSetting } from '../model/employee-dashboard-setting.model';
import { GlobalEmployeeFilter } from '../model/globalemployeefilter.model';

export const SAVE_GLOBALEMPLOYEEFILTER = '[SL_UI] SAVE GLOBALEMPLOYEEFILTER';
export const UPDATE_GLOBALEMPLOYEEFILTER = '[SL_UI] UPDATE GLOBALEMPLOYEEFILTER';
export const SAVE_EMPLOYEEDASHBOARDSETTING='[SL_UI] SAVE EMPLOYEEDASHBOARDSETTING';

//start GLOBALEMPLOYEEFILTER
export class saveGlobalEmployeeFilterAction implements Action {
    readonly type = SAVE_GLOBALEMPLOYEEFILTER;
    constructor(public payload: GlobalEmployeeFilter) { }
}

export class updateGlobalEmployeeFilterAction implements Action {
  readonly type = UPDATE_GLOBALEMPLOYEEFILTER;
  constructor(public payload: GlobalEmployeeFilter) { }
}

export class saveEmployeeDashboardSettingAction implements Action {
  readonly type = SAVE_EMPLOYEEDASHBOARDSETTING;
  constructor(public payload: EmployeeDashboardSetting[]) { }
}
//end GLOBALEMPLOYEEFILTER

  export type Actions = saveGlobalEmployeeFilterAction | updateGlobalEmployeeFilterAction | saveEmployeeDashboardSettingAction

