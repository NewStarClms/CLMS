import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { saveShiftData, saveShiftMappingData } from '../store/actions/master.action';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { ShiftModel } from '../store/model/master-data.model';
import { Observable } from 'rxjs';
import { AttendancePolicyMasterService } from './attendance-policy-master.service';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleMapPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private notificationService:NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private AttendancePolicyService:AttendancePolicyMasterService,
    private userGroupService: UserGroupService
  ) {
    this._isEditable.next(false);
    this._isEditable.asObservable();
   }

   setMappingVisiblity(val){
    this._visibleMapPopup.next(val);
    }

    getMappingVisiblity(){
    return this._visibleMapPopup.asObservable();
    }
    
   setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }

    public fetchShiftData() {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_SHIFT_DATA;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response && response.shifts) {
          this._store.dispatch(new saveShiftData(response.shifts));
        }
        return response;
      });
  
    }

    public prepareColumnForGrid(){

      const columnDefs: any[] = [
        {
          headerName: 'Code',
          field: 'shiftCode',
          filter: true,
          autoHeight: true,
          suppressSizeToFit: true,
          sortable: true,
          width: 160,
        },
        {
          headerName: ' Name',
          field: 'shiftName',
          filter: true,
          autoHeight: true,
          suppressSizeToFit: true,
          sortable: true,
          width: 200,
  
        },
       
        {
          headerName: 'Start Time',
          field: 'shiftStartTime',
          filter: true,
          sortable: true,
          width: 210,
        },
        {
          headerName: 'End Time',
          field: 'shiftEndTime',
          filter: true,
          sortable: true,
          width: 210,
  
        },
  
        {
          headerName: 'Shift Type',
          field: 'shiftType',
          filter: true,
          sortable: true,
          cellEditorParams: UI_CONSTANT.MASTER.SHIFTTYPE,
          width: 150,
  
        },
        {
          headerName: 'Duration',
          field: 'shiftDuration',
          filter: true,
          sortable: true,
          width: 150,
  
        },
  
        {
          headerName: "",
          minWidth: 0,
          editable: false,
          deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Shift_Master, UI_CONSTANT.ACTIONS.DELETE),
      editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Shift_Master, UI_CONSTANT.ACTIONS.UPDATE),
          colId: "action"
        }
      ]
      return columnDefs;

    }

    updateStateOfCell(params) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_SHIFT_DATA;
      serviceConf.requestHeader = {};
      const payload: ShiftModel = params;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
          this.fetchShiftData();
          this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
    }
    saveShiftData(shiftInfo) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.FETCH_SHIFT_DATA;
      serviceConf.requestHeader = {};
      const payload: ShiftModel = shiftInfo
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
          this.fetchShiftData();
          this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
    }

    fetchShiftMapping(policyID:number): Observable<any>{
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_SHIFTMAPPING_DATA+policyID;
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf);
    }
    
    saveShiftMapping(shiftMappedData){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_SHIFTMAPPING_DATA;
      serviceConf.requestHeader = {};
      const payload: ShiftModel = shiftMappedData;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)         
          this.AttendancePolicyService.fetchAttendancePolicyMasterData();
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
    
    deleteCellFromRemote(params) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.DELETE;
      serviceConf.path = PATH.FETCH_SHIFT_DATA + '/' + params.data.shiftID;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
             this.fetchShiftData()
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
            
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
  
    }
    deleteAttendanceShiftMapping(policyID,shiftID) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.DELETE;
      serviceConf.path = PATH.FETCH_SHIFTMAPPING_DATA  + policyID +'/'+ shiftID;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
  
    }
}
