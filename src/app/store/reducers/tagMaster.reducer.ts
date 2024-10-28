import { Actions,SAVE_TAG_MASTER} from '../actions/appData.action';
import {  TagMaster } from '../model/appData.model';

export interface TagMasterState {
  tagMasterList: TagMaster | null;
  }
export const initialTagMasterState: TagMasterState = {
  tagMasterList: null
};

export function tagMasterReducer(
  state = initialTagMasterState.tagMasterList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_TAG_MASTER:
      return { ...state, tagMasterList: action.payload};
    default:
      return state;
  }
}
