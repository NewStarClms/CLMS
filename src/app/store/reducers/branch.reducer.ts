import { Actions, SAVE_BRANCH } from '../actions/master.action';
import {  Branch, BranchModel } from '../model/master-data.model';

export interface BranchState {
  branchList: BranchModel | null;
  }
export const initialBranchState: BranchState = {
  branchList: null
};

export function branchReducer(
  state = initialBranchState.branchList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_BRANCH:
      return { ...state, branchList: action.payload};
    default:
      return state;
  }
}
