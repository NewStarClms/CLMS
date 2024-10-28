import { Action } from '@ngrx/store';
import { SettlementReason } from '../model/settlement-reason.model';

export const SAVE_SettlementReason = '[SL_UI] SAVE SettlementReason';
export const UPDATE_SettlementReason = '[SL_UI] UPDATE SettlementReason';


export class saveSettlementReasonAction implements Action {
    readonly type = SAVE_SettlementReason;
    constructor(public payload: SettlementReason) { }
}
export class updateSettlementReasonAction implements Action {
  readonly type = UPDATE_SettlementReason;
  constructor(public payload: SettlementReason) { }
}
export type Actions = saveSettlementReasonAction | updateSettlementReasonAction

