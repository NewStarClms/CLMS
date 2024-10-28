import { Actions, SAVE_BANK, SAVE_BRANCH } from '../actions/master.action';
import {  Bank } from '../model/master-data.model';

export interface BankState {
  bankList: Bank | null;
  }
export const initialBankState: BankState = {
  bankList: null
};

export function bankReducer(
  state = initialBankState.bankList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_BANK:
      return { ...state, bankList: action.payload};
    default:
      return state;
  }
}
