import {Actions, SAVE_ItemMaster } from '../actions/item-master.action';
import { ItemMaster } from '../model/canteen.model';

export interface ItemMasterState {
    ItemMasterList: ItemMaster | null;
  }
  
  export const initialItemMasterState: ItemMasterState = {
    ItemMasterList: null
  };
  
  export function ItemMasterReducer(
    state = initialItemMasterState.ItemMasterList,
    action: Actions
  ) {
    switch (action.type) {
      case SAVE_ItemMaster:
      return { ...state, ItemMasterList: action.payload};
      default:
      return state;
    }
  }