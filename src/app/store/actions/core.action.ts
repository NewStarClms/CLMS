import { Action } from '@ngrx/store';
import { AutoCode } from '../model/autocode.model';

export const SAVE_AUTO_CODE = '[SL_UI] SAVE AUTO_CODE';
export const UPDATE_AUTO_CODE = '[SL_UI] UPDATE AUTO_CODE';

export const SAVE_AUTO_CODE_ORG = '[SL_UI] SAVE AUTO_CODE_ORG';

//start AUTO_CODE
export class saveAutoCodeAction implements Action {
    readonly type = SAVE_AUTO_CODE;
    constructor(public payload: AutoCode) { }
}

export class updateAutoCodeAction implements Action {
  readonly type = UPDATE_AUTO_CODE;
  constructor(public payload: AutoCode) { }
}
//end AUTO_CODE

// autocode organization 
export class saveAutoCodeOrgAction implements Action {
  readonly type = SAVE_AUTO_CODE_ORG;
  constructor(public payload: Array<{key:string,value:string}>) { }
}

  export type Actions = saveAutoCodeAction | updateAutoCodeAction | saveAutoCodeOrgAction

