import { Actions, SAVE_GLOBAL_SETTING} from '../actions/globalsetting.action';
import {  GlobalSetting } from '../model/globalsetting.model';

export interface GlobalSettingeState {
  globalsettingList: GlobalSetting | null;
}

export const initialGlobalSettingState: GlobalSettingeState = {
  globalsettingList: null
};


export function globalsettingReducer(
  state = initialGlobalSettingState.globalsettingList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_GLOBAL_SETTING:
      return { ...state, globalsettingList: action.payload};
    default:
      return state;
  }
}
