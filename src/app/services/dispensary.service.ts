import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveDispensaryAction } from '../store/actions/master.action';
import { Dispensary } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})

export class DispensaryService {
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  setGridApi(data) {
    this._gridApi.next(data);
 }

 getGridApi() {
   return this._gridApi.asObservable();
 }
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
defaultColDef: { suppressSizeToFit: boolean; };
colResizeDefault: string;
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Dispensary>,
    private notificationService:NotificationService,
    private appCoreService:AppCoreCommonService,
    private userGroupService: UserGroupService
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

  public fetchDispensaryData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_DISPENSARY;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new saveDispensaryAction(response.dispensaryes));
        // console.log(response);
      }
      return response;
    });

  }
  saveDispensary(dispensaryInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_DISPENSARY;
    serviceConf.requestHeader = {};
    const payload: Dispensary = {
      dispensaryID: 0,
      dispensaryName: dispensaryInfo.dispensaryName,
      phoneNumber: dispensaryInfo.phoneNumber,
      emailId: dispensaryInfo.emailId,
      voipNumber: dispensaryInfo.voipNumber,
      address:dispensaryInfo.address,
      pinCode:dispensaryInfo.pinCode
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchDispensaryData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs:any[]= [
      {
        headerName: 'Dispensary Name',
        field: 'dispensaryName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        sortable: true,
        editable: true,
        width: 190,

    },
    {
      headerName: 'Phone Number',
      field: 'phoneNumber',
      filter: true,
      autoHeight: true,
      suppressSizeToFit:true,
      sortable: true,
      editable: true,
      width: 210,

  },
  {
  headerName: 'Email ID',
  field: 'emailId',
  filter: true,
  suppressSizeToFit:true,
  sortable: true,
  editable: true,
  width:225,

},
{
  headerName: 'Voip Number',
  field: 'voipNumber',
  filter: true,
  suppressSizeToFit:true,
  sortable: true,
  editable: true,
  width:225,

},
{
  headerName: 'Address',
  field: 'address',
  filter: true,
  suppressSizeToFit:true,
  sortable: true,
  editable: true,
  width:225,

},
  {

      headerName: "",
      minWidth: 0,
      cellRenderer: "editableCellRendererComponent",
      editable: false,
      deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Dispensary, UI_CONSTANT.ACTIONS.DELETE),
      editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Dispensary, UI_CONSTANT.ACTIONS.UPDATE),
      colId: "action"
    }
      ]
      return columnDefs;
    }
    deleteCellFromRemote(params){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.DELETE;
      serviceConf.path = PATH.FETCH_DISPENSARY+'/dispensaryId?dispensaryId='+params.data.dispensaryID;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.fetchDispensaryData();
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        }
        else {
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });8

     }
      updateStateOfCell(params){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.PUT;
        serviceConf.path = PATH.FETCH_DISPENSARY;
        serviceConf.requestHeader = {};
        const payload: Dispensary = {
          dispensaryID: params.dispensaryID,
      dispensaryName: params.dispensaryName,
      phoneNumber: params.phoneNumber,
      emailId: params.emailId,
      voipNumber: params.voipNumber,
      address:params.address,
      pinCode:params.pinCode
        };
        serviceConf.payloadObjects = payload;
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
          if (response.messageType === 0) {
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
            this.fetchDispensaryData();
            this.setVisibility(false);
          }else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            this.setVisibility(true);
          }
          return response;
        });
      }
      getCSVReport(data, fileName){
        this.appCoreService.exportExcel(data, fileName);
      }
}
