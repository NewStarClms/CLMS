import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map } from 'rxjs/operators';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveEmployeeDashboardSettingAction } from '../store/actions/globalemployeefirlder.action';
import { EmployeeDashboardSetting, MachineJobProgress } from '../store/model/employee-dashboard-setting.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';

@Injectable({
    providedIn: 'root'
  })
 
  export class EmployeeDashboardSettingService {
    public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public _machineJobVisiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    employeeDashboardSettingStateList: BehaviorSubject<Array<EmployeeDashboardSetting>> = new BehaviorSubject<Array<EmployeeDashboardSetting>>([]);
    constructor(
        private remoteService: RemoteService<any>,
        private _store: Store<EmployeeDashboardSetting>,
        private notificationService: NotificationService
      ) {}

    setVisibility(val){
      this._visiblePopup.next(val);
    }
      
    getVisiblity(){
       return this._visiblePopup.asObservable();
    }
    setMachineJobPopupVisiblity(val){
      this._machineJobVisiblePopup.next(val);
    }
      
    getMachineJobPopupVisiblity(){
       return this._machineJobVisiblePopup.asObservable();
    }

    
    saveEmployeeDashboardSetting(employeeDashboardSettings){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.PUT;
        serviceConf.path = PATH.UPDATE_EMPLOYEE_DASHBOARD_SETTING;
        serviceConf.requestHeader = {};
        serviceConf.payloadObjects ={dashboardSettings: employeeDashboardSettings};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
          if (response.messageType === 0) {
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS); 
            this.getEmployeeDashboardSetting();           
            this.setVisibility(false);
          } else {
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            this.getEmployeeDashboardSetting();
            this.setVisibility(true);
          }
          return response;
        });
    }

    getEmployeeDashboardSetting(){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_EMPLOYEE_DASHBOARD_SETTING;
        serviceConf.requestHeader = {};
    
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
          if (response) {
            this.employeeDashboardSettingStateList.next(response.employeeDashboardSettings);
            this._store.dispatch(new saveEmployeeDashboardSettingAction(response.employeeDashboardSettings));
          }
          return response;
        });
    }

    getMachineJobInProgress(processRequestID='',flag=''){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.GET_MACHINEJOB_PROCESS_STATUS+"?flag="+flag;
      serviceConf.requestHeader = {};
      if(processRequestID){
        serviceConf.path =serviceConf.path+"&processRequestID="+processRequestID;
      }
       else{
        serviceConf.path =serviceConf.path;
       }
      return this.remoteService.httpServiceRequest(serviceConf)?.pipe(map(response => {
        return response;
      }));
    }

    getMachineJobInProgressColumns() {
      const columnDefs:any[] = [
      {
          headerName: 'Employee Code',
          field: 'employeeCode',
          filter: true,
          editable: false,
          sortable: true,
          suppressSizeToFit:true,
      },
      {
          headerName: 'Employee Name',
          field: 'employeeName',
          filter: true,
          suppressSizeToFit:true,
          editable: false,
          sortable: true,
  
      },
      {
          headerName: 'Company',
          field: 'company',
          filter: true,
          editable: false,
          sortable: true,
          suppressSizeToFit:true,
      },
      {
          headerName: 'Department',
          field: 'department',
          filter: true,
          suppressSizeToFit:true,
          editable: false,
          sortable: true,
      },
     {
          headerName: 'Branch',
          field: 'branch',
          filter: true,
          suppressSizeToFit:true,
          editable: false,
          sortable: true,
      },
      {
          headerName: 'Request Time',
          field: 'requestTime',
          filter: true,
          suppressSizeToFit:true,
          editable: false,
          sortable: true,
      },
      {
          headerName: 'Response Message',
          field: 'responseMessage',
          filter: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
      }]
      return columnDefs;
    }
  }
