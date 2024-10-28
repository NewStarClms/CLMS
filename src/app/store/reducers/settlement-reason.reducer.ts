
import {Actions, SAVE_SettlementReason } from '../actions/settlement-reason.action';
import { SettlementReason } from '../model/settlement-reason.model';

export interface SettlementReasonState {
    SettlementReasonList: SettlementReason | null;
}

export const initialSettlementReasonState: SettlementReasonState = {
    SettlementReasonList: null
};

export function SettlementReasonReducer(
  state = initialSettlementReasonState.SettlementReasonList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_SettlementReason:
      return { ...state, SettlementReasonList: action.payload};
    default:
      return state;
  }
}






