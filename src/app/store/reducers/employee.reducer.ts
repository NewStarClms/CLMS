import { Actions, SAVE_EMPLOYEE} from '../actions/workforce.action';
import {  Employee } from '../model/employee.model';

export interface EmployeeState {
  employeeList: Employee | null;
  }
export const initialEmployeeState: EmployeeState = {
  employeeList: null
};

export function employeeReducer(
  state = initialEmployeeState.employeeList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_EMPLOYEE:
      return { ...state, employeeList: action.payload};
    default:
      return state;
  }
}
