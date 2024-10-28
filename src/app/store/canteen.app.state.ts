import { createFeatureSelector } from "@ngrx/store";
import * as ItemMasterReducer from './reducers/item-master.reducer';
import * as CanteenPolicy from './reducers/canteen-policy.reducer';
 
export interface CanteenAppState {
    ItemMasterList: ItemMasterReducer.ItemMasterState,
    CanteenPolicyDetailList: CanteenPolicy.CanteenPolicyDetailState,
}

export const CanteenAppReducers = {
    items: ItemMasterReducer.ItemMasterReducer,
    CanteenPolicyDetails: CanteenPolicy.CanteenPolicyDetailReducer,
}
export const selectItemMasterState = createFeatureSelector<any>('items');
export const selectCanteenPolicyDetailState = createFeatureSelector<any>('CanteenPolicyDetails');