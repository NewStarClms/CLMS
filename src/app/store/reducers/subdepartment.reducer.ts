import { Actions, SAVE_SUBDEPARTMENT} from "../actions/master.action";
import { SubDepartment } from "../model/master-data.model";

export interface SubDepartmentState {
  subdepartmentList: SubDepartment | null;
  }
export const initialSubDepartmentState: SubDepartmentState = {
  subdepartmentList: null
};

export function SubDepartmentReducer(
  state = initialSubDepartmentState.subdepartmentList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_SUBDEPARTMENT:
      return { ...state, subdepartmentList: action.payload};
    default:
      return state;
  }
}
