import { Actions, SAVE_BNKBRANCH } from '../actions/master.action';
import {  BankBranch } from '../model/master-data.model';

export interface BankBranchState {
  bankbranchList: BankBranch | null;
  }
export const initialBankBranchState: BankBranchState = {
  bankbranchList: null
};

export function bankbranchReducer(
  state = initialBankBranchState.bankbranchList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_BNKBRANCH:
      return { ...state, bankbranchList: action.payload};
    default:
      return state;
  }
}
