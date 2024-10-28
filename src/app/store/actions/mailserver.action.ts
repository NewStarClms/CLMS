import { Action } from '@ngrx/store';
import {  mailserver } from '../../store/model/mailserver.model';

export const SAVE_MAILSERVER = '[SL_UI] SAVE MAILSERVER';
export const UPDATE_MAILSERVER = '[SL_UI] UPDATE MAILSERVER';

//start Mailserver
export class saveMailServerAction implements Action {
    readonly type = SAVE_MAILSERVER;
    constructor(public payload: mailserver) { }
}

export class updateMailServerAction implements Action {
  readonly type = UPDATE_MAILSERVER;
  constructor(public payload: mailserver) { }
}
//end Mailserver

  export type Actions = saveMailServerAction | updateMailServerAction 