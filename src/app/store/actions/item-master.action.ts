import { Action } from '@ngrx/store';
import { ItemMaster } from '../model/canteen.model';

export const SAVE_ItemMaster = '[SL_UI] SAVE ItemMaster';
export const UPDATE_ItemMaster = '[SL_UI] UPDATE ItemMaster';


export class saveItemMasterAction implements Action {
    readonly type = SAVE_ItemMaster;
    constructor(public payload: ItemMaster) { }
}

export class updateItemMasterAction implements Action {
    readonly type = UPDATE_ItemMaster;
    constructor(public payload: ItemMaster) { }
}
export type Actions = saveItemMasterAction | updateItemMasterAction
