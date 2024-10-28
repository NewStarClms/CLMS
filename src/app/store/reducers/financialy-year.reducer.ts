
import {Actions, SAVE_FinancialyYear } from '../actions/financialy-year.action';
//import { SettlementReason } from '../model/settlement-reason.model';
import { FinancialyYear } from '../model/financialy-year.model';

export interface FinancialyYearState {
    FinancialyYearList: FinancialyYear | null;
}

export const initialFinancialyYearState: FinancialyYearState = {
    FinancialyYearList: null
};

export function FinancialyYearReducer(
  state = initialFinancialyYearState.FinancialyYearList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_FinancialyYear:
    return { ...state, FinancialyYearList: action.payload};
    default:
    return state;
  }
}

