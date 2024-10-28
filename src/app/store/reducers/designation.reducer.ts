import { Actions, SAVE_DESIGNATION } from '../actions/master.action';
import {  Designation } from '../model/master-data.model';

export interface DesignationState {
  designationList: Designation | null;
  }
export const initialDesignationState: DesignationState = {
  designationList: null
};

export function DesignationReducer(
  state = initialDesignationState.designationList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_DESIGNATION:
      return { ...state, designationList: action.payload};
    default:
      return state;
  }
}
