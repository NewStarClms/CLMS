import { Actions, SAVE_EMPLOYEES_OUSTATUS } from '../actions/usermanage.action';
import {  EmployeeUserGroup } from '../model/usermanage.model';

export interface EmployeeOUStatusState {
  employeesOUStatusList: EmployeeUserGroup | null;
  }
export const initialEmployeeOUStatusState: EmployeeOUStatusState = {
    employeesOUStatusList: null
};

export function employeeOUStatusReducer(
  state = initialEmployeeOUStatusState.employeesOUStatusList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_EMPLOYEES_OUSTATUS:
      return { ...state, employeesOUStatusList: action.payload};
    default:
      return state;
  }
  
}
