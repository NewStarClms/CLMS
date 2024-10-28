import { Actions, SAVE_FILEUPLOAD} from '../actions/fileupload.action';
import {  FileUpload } from '../model/file.model';

export interface FileUploadState {
  fileuploadList: FileUpload | null;
}

export const initialFileUploadState: FileUploadState = {
  fileuploadList: null
};

export function fileuploadReducer(
  state = initialFileUploadState.fileuploadList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_FILEUPLOAD:
      return { ...state, fileuploadList: action.payload};
    default:
      return state;
  }
}
