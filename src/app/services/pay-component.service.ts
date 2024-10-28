import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { HttpMethod } from '../common/constants/http-method.constants';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { PATH } from '../common/constants/service-path.constants';
import { savePayComponentsAction, SavePayHeadsAction } from '../store/actions/pay-component.action';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { PayComponentModel, PayHeadsModel } from '../store/model/pay-component.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PayComponentService {
public _payHeadDetail: BehaviorSubject<Array<PayHeadsModel>> = new BehaviorSubject([]);
  constructor( private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private notificationService:NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private router: Router){
      
    }
    prepareColumnDef() {
      const columnDefs:any[] = [
      {
          headerName: 'Pay Code',
          field: 'payCode',
          filter: true,
          editable: false,
          sortable: true,
          suppressSizeToFit:true,
      },
      {
          headerName: 'Name',
          field: 'payComponentName',
          filter: true,
          suppressSizeToFit:true,
          editable: false,
          sortable: true,
  
      },
      {
          headerName: 'Type',
          field: 'payComponentType',
          filter: true,
          editable: false,
          sortable: true,
          suppressSizeToFit:true,
      },
      {
          headerName: 'Pay Type',
          field: 'payHeadName',
          filter: true,
          suppressSizeToFit:true,
          editable: false,
          sortable: true,
      },
    //   {
    //     headerName: 'Pay Nature',
    //     field: 'variableComponent',
    //     filter: true,
    //     suppressSizeToFit:true,
    //     editable: false,
    //     sortable: true,
    //     cellEditorParams:'variableComponent'
    // },
      {
          headerName: "Action",
          width: 80,
          cellRenderer: "editableCellRendererComponent",
          editable: false,
          colId: "action",
          editAllow: true,
          deleteAllow: true
      }]
      return columnDefs;
  }

  //New Changes
  public fetchLeaveData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_LEAVE_DATA;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.leaves) {
        console.log('response',response)
       
      }
      return response;
    });

  }

  //End
  getCSVReport(data, fileName){
    this.appCoreCommonService.exportExcel(data, fileName);
  }
  
  getPayheadsfromRemote() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_PAY_HEADS;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new SavePayHeadsAction(response));
      }
      return response;
    });
  }
  getPayheadsList() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_PAY_HEADS;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new SavePayHeadsAction(response));
      }
      return response;
    });
  }
    
  getPayComponentsfromRemote() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_PAY_COMPONENTS;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new savePayComponentsAction(response));
      }
      return response;
    });
  }

  getPayComponentsbyPayCode(code) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_PAY_COMPONENTS+'/?payCode='+code;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  savePayComponents(payload:PayComponentModel){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_PAY_COMPONENTS;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.router.navigate(['/payroll/pay']);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.router.navigate(['/payroll/add-edit-pay/'+payload.payCode]);
      }
      return response;
    });

  }
  UpdatePayComponents(payload:PayComponentModel){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.UPDATE_PAY_COMPONENTS;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.router.navigate(['/payroll/pay']);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.router.navigate(['/payroll/add-edit-pay/'+payload.payCode]);
      }
      return response;
    });

  }
  
  deleteCellFromRemote(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.DELETE_PAY_COMPONENTS + '/' + params.data.payCode;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
           this.getPayComponentsfromRemote()
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
  getPayheadsDetail(payheadId):Observable<any> {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_PAY_HEADS+"?payHeadId="+payheadId;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        console.log(response)
        this._payHeadDetail.next(response);
        return response;
      }
    });
    return this._payHeadDetail.asObservable();
  }

}