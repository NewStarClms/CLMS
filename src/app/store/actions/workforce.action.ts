import { Action } from '@ngrx/store';
import { Employee, EmployeeMaster } from '../model/employee.model';

export const SAVE_EMPLOYEE = '[SL_UI] SAVE EMPLOYEE';
export const UPDATE_EMPLOYEE = '[SL_UI] UPDATE EMPLOYEE';
export const SAVE_EMPLOYEE_MASTER = '[SL_UI] SAVE EMPLOYEE MASTER';
export const UPDATE_EMPLOYEE_MASTER = '[SL_UI] UPDATE EMPLOYEE MASTER';

//start Employee
export class saveEmployeeAction implements Action {
    readonly type = SAVE_EMPLOYEE;
    constructor(public payload: Employee) { }
}

export class updateEmployeeAction implements Action {
  readonly type = UPDATE_EMPLOYEE;
  constructor(public payload: Employee) { }
}
//end Employee
//start EmployeeMaster
export class saveEmployeeMasterAction implements Action {
  readonly type = SAVE_EMPLOYEE_MASTER;
  constructor(public payload: EmployeeMaster) { }
}

export class updateEmployeeMasterAction implements Action {
readonly type = UPDATE_EMPLOYEE_MASTER;
constructor(public payload: EmployeeMaster) { }
}
//end EmployeeMaster

export type Actions = saveEmployeeAction | updateEmployeeAction |
                        saveEmployeeMasterAction | updateEmployeeMasterAction

