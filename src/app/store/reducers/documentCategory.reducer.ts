import { Actions,SAVE_DOCUMENT_CATEGORY} from '../actions/appData.action';
import {  documentCategory } from '../model/master-data.model';

export interface DocumentCategoryState {
  documentCategoryList: documentCategory | null;
  }
export const initialDocumentCategoryState: DocumentCategoryState = {
  documentCategoryList: null
};

export function documentCategoryReducer(
  state = initialDocumentCategoryState.documentCategoryList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_DOCUMENT_CATEGORY:
      return { ...state, documentCategoryList: action.payload};
    default:
      return state;
  }
}
