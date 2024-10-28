import { Action } from '@ngrx/store';
import { VisitorGeneralSetting } from '../../store/model/generalSettings.model';


export const SAVE_GENERALSETTINGS ='[SL_UI] SAVE_GENERALSETTINGS';
export const UPDATE_GENERALSETTINGS='[SL_UI] UPDATE_GENERALSETTINGS';

export class saveGeneralSettingsAction implements Action{
    readonly type = SAVE_GENERALSETTINGS;
    constructor(public payload:VisitorGeneralSetting){}
}

export class updateGeneralSettingsAction implements Action {
    readonly type= UPDATE_GENERALSETTINGS;
    constructor(public payload:VisitorGeneralSetting){}
}

export type Actions = saveGeneralSettingsAction | updateGeneralSettingsAction;