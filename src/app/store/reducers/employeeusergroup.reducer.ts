import { Actions, SAVE_EMPLOYEEUSER_GROUP } from '../actions/usermanage.action';
import {  EmployeeUserGroup } from '../model/usermanage.model';

export interface EmployeeUserGroupState {
  employeeUserGroupList: EmployeeUserGroup | null;
  }
export const initialEmployeeUserGroupState: EmployeeUserGroupState = {
  employeeUserGroupList: null
};

export function employeeUserGroupReducer(
  state = initialEmployeeUserGroupState.employeeUserGroupList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_EMPLOYEEUSER_GROUP:
      return { ...state, employeeUserGroupList: action.payload};
    default:
      return state;
  }
  
}
