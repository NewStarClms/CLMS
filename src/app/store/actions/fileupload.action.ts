import { Action } from '@ngrx/store';
import { FileUpload } from '../model/file.model';

export const SAVE_FILEUPLOAD = '[SL_UI] SAVE FILEUPLOAD';
export const UPDATE_FILEUPLOAD = '[SL_UI] UPDATE FILEUPLOAD';

//start FileUpload
export class saveFileUploadAction implements Action {
    readonly type = SAVE_FILEUPLOAD;
    constructor(public payload: FileUpload) { }
}

export class updateFileUploadAction implements Action {
  readonly type = UPDATE_FILEUPLOAD;
  constructor(public payload: FileUpload) { }
}
//end FileUpload

  export type Actions = saveFileUploadAction | updateFileUploadAction

