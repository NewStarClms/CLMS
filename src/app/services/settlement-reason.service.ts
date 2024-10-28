import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveSettlementReasonAction } from '../store/actions/settlement-reason.action';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { SettlementReason } from '../store/model/settlement-reason.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';


@Injectable({
  providedIn: 'root'
})
export class SettlementReasonService {
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private notificationService:NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private userGroupService: UserGroupService,
    private appCoreService:AppCoreCommonService,
    private router: Router
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

    public fetchSettlementReasonData() {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_SETTLEMENT_REASON;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response){
          this._store.dispatch(new saveSettlementReasonAction(response));
        }
        return response;
      });
    }

    saveSettlementReason(settlementReasonInfo) {
      console.log(settlementReasonInfo);
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.SAVE_SETTLEMENT_REASON;
      serviceConf.requestHeader = {};
      const payload: SettlementReason = {
        settlementReasonID: 0,
        settlementReasonName: settlementReasonInfo.settlementReasonName,
        description: settlementReasonInfo.description
      };
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        console.log(response);
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
          this.fetchSettlementReasonData();
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

    prepareColumnForGrid() {

      const columnDefs: any[] = [
        {
          headerName: 'Settlement Reason',
          field: 'settlementReasonName',
          filter: true,
          suppressSizeToFit: true,
          editable: false,
          sortable: true,
  
        },
        {
          headerName: 'Description',
          field: 'description',
          filter: true,
          editable: false,
          sortable: true,
          suppressSizeToFit: true,
        },
        {
          headerName: "Action",
          cellRenderer: "editableCellRendererComponent",
          editable: false,
          colId: "action",
          editAllow: true,
          deleteAllow: true,
        }]

      return columnDefs;
    }

    UpdateSettlementReason(payload:SettlementReason){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.UPDATE_SETTLEMENT_REASON;
      serviceConf.requestHeader = {};
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
       this.fetchSettlementReasonData();
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
  
    }

    deleteCellFromRemote(params) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.DELETE;
      serviceConf.path = PATH.DELETE_SETTLEMENT_REASON + '/' + params.data.bonusSettingId+'?settlementReasonID='+params.data.settlementReasonID;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
             this.fetchSettlementReasonData();
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
  
    }
}
