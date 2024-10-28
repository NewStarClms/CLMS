import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveGateAction } from '../store/actions/master.action';
import { Gate } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class GateService {
  private gridApi;
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
defaultColDef: { suppressSizeToFit: boolean; };
colResizeDefault: string;
public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Gate>,
    private notificationService:NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private userGroupService: UserGroupService
  ) {  this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }

  public fetchGateData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_GATE;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new saveGateAction(response.gateMasters));
        // console.log(response);
      }
      return response;
    });
  }
  saveGate(gateInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_GATE;
    serviceConf.requestHeader = {};
    const payload: Gate = {
      gateID: 0,
      gateName: gateInfo.gateName,
      authorizedUser: gateInfo.authorizedUser,
      emailID:gateInfo.emailID,
      authorizedUserDetails:gateInfo.authorizedUserDetails
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
         this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchGateData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  perpareColumnForGrid() {
   const columnDefs:any[] = [
      {
        headerName: 'Gate Name',
        field: 'gateName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 300,
        
    },
    
  {
    headerName: 'Email ID',
    field: 'emailID',
    filter: true,
    autoHeight: true,
    suppressSizeToFit:true,
    editable: true,
    sortable: true,
    width: 200,
},
{
  headerName: "",
  minWidth: 255,
  cellRenderer: "editableCellRendererComponent",
  editable: false,
  editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.GateMaster,UI_CONSTANT.ACTIONS.UPDATE),
  deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.GateMaster,UI_CONSTANT.ACTIONS.DELETE),
  colId: "action"
}
  ]
  return columnDefs;
}
deleteCellFromRemote(params){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.DELETE;
  serviceConf.path = PATH.FETCH_GATE+'/'+params.data.gateID;
  console.log(serviceConf.path);
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
     if(response.messageType === 0){
       const gateName =  params.data.gateName;
       this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      this.fetchGateData();
    } else{
      this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
    }
    return response;
  });

 }
  updateStateOfCell(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_GATE;
    serviceConf.requestHeader = {};
    const payload: Gate = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
        this.fetchGateData();
         this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
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
