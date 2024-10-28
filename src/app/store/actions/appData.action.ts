import { Action } from '@ngrx/store';
import { AppData, TagMaster } from '../model/appData.model';
import { documentCategory } from '../model/master-data.model';

export const SAVE_APP_DATA = '[SL_UI] SAVE APP DATA';
export const UPDATE_APP_DATA = '[SL_UI] UPDATE APP DATA';
export const SAVE_DOCUMENT_CATEGORY = '[SL_UI] SAVE DOCUMENT_CATEGORY';
export const UPDATE_DOCUMENT_CATEGORY = '[SL_UI] UPDATE DOCUMENT_CATEGORY';
export const SAVE_TAG_MASTER = '[SL_UI] SAVE TAG_MASTER';
export const UPDATE_TAG_MASTER = '[SL_UI] UPDATE TAG_MASTER';
//start UserGroup
export class saveAppDataAction implements Action {
    readonly type = SAVE_APP_DATA;
    constructor(public payload: AppData) { }
}

export class updateAppDataAction implements Action {
  readonly type = UPDATE_APP_DATA;
  constructor(public payload: AppData) { }
}
//end UserGroup
//start DocumentCategory
export class saveDocumentCategoryAction implements Action {
  readonly type = SAVE_DOCUMENT_CATEGORY;
  constructor(public payload: documentCategory) { }
}

export class updateDocumentCategoryAction implements Action {
readonly type = UPDATE_DOCUMENT_CATEGORY;
constructor(public payload: documentCategory) { }
}
//end DocumentCategory
//start TagMaster
export class saveTagMasterAction implements Action {
  readonly type = SAVE_TAG_MASTER;
  constructor(public payload: TagMaster) { }
}

export class updateTagMasterAction implements Action {
readonly type = UPDATE_TAG_MASTER;
constructor(public payload: TagMaster) { }
}
//end TagMaster

  export type Actions = saveAppDataAction | updateAppDataAction 
  | saveDocumentCategoryAction | updateDocumentCategoryAction
  | saveTagMasterAction | updateTagMasterAction



