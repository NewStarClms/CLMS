import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { LeaveAccrual, LeaveAccrualList } from '../store/model/laeveAcurral.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';

@Injectable({
  providedIn: 'root'
})
export class LeaveaccrualServiceService {
  public _leaveAccrualData:BehaviorSubject<LeaveAccrualList> = new BehaviorSubject<LeaveAccrualList>(null);
  constructor( private remoteService: RemoteService<any>,
    private notificationService: NotificationService,
    private appCoreCommonService: AppCoreCommonService,) { }
  fetchLeaveRequestAdminData(employeeId,accrualDate,accrualType):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_LEAVE_ACCRUAL+'Detail/'+employeeId+'/'+accrualDate+'/'+accrualType
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        console.log('leaveRequest',response);
        this._leaveAccrualData.next(response)
        return response;
        
      }
    });
    return this._leaveAccrualData.asObservable();
  }
  saveLeaveAccrualSingle(leaveaccuralInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_LEAVE_ACCRUAL+'employee';
    serviceConf.requestHeader = {};
    const payload: LeaveAccrual = leaveaccuralInfo
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess("Leave Accrual Successfully.", UI_CONSTANT.SEVERITY.SUCCESS);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });
  
  }
  saveLeaveAccrualMultiple(leaveaccuralInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_LEAVE_ACCRUAL+'Bulk';
    serviceConf.requestHeader = {};
    const payload: LeaveAccrual = leaveaccuralInfo
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess("Leave Accrual Successfully.", UI_CONSTANT.SEVERITY.SUCCESS);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });
  
  }
}
