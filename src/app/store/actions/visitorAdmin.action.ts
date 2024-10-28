import { Action } from '@ngrx/store';
import { VisitorAdmin } from '../model/visitorAdmin.model';

export const SAVE_VISITOR_ADMIN = '[SL_UI] SAVE VISITOR_ADMIN';
export const UPDATE_VISITOR_ADMIN = '[SL_UI] UPDATE VISITOR_ADMIN';

//start VISITOR_ADMIN
export class saveVisitorAdminAction implements Action {
    readonly type = SAVE_VISITOR_ADMIN;
    constructor(public payload: VisitorAdmin) { }
}

export class updateVisitorAdminAction implements Action {
  readonly type = UPDATE_VISITOR_ADMIN;
  constructor(public payload: VisitorAdmin) { }
}
//end VISITOR_ADMIN

  export type Actions = saveVisitorAdminAction | updateVisitorAdminAction

