import { Actions, SAVE_ITEM_TYPE } from '../actions/master.action';
import {  ItemTypes } from '../model/master-data.model';

export interface ItemTypesState {
  itemTypesList: ItemTypes | null;
  }
export const initialItemTypesState: ItemTypesState = {
  itemTypesList: null
};

export function ItemTypesReducer(
  state = initialItemTypesState.itemTypesList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_ITEM_TYPE:
      return { ...state, itemTypesList: action.payload};
    default:
      return state;
  }
}
