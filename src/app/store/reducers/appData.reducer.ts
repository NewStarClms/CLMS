import { Actions,SAVE_APP_DATA} from '../actions/appData.action';
import {  AppData } from '../model/appData.model';

export interface AppDataState {
  appDataList: AppData | null;
  }
export const initialAppDataState: AppDataState = {
  appDataList: null
};

export function appDataReducer(
  state = initialAppDataState.appDataList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_APP_DATA:
      return { ...state, appDataList: action.payload};
    default:
      return state;
  }
}
