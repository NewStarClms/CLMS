import { Actions, SAVE_DOCUMENT_TYPE } from "../actions/master.action";
import { DocumentTypes } from "../model/master-data.model";

export interface DocumentTypeState {
  documentTypeList: DocumentTypes | null;
  }
export const initialDocumentTypeState: DocumentTypeState = {
  documentTypeList: null
};

export function DocumentTypeReducer(
  state = initialDocumentTypeState.documentTypeList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_DOCUMENT_TYPE:
      return { ...state, documentTypeList: action.payload};
    default:
      return state;
  }
}
