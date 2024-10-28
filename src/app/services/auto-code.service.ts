import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveAutoCodeAction, saveAutoCodeOrgAction } from '../store/actions/core.action';
import { AutoCode } from '../store/model/autocode.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class AutoCodeService {
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  autoCodeStateList: BehaviorSubject<Array<AutoCode>>= new BehaviorSubject<Array<AutoCode>>([]);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  setGridApi(data) {
    this._gridApi.next(data);
 }

 getGridApi() {
   return this._gridApi.asObservable();
 }
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<AutoCode>,
    private notificationService:NotificationService,
    private userGroupService: UserGroupService,
    private appCoreCommonService:AppCoreCommonService
  ) {
    this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }

  public fetchAutoCodeData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_AUTO_CODE;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
       //console.log('autocode',response.allSeries);
        this.autoCodeStateList.next(response.allSeries);
        this._store.dispatch(new saveAutoCodeAction(response.allSeries));
      }
      return response;
    });

  }
  public fetchAutoCodeOrgData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_AUTO_CODE_ORG;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new saveAutoCodeOrgAction(response.organizations));
      }
      return response;
    });

  }

  public fetchCodeSeriesMapData(orgID, autocodeID){
    if(autocodeID){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_CODE_SERIES_MAP_DATA.replace('{1}/{0}',autocodeID+'/'+orgID);
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf);
    }
    return null;
  }
  prepareColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: 'Module',
        field: 'moduleName',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 180,

    },
    {
      headerName: 'Auto Code Series',
      field: 'autoCodeSeriesTypeName',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
      width: 130,

  },
  {
  headerName: 'Applicable On',
  field: 'applicableOn',
  filter: true,
  suppressSizeToFit:true,
  sortable: true,
  width:150,

  },
  {
    headerName: 'Completed',
    field: 'completed',
    filter: true,
    icons:true,
    },

  {
    headerName: "",
    width: 100,
    cellRenderer: "editableCellRendererComponent",
    editable: false,
    colId: "action",
   deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.AutoCodeSeries, UI_CONSTANT.ACTIONS.DELETE),
   editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.AutoCodeSeries, UI_CONSTANT.ACTIONS.UPDATE),
   deleteon:true,
  }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_AUTO_CODE+'/'+params.data.autoCodeSeriesTypeID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.fetchAutoCodeData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }
      else {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

   }
    updateStateOfCell(tempAutocodeList){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_AUTO_CODE;
      serviceConf.requestHeader = {};
      const payload: AutoCode = tempAutocodeList;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess('Updated Successfully', UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchAutoCodeData();
          this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
    }
    getCSVReport(data, fileName){
      this.appCoreCommonService.exportExcel(data, fileName);
    }
}
