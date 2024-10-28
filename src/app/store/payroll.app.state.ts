import { createFeatureSelector } from "@ngrx/store";
import * as payComReducer from './reducers/pay-component.reducer';
import * as settlementReasonReducer from './reducers/settlement-reason.reducer';
import * as FinancialyYearReducer  from "./reducers/financialy-year.reducer";


export interface PayrollAppState {
    payHeadList:payComReducer.PayHeadsState,
    pyCompList: payComReducer.PayComponentState,
    SettlementReasonList: settlementReasonReducer.SettlementReasonState,
    FinanacialyYearList: FinancialyYearReducer.FinancialyYearState,
}

export const payrollAppReducers = {
    payHeads: payComReducer.PayHeadReducer,
    payComponents: payComReducer.PayComponentReducer,
    settlementReasons: settlementReasonReducer.SettlementReasonReducer,
    FinancialyYears: FinancialyYearReducer.FinancialyYearReducer,
}

export const selectPayHeadsState = createFeatureSelector<any>('payHeads');
export const selectPayComponentState = createFeatureSelector<any>('payComponents');
export const selectSettlementReaasonState = createFeatureSelector<any>('settlementReasons');
export const selectFinancialyYearState = createFeatureSelector<any>('FinancialyYears');