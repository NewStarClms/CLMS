
import { Actions,SAVE_GENERALSETTINGS } from "../actions/generalSettings.action";
import {  VisitorGeneralSetting } from '../../store/model/generalSettings.model';

export interface GeneralSettingsState {
    generalSettingsList: VisitorGeneralSetting | null;
  }
  
export const initialGeneralSettingsState: GeneralSettingsState = {
    generalSettingsList: null
};

export function GeneralsettingsReducer(
  state = initialGeneralSettingsState.generalSettingsList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_GENERALSETTINGS:
      return { ...state, generalSettingsList: action.payload};
    default:
      return state;
  }
}



//generalSettingsList : generalSettingsReducer.selectgeneralSettingsState 