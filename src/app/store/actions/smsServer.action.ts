import { Action } from '@ngrx/store';
import { smsServer } from '../../store/model/smsServer.model'

export const SAVE_SMSSERVER='[SL_UI] SAVE SMSSERVER';
export const UPDATE_SMSSERVER='[SL_UI] UPDATE SMSSERVER'; 

export class SavesmsServerAction implements Action
{
    readonly type= SAVE_SMSSERVER;
    constructor(public payload:smsServer){}
}

export class UpdatesmsServerAction implements Action
{
    readonly type = UPDATE_SMSSERVER;
    constructor(public payload: smsServer){}
}
//end Mailserver

export type Actions = SavesmsServerAction | UpdatesmsServerAction
