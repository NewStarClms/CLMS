import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveVisitorPurposeAction } from '../store/actions/master.action';
import { VisitPurpose } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class VisitorPurposeService {
  private gridApi;
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
defaultColDef: { suppressSizeToFit: boolean; };
colResizeDefault: string;
public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
public _visitPurposeDetail: BehaviorSubject<VisitPurpose> = new BehaviorSubject<VisitPurpose>(null);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<VisitPurpose>,
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

  public fetchVisitorPurposeData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_VISIT_PURPOSE;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new saveVisitorPurposeAction(response.visitPurposes));
        // console.log(response);
      }
      return response;
    });
  }
  saveVisitorPurpose(visitpurposeInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_VISIT_PURPOSE;
    serviceConf.requestHeader = {};
    const payload: VisitPurpose = {
      "visitPurposeID": 0,
      "visitPurposeName": visitpurposeInfo.visitPurposeName
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
         this.notificationService.showSuccess(response.message, 'Success')
        this.fetchVisitorPurposeData();
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
        headerName: 'Visit Purpose Name',
        field: 'visitPurposeName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 720,
        onCellValueChanged: function ($event) {
          console.log('event',$event);
        },
        valueSetter: params => {
          console.log('dds',params);
          params.data.visitPurposeName = params.newValue;
          return true;
      }
      },
      {
        headerName: "",
        minWidth: 315,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.VisitPurpose,UI_CONSTANT.ACTIONS.UPDATE),
      deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.VisitPurpose,UI_CONSTANT.ACTIONS.DELETE),
        colId: "action"
      }
        ]
        return columnDefs;
  }
  deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_VISIT_PURPOSE+'/'+params.data.visitPurposeID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response.messageType === 0){
        this.fetchVisitorPurposeData();
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
      }
      return response;
    });

  }
  updateStateOfCell(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_VISIT_PURPOSE;
    serviceConf.requestHeader = {};
    const payload: VisitPurpose = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response.messageType === 0){
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchVisitorPurposeData();
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
  public fetchVisitPurposeDetail(Id): Observable<any> {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_VISIT_PURPOSE + '/'+Id;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      console.log(response.visitPurpose)
      if (response && response.visitPurpose) {
        //console.log(response)
        this._visitPurposeDetail.next(response.visitPurpose)
        return response.visitPurpose;
        
      }
    });
    return this._visitPurposeDetail.asObservable();

  }
}
