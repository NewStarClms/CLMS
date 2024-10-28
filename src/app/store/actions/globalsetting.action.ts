import { Action } from '@ngrx/store';
import { GlobalSetting } from '../model/globalsetting.model';

export const SAVE_GLOBAL_SETTING = '[SL_UI] SAVE GLOBAL_SETTING';
export const UPDATE_GLOBAL_SETTING = '[SL_UI] UPDATE GLOBAL_SETTING';

//start GLOBAL_SETTING
export class saveGlobalSettingAction implements Action {
    readonly type = SAVE_GLOBAL_SETTING;
    constructor(public payload: GlobalSetting) { }
}

export class updateGlobalSettingAction implements Action {
  readonly type = UPDATE_GLOBAL_SETTING;
  constructor(public payload: GlobalSetting) { }
}
//end GLOBAL_SETTING

  export type Actions = saveGlobalSettingAction | updateGlobalSettingAction

