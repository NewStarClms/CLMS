import { Actions, SAVE_CURRENT_MENU_ITEMS, SAVE_MENU_ITEMS, SAVE_USER_MENU_ITEMS } from '../actions/usermanage.action';
import {  Menu, UserGroupMenuType } from '../model/usermanage.model';

export interface UserGroupMenuTypeState {
  menuItemsList: UserGroupMenuType | null;
  }
export const initialMenuItemsState: UserGroupMenuTypeState = {
  menuItemsList: null
};

export interface CurrentUserMenuState {
  currentMenuItemsList: UserGroupMenuType | null;
  }
export const initialCurrentMenuItemsState: CurrentUserMenuState = {
  currentMenuItemsList: null
};

export interface UserAccessMenuState {
  UserAccessMenuList: Menu | null;
  }
export const initialUserAccessMenuItemsState: UserAccessMenuState = {
  UserAccessMenuList: null
};

export function menuItemReducer(
  state = initialMenuItemsState.menuItemsList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_MENU_ITEMS:
    
      return { ...state, menuItemsList: action.payload};
    default:
      return state;
      
  }
  
}


export function currentMenuItemReducer(
  state = initialCurrentMenuItemsState.currentMenuItemsList,
  action: Actions
) {

  switch (action.type) {
    case SAVE_CURRENT_MENU_ITEMS:
    
      return { ...state, currentMenuItemsList: action.payload};
      
    default:
      return state;
  }
  
}

export function userAccessMenuItemReducer(
  state = initialUserAccessMenuItemsState.UserAccessMenuList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_USER_MENU_ITEMS:
      return { ...state, userAccessMenuList: action.payload};
      
    default:
      return state;
  }
  
}
