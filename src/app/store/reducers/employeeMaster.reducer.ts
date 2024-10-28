import { Actions,SAVE_EMPLOYEE_MASTER} from '../actions/workforce.action';
import {  EmployeeMaster } from '../model/employee.model';

export interface EmployeeMasterState {
  employeeMasterList: EmployeeMaster | null;
  }
export const initialEmployeeMasterState: EmployeeMasterState = {
  employeeMasterList: null
};

export function employeeMasterReducer(
  state = initialEmployeeMasterState.employeeMasterList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_EMPLOYEE_MASTER:
      return { ...state, employeeMasterList: action.payload};
    default:
      return state;
  }
}
