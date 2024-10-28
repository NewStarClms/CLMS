import { Action } from '@ngrx/store';
import { FinancialyYear } from '../model/financialy-year.model';

export const SAVE_FinancialyYear = '[SL_UI] SAVE FinancialyYear';
export const UPDATE_FinancialyYear = '[SL_UI] UPDATE FinancialyYear';


export class saveFinancialyYearAction implements Action {
    readonly type = SAVE_FinancialyYear;
    constructor(public payload: FinancialyYear) { }
}

export class updateFinancialyYearAction implements Action {
    readonly type = UPDATE_FinancialyYear;
    constructor(public payload: FinancialyYear) { }
}
export type Actions = saveFinancialyYearAction | updateFinancialyYearAction

