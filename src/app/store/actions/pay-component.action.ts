import { Action } from '@ngrx/store';
import { PayComponentModel, PayHeadsModel } from '../model/pay-component.model';

export const SAVE_PAY_HEADS = '[SL_UI] SAVE PAY HEADS';
export const SAVE_PAY_COMPONENTS = '[SL_UI] SAVE PAY COMPONENTS';

//start Report
export class SavePayHeadsAction implements Action {
    readonly type = SAVE_PAY_HEADS;
    constructor(public payload: Array<PayHeadsModel>) { }
}

export class savePayComponentsAction implements Action {
    readonly type = SAVE_PAY_COMPONENTS;
    constructor(public payload: Array<PayComponentModel>) { }
}

export type Actions = SavePayHeadsAction | savePayComponentsAction