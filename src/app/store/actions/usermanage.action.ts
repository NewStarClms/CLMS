import { Action } from '@ngrx/store';
import { PagedData } from '../model/pageinfo.model';
import { UserGroup, UserGroupType, EmployeeUserGroup, UserGroupMenuType, Menu } from '../model/usermanage.model';

export const SAVE_USER_GROUP = '[SL_UI] SAVE USER GROUP';
export const UPDATE_USER_GROUP = '[SL_UI] UPDATE USER GROUP';
export const SAVE_USER_GROUP_TYPE = '[SL_UI] SAVE USER GROUP TYPE';
export const UPDATE_USER_GROUP_TYPE = '[SL_UI] UPDATE USER GROUP TYPE';
export const SAVE_EMPLOYEEUSER_GROUP = '[SL_UI] SAVE EMPLOYEE USER GROUP';
export const SAVE_MENU_ITEMS="[SL_UI] SAVE MENU ITEMS";
export const SAVE_CURRENT_MENU_ITEMS="[SL_UI] SAVE CURRENT MENU ITEMS";
export const SAVE_EMPLOYEES_OUSTATUS="[SL_UI] SAVE EMPLOYEES OU STATUS";
export const SAVE_USER_MENU_ITEMS="[SL_UI] SAVE USER MENU ITEMS"
//start UserGroup
export class saveUserGroupAction implements Action {
    readonly type = SAVE_USER_GROUP;
    constructor(public payload: UserGroup) { }
}

export class saveEmployeeUserGroupAction implements Action {
  readonly type = SAVE_EMPLOYEEUSER_GROUP;
  constructor(public payload: PagedData) { }
}

export class updateUserGroupAction implements Action {
  readonly type = UPDATE_USER_GROUP;
  constructor(public payload: UserGroup) { }
}
//end UserGroup
//start UserGroup
export class saveUserGroupTypeAction implements Action {
  readonly type = SAVE_USER_GROUP_TYPE;
  constructor(public payload: UserGroupType) { }
}

export class updateUserGroupTypeAction implements Action {
readonly type = UPDATE_USER_GROUP_TYPE;
constructor(public payload: UserGroupType) { }
}
//end UserGroup

export class saveMenuItemsAction implements Action {
  readonly type = SAVE_MENU_ITEMS;
  constructor(public payload: UserGroupMenuType) { }
}

export class saveUserAccessedMenuAction implements Action {
  readonly type = SAVE_USER_MENU_ITEMS;
  constructor(public payload: Menu[]) { }
}

export class saveCurrentMenuItemsAction implements Action {
  readonly type = SAVE_CURRENT_MENU_ITEMS;
  constructor(public payload: Menu) { }
}

//employee OU 
export class saveEmployeesOUStatusAction implements Action {
  readonly type = SAVE_EMPLOYEES_OUSTATUS;
  constructor(public payload: PagedData) { }
}

  export type Actions = saveUserGroupAction | updateUserGroupAction |
                        saveUserGroupTypeAction | updateUserGroupTypeAction | saveEmployeeUserGroupAction 
                        | saveMenuItemsAction | saveCurrentMenuItemsAction | saveEmployeesOUStatusAction
                        | saveUserAccessedMenuAction

