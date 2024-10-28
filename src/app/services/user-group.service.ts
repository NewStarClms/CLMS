import { LowerCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppUtil } from '../common/app-util';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveCurrentMenuItemsAction, saveMenuItemsAction, saveUserAccessedMenuAction, saveUserGroupAction, saveUserGroupTypeAction } from '../store/actions/usermanage.action';
import { User } from '../store/model/login.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { Menu, UserGroup, UserGroupMenu, UserGroupMenuType, UserGroupType, MenuRights, UserDashboardSetting, DashboardSetting } from '../store/model/usermanage.model';
import { AppCoreCommonService } from './app.core-common.services';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  public ClientCode=localStorage.getItem('CLIENTCODE');
  userGroupStateList: BehaviorSubject<Array<UserGroup>> = new BehaviorSubject<Array<UserGroup>>([]);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleDashboardSettingPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  userGroupTypeStateList: BehaviorSubject<Array<UserGroupType>> = new BehaviorSubject<Array<UserGroupType>>([]);
  menuItemsStateList: BehaviorSubject<Array<UserGroupMenuType>> = new BehaviorSubject<Array<UserGroupMenuType>>([]);
  currentMenuItems: BehaviorSubject<Array<UserGroupMenuType>> = new BehaviorSubject<Array<UserGroupMenuType>>([]);
  menuAccess: Array<Menu> = [];
  userMenuAccess: Array<Menu> = [];
  isAllowed = false;
  private _dashboardSettingDetail: BehaviorSubject<DashboardSetting> = new BehaviorSubject<DashboardSetting>(null);
  
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<UserGroup>,
    private notificationService: NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private router: Router
  ) {
    this._isEditable.next(false);
    this._isEditable.asObservable();
    this.appCoreCommonService.fetchMenuAccessList();
  }
  setVisibility(val) {
    this._visiblePopup.next(val);
  }

  getVisiblity() {
    return this._visiblePopup.asObservable();
  }
  setDashboardSettingVisibility(val) {
    this._visibleDashboardSettingPopup.next(val);
  }

  getDashboardSettingVisiblity() {
    return this._visibleDashboardSettingPopup.asObservable();
  }
  public fetchUserGroupData() {
   
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_USER_GROUP;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        // console.log(response.userGroupes);
        this.userGroupStateList.next(response.userGroupes);
        this._store.dispatch(new saveUserGroupAction(response.userGroupes));
      }
      return response;
    });

  }
  fetchMenuAccessRight(userGroupID: number): Observable<any> {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_USER_MAPPING_MENU + userGroupID;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf);
  }
  saveUserGroup(userGroupInfo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_USER_GROUP;
    serviceConf.requestHeader = {};
    const payload: UserGroup = {
      userGroupID: 0,
      userGroupTypeID: userGroupInfo.userGroupTypeID,
      userGroupName: userGroupInfo.userGroupName,
      systemDefault: userGroupInfo.systemDefault,
      defaultESSGroup: userGroupInfo.defaultESSGroup,
      menues: [
        {
          menuID: userGroupInfo.menuID,
          menuName: userGroupInfo.menuName,
          parentKey: userGroupInfo.parentKey,
          menuDescription: userGroupInfo.menuDescription,
          menuTypeID: userGroupInfo.menuTypeID,
          sequenceNo: userGroupInfo.sequenceNo,
          hasAction: userGroupInfo.hasAction,
          selected: userGroupInfo.selected,
          menuRights: [
            {
              menuRightID: userGroupInfo.menuRightID,
              menuID: userGroupInfo.menuID,
              menuRightTypeID: userGroupInfo.menuRightTypeID,
              displayName: userGroupInfo.displayName,
              selected: userGroupInfo.selected
            }
          ]
        }
      ]
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.fetchDummyData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchUserGroupData();
        
        this.setVisibility(false);
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: 'User Group Type',
        field: 'userGroupTypeID',
        filter: true,
        cellEditorParams: UI_CONSTANT.MASTER.USERGROUPTYPE,
        editable: true,
        sortable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'User Group Name',
        field: 'userGroupName',
        filter: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,

      },
      {
        headerName: 'System Default',
        field: 'systemDefault',
        filter: true,
        editable: true,
        sortable: true,
        suppressSizeToFit: true,
        icons: true,
      }, {
        headerName: 'Default ESS Group',
        field: 'defaultESSGroup',
        filter: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        icons: true,
      },
      {
        headerName: "",
        colId: "action",
        actionModeOn: true,
        mapAccessRight: true,
        hideData: true,
        usergroupAccess: true,
        deleteAllow: false,
        editAllow: false,
        suppressSizeToFit: true,
        dashboardSetting:true
      }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params) {
    console.log(params)
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_USER_GROUP + '/' + params.data.userGroupID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.fetchDummyData();
        this.fetchUserGroupData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }
      else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });
  }
  updateStateOfMappingAccess(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.UPDATE_MAPPING_ACCESS;
    serviceConf.requestHeader = {};
    const payload: UserGroup = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        //New Changes
       //this.fetchDummyData();
      //End
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchUserGroupData();
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.router.navigate(['/usermanage/mapaccessright/' + params.userGroupID]);
      }
      return response;
    });
  }
  updateStateOfCell(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_USER_GROUP;
    serviceConf.requestHeader = {};
    const payload: UserGroup = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
      //  this.fetchDummyData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchUserGroupData();
        this.setVisibility(false);
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
  getCSVReport(data, fileName) {
    this.appCoreCommonService.exportExcel(data, fileName);
  }
  public fetchUserGroupTypeData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_USER_GROUP_TYPE;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        // console.log("type",response.userGroupTypes);
        this.userGroupTypeStateList.next(response.userGroupTypes);
        this._store.dispatch(new saveUserGroupTypeAction(response.userGroupTypes));
      }
      return response;
    });

  }

  public fetchMenuItems() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_MENU_ITEMS;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        const menuArr = AppUtil.deepCopy(response.userGroup);
        this.prepareMenuItems(menuArr);
        this.menuItemsStateList.next(response.userGroup);
        localStorage.setItem('userMenuAccess', JSON.stringify(this.userMenuAccess));
        this._store.dispatch(new saveMenuItemsAction(response.userGroup));
        
      }
      return response;
    });
  }

  public updateCurrentMenu(menuItems: any) {
    this.currentMenuItems.next(menuItems);
    this._store.dispatch(new saveCurrentMenuItemsAction(menuItems));
  }

  public isMenuAccessable(menuName: string, action: string): boolean {
    this.menuAccess = JSON.parse(localStorage.getItem("userMenuAccess"));
    const menuRights = this.menuAccess?.filter(i=>i.menuName.trim().toLowerCase() === menuName.trim().toLowerCase())[0].menuRights;
    const selectedArr = menuRights?.filter(i => i.displayName.toLowerCase()=== action.toLowerCase());
    this.isAllowed = (selectedArr.length === 0)?false:selectedArr[0]?.selected;
    return this.isAllowed;

  }
  getMenuRights(menuName: string, action: string) {
    if (this.menuAccess?.length > 0) {
      const menuRights = this.menuAccess.filter(menu => menu.menuName.trim().toLowerCase() === menuName.trim().toLowerCase())[0].menuRights;
      const selectedArr = menuRights?.filter(i => i.displayName.toLowerCase()=== action.toLowerCase());
      this.isAllowed = (selectedArr.length === 0)?false:selectedArr[0]?.selected;
      return this.isAllowed;
    }
    return this.isAllowed;
  }

  prepareMenuItems(menuItems: Array<UserGroupMenuType>) {
    this.userMenuAccess = [];
    if (menuItems) {
      menuItems.forEach(item => {
        if (item.menuItems) {
          this.getChildMenu(item.menuItems);
        }
      })
    }
    //console.log('userMenuAccess', this.userMenuAccess);
    localStorage.setItem('userMenuAccess', JSON.stringify(this.userMenuAccess));
    this._store.dispatch(new saveUserAccessedMenuAction(this.userMenuAccess));
  }

  getChildMenu(menuFiltered: Array<Menu>) {
    if (menuFiltered) {
      for (const child of menuFiltered) {
        if (child?.menuRights?.length > 0 && child?.childs?.length === 0) {
          this.userMenuAccess.push(child);
        } else {
          this.getChildMenu(child.childs)
        }
      };
    }
  }
  fetchuserDashboardSetting(userGroupID: number): Observable<any> {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_USER_DASHBOARD_SETTING+'/' + userGroupID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.userGroup.dashBoardSettings) {
        console.log(response.userGroup.dashBoardSettings);
        this._dashboardSettingDetail.next(response.userGroup.dashBoardSettings)
        return response.userGroup.dashBoardSettings;
        
      }
    });
    return this._dashboardSettingDetail.asObservable();
  }
  saveUserDashboardSetting(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_USER_DASHBOARD_SETTING;
    serviceConf.requestHeader = {};
    const payload: UserGroup = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchUserGroupData();
        this.setDashboardSettingVisibility(false);
         //New Changes
       //this.fetchDummyData();
      //End
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setDashboardSettingVisibility(true);
      }
      return response;
    });
  }

  fetchDummyData() {
    
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_DUMMY_DATA+"?clientCode="+this.ClientCode;
    serviceConf.requestHeader = {};
    
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        
      }
      return response;
    });

  }
}
