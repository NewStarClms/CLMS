import { Actions, SAVE_DEPARTMENT } from '../actions/master.action';
import {  Department } from '../model/master-data.model';

export interface DepartmentState {
  departmentList: Department | null;
  }
export const initialDepartmentState: DepartmentState = {
  departmentList: null
};

export function DepartmentReducer(
  state = initialDepartmentState.departmentList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_DEPARTMENT:
      return { ...state, departmentList: action.payload};
    default:
      return state;
  }
}
