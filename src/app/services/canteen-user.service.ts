import { Injectable } from '@angular/core';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { CanteenManualPunchSingle, CanteenprocessSingle, canteenPunchDetails } from '../store/model/canteen.model';
import { RemoteService } from '../common/remote.service';
import { Store } from '@ngrx/store';
import { AppCoreCommonService } from './app.core-common.services';
import { NotificationService } from '../common/notification.service';
import { RequestFlowService } from './request-flow.service';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanteenUserService {
  public _visiblecanteenProcessPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _canteenPunchDetails:BehaviorSubject<Array<canteenPunchDetails>> = new BehaviorSubject<Array<canteenPunchDetails>>([]);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private appCoreCommonService: AppCoreCommonService,
    private notificationService:NotificationService,
    private requestService: RequestFlowService
  ) { }

  setVisibilityprocess(val){
    this._visiblecanteenProcessPopup.next(val);
    }
  getVisiblityprocess(){
  return this._visiblecanteenProcessPopup.asObservable();
  }

  saveCanteenManualPunchSingle(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.POST_CANTEEN_MANAUL_PUNCH;
    serviceConf.requestHeader = {};
    const payload:CanteenManualPunchSingle = {
      employeeID: param.employeeID,
      punchTime: param.punchTime,
      reason: param.reason,
      inOut: 'I',
      systemIP: '00.00.00.00',
      itemQuantity:param.itemQuantity,
      itemID:param.itemID
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });
  }

  saveCanteenprocessSingle(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.POST_CANTEEN_PROCESS_SINGLE;
    serviceConf.requestHeader = {};
    const payload: CanteenprocessSingle = {
      employeeID: param.employeeID,
      fromDate:param.fromDate,
      toDate: param.toDate
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });
  }

  saveCanteenprocessmultiple(param){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.POST_CANTEEN_PROCESS_MULTIPLE;
    serviceConf.requestHeader = {};
    const payload: CanteenprocessSingle = {
      employeeID:0,
      fromDate:param.fromDate,
      toDate: param.toDate
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });
  }

  fetchCanteenDetailsData(empid,fromdate,todate):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_CANTEEN_PUNCHDETAILS+'/'+empid+'/'+fromdate+'/'+todate;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._canteenPunchDetails.next(response.punches)
        return response;
      }
    });
    return this._canteenPunchDetails.asObservable();
  }

  canteenPunchDetailsColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: '',
        field: 'employeeID',
        filter: false,
        editable: false,
        sortable: false,
        checkbox: false,
        suppressSizeToFit:true,
        hideData: true
        
    },{
        headerName: 'Attendance Date',
        field: 'attendanceDate',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 180,
      },
      {
        headerName: 'canteenPunchID',
        field: 'canteenPunchID',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 180,
      },
      {
        headerName: 'punchTime',
        field: 'punchTime',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 130,
      },
      {
      headerName: 'itemName',
      field: 'itemName',
      filter: true,
      sortable: true,
      width:170,
      },
      {
      headerName: 'itemRate',
      field: 'itemRate',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
      width:150,
      },
      {
        headerName: 'OverTime',
        field: 'overTime',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        width:150,
        },
      {
        headerName: 'itemQuantity',
        field: 'itemQuantity',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'employeeAmount',
        field: 'employeeAmount',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'employerAmount',
        field: 'employerAmount',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
    ]
    return columnDefs;
  }

}
