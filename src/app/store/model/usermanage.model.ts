export interface UserGroup
{
      userGroupID: number,
      userGroupTypeID: number,
      userGroupName?: string | null,
      systemDefault?: boolean,
      defaultESSGroup?: boolean,
      menues?: [
        {
          menuID: number,
          menuName: string | null,
          parentKey: number,
          menuDescription: string | null,
          menuTypeID: number,
          sequenceNo: number,
          hasAction: boolean,
          selected: boolean,
          menuRights: [
            {
              menuRightID: number,
              menuID: number,
              menuRightTypeID: number,
              displayName: string | null,
              selected: boolean
            }
          ]
        }
      ]
}

export interface UserGroupType{
  key: string| null,
    value: number
}

export interface UserGroupMenuType{
    menuTypeID: number,
    menuTypeName: string,
    menues:Array<Menu>,//needs to check & will make it one 
    menuItems:Array<Menu>
}

export interface Menu{
  menuID: number, //review this
    menuId: number,
    menuName: string | null,
    parentKey: number,
    menuDescription: string | null,
    menuTypeID: number,
    sequenceNo: number,
    hasAction: boolean,
    selected: boolean,
    menuRights: MenuRights[],
    routerLink: string | null,
    hasChild: boolean,
    childs: Menu[] 
}
export interface MenuRights{
    menuRightID: number,
    menuID: number,
    menuRightTypeID: number,
    displayName: string | null,
    selected: boolean
}

export interface UserGroupMenu
{
      userGroupID: number,
      userGroupTypeID: number,
      menuTypes:Array<UserGroupMenuType>
}

export interface EmployeeUserGroup{
   employeeID: number,
   employeeCode: string,
   employeeName: string,
   company: string,
   department: string,
   designation: string,
   branch: string,
   displayName: string,
   mappedGroup: string,
   ouMappingSttaus: boolean
}

export interface UpsertEmployeeUserGroup{
  employeeList: string,
  userGroupList: string,
  actionType: string
}
export interface EmployeeOUMapping{
  employeeID : number,
  userOUMappings : Array<UserOUMapping>
}

export interface UserOUMapping{
   organizationID: number,
   organizationName: string,
   organizationType: string,
   mappedValues : Array<OUMapping>
}

export interface OUMapping{
  organizationName: string,
  organizationValue: number,
  selected : boolean
}
export interface UserDashboardSetting{
      userGroupID: number,
      dashBoardSettings: Array<DashboardSetting>,
      dashBoardSettingList: string | null,
      flag: string | null
    
}
export interface DashboardSetting{
  dashBoardSettingID: number,
          settingName: string | null,
          sequence: number,
          active: boolean
}


export interface  AccessTreeNode<T = any>  {
  selected: boolean;
  children?: AccessTreeNode<T>[];
  parent?: AccessTreeNode<T>;
  label?: string;
  data?: T;
  icon?: string;
  expandedIcon?: any;
  collapsedIcon?: any;
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
};
