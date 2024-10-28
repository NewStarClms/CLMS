import { Action } from '@ngrx/store';
import { CanteenPolicyDetail,CanteenPolicyModel } from '../model/canteen.model';

export const SAVE_CanteenPolicyDetail = '[SL_UI] SAVE CanteenPolicyDetail';
export const UPDATE_CanteenPolicyDetail = '[SL_UI] UPDATE CanteenPolicyDetail';


export class saveCanteenPolicyDetailAction implements Action {
    readonly type = SAVE_CanteenPolicyDetail;
    constructor(public payload: CanteenPolicyDetail) { }
}

export class updateCanteenPolicyDetailAction implements Action {
    readonly type = UPDATE_CanteenPolicyDetail;
    constructor(public payload: CanteenPolicyDetail) { }
}

export class saveCanteenPolicyDetaildAction implements Action {
    readonly type = SAVE_CanteenPolicyDetail;
    constructor(public payload: CanteenPolicyModel) { }
}

export type Actions = saveCanteenPolicyDetailAction | updateCanteenPolicyDetailAction|saveCanteenPolicyDetaildAction