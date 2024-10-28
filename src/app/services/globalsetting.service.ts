import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveAppDataAction } from '../store/actions/appData.action';
import { saveGlobalSettingAction } from '../store/actions/globalsetting.action';
import { AppData } from '../store/model/appData.model';
import { GlobalSetting } from '../store/model/globalsetting.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalsettingService {

  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  globalsettingStateList: BehaviorSubject<Array<GlobalSetting>>= new BehaviorSubject<Array<GlobalSetting>>([]);
  appDataPriorityStateList: BehaviorSubject<Array<AppData>>= new BehaviorSubject<Array<AppData>>([]);
  appDataorgStateList: BehaviorSubject<Array<AppData>>= new BehaviorSubject<Array<AppData>>([]);;
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  setGridApi(data) {
    this._gridApi.next(data);
 }
 setVisibility(val){
  this._visiblePopup.next(val);
  }

  getVisiblity(){
  return this._visiblePopup.asObservable();
  }
 getGridApi() {
   return this._gridApi.asObservable();
 }
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<GlobalSetting>,
    private notificationService:NotificationService,
    private appCoreCommonService:AppCoreCommonService,
    private userGroupService: UserGroupService
  ) {

  }

  public fetchGlobalSettingData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_GLOBAL_SETTING;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
       //console.log('autocode',response.allSeries);
        this.globalsettingStateList.next(response.globalSettings);
        this._store.dispatch(new saveGlobalSettingAction(response.globalSettings));
      }
      return response;
    });

  }

  prepareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: 'Setting Name',
        field: 'settingName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 190,
      },
      {
        headerName: 'Description',
        field: 'description',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 212,
      },
      {
        headerName: 'Control Type',
        field: 'controlType',
        filter: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 300,
      },
      {
        headerName: "",
        minWidth: 315,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.GlobalSetting, UI_CONSTANT.ACTIONS.DELETE),
      editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.GlobalSetting, UI_CONSTANT.ACTIONS.UPDATE),
        colId: "action"
      }
    ]
    return columnDefs;
  }
    updateStateOfCell(globalSettingInfo){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_GLOBAL_SETTING;
      serviceConf.requestHeader = {};
      const payload: GlobalSetting = globalSettingInfo;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchGlobalSettingData();
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);

        }
        return response;
      });
    }
    public fetchAppDataPriorityData(){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_APP_DATA+'/Priority';
      serviceConf.requestHeader = {};

      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response){
          // console.log("type",response.userGroupTypes);
          this.appDataorgStateList.next(response.userGroupTypes);
          this._store.dispatch(new saveAppDataAction(response.userGroupTypes));
        }
        return response;
      });

    }


}
