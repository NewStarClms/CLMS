import { Action } from '@ngrx/store';
import { RequestApproveModel, RequestFlowModel } from '../model/request.model';

export const SAVE_REQUEST_FLOW = '[SL_UI] SAVE Request Flow';
export const SAVE_REQUEST_FLOW_APPROVE = '[SL_UI] SAVE Request Flow Approve';

//start Report
export class SaveRequestLeaveAction implements Action {
    readonly type = SAVE_REQUEST_FLOW;
    constructor(public payload: RequestFlowModel) { }
}
export class SaveRequestApproveAction implements Action {
    readonly type = SAVE_REQUEST_FLOW_APPROVE;
    constructor(public payload: RequestApproveModel) { }
}

export type Actions = SaveRequestLeaveAction | SaveRequestApproveAction