import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveFinancialyYearAction } from '../store/actions/financialy-year.action';
import { FinancialyYear } from '../store/model/financialy-year.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class FinancialyYearService {
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

    public fetchFinancialyYearData() {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_FINANCIALY_YEAR;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response){
          this._store.dispatch(new saveFinancialyYearAction(response));
        }
        return response;
      });
    }
    
    saveFinancialyYear(FinancialyYearInfo){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.SAVE_FINANCIALY_YEAR;
      serviceConf.requestHeader = {};
      const payload: FinancialyYear = {
        financialYearID: 0,
        startDate: FinancialyYearInfo.startDate,
        endDate: FinancialyYearInfo.endDate,
        currentFinancialYear:FinancialyYearInfo.currentFinancialYear
      };
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)         
          this.fetchFinancialyYearData();
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
          headerName: 'Start Date',
          field: 'startDate',
          filter: true,
          suppressSizeToFit: true,
          editable: false,
          sortable: true,
          cellEditorParams: UI_CONSTANT.MASTER.HOLIDAYDATE
  
        },
        {
          headerName: 'End Date',
          field: 'endDate',
          filter: true,
          editable: false,
          sortable: true,
          suppressSizeToFit: true,
          cellEditorParams: UI_CONSTANT.MASTER.HOLIDAYDATE
        },
        {
          headerName: 'Financial Year',
          field: 'currentFinancialYear',
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
          deleteAllow: true,
          editAllow: true,
        }]

      return columnDefs;
    }

    UpdateFinancialyYear(payload:FinancialyYear){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.UPDATE_FINANCIALY_YEAR;
      serviceConf.requestHeader = {};
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchFinancialyYearData();
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
  
    }

    deleteCellFromRemote(params) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.DELETE;
      serviceConf.path = PATH.DELETE_FINANCIALY_YEAR + '/' + params.data.financialYearID;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
             this.fetchFinancialyYearData();
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
  
    }


}
