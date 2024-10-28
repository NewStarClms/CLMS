import { ParseError } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { AttendanceProcess, AttendanceProcessEmployeeDetail } from '../store/model/attendance-process.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceProcessService {
public _attendanceProcessData: BehaviorSubject<Array<Notification>>= new BehaviorSubject<Array<Notification>>([]);
public _EmployeeDetailData: BehaviorSubject<Array<AttendanceProcessEmployeeDetail>>= new BehaviorSubject<Array<AttendanceProcessEmployeeDetail>>([]);
public _downloadProcessData:BehaviorSubject<string>=new BehaviorSubject<string>(null);
public _refreshGridData:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);

  constructor(private remoteService:RemoteService<any>,
  private notificationService : NotificationService) { }

  setForceRefreshGridData(val) {
    this._refreshGridData.next(val);
  }
  getRefreshGridData() {
    return this._refreshGridData.asObservable();
  }

fetchAttendanceProcessData(monthyear):Observable<any>{
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.GET;
  serviceConf.path = PATH.PROCESS_DASHBOARD+'Attendance?MonthYear='+monthyear;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
    if (response) {
      // console.log('leaveRequest',response);
      this._attendanceProcessData.next(response)
      return response;
      
    }
  });
  return this._attendanceProcessData.asObservable();
}
fetchProcessDownloadData(monthyear,groupId,sequenceno){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.GET;
  serviceConf.path = PATH.PROCESS_DASHBOARD_DOWNLOAD+'Attendance?MonthYear='+monthyear+'&GroupId='+groupId+'&SequenceNo='+sequenceno;
  serviceConf.requestHeader = {};
  return this.remoteService.downloadFile(serviceConf);

}
prepareColumnForGrid() {
  const columnDefs:any[] = [
    {
      headerName: '',
      field: 'employeeID',
      filter: false,
      editable: false,
      sortable: false,
      checkbox: true,
      suppressSizeToFit:true,
      hideData: true
      
  },{
      headerName: 'Employee Code',
      field: 'employeeCode',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
      width: 180,
    },
    {
      headerName: 'Employee Name',
      field: 'employeeName',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
      width: 130,
    },
    {
    headerName: 'Department',
    field: 'department',
    filter: true,
    sortable: true,
    width:170,
    },
    {
    headerName: 'Designation',
    field: 'designation',
    filter: true,
    suppressSizeToFit:true,
    sortable: true,
    width:150,
    },
    {
      headerName: 'Category',
      field: 'category',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
    },
    {
      headerName: 'Branch',
      field: 'branch',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
    },
    {
      headerName: 'Present',
      field: 'present',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
    },
    {
      headerName: 'Leave',
      field: 'leave',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
    },
    {
      headerName: 'Absent',
      field: 'absent',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
      },
      {
        headerName: 'WeeklyOff',
        field: 'weeklyOff',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Holiday',
        field: 'holiday',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'PaidDays',
        field: 'paidDays',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'WokringHours',
        field: 'workingHours',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'OverTime',
        field: 'overTime',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      }     
  ]
  return columnDefs;
}
fetchEmployeeDetailforUnProcess(monthyear,employeeID):Observable<any>{
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.GET;
  serviceConf.path = PATH.FETCH_PROCESS_DETAIL+'UnprocessEmployee?EmployeeID='+employeeID+'&MonthYear='+monthyear;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
    if (response && response.data) {
      //  console.log(response);
      this._EmployeeDetailData.next(response)
      return response;
    }
  });
  return this._EmployeeDetailData.asObservable(); 
}
fetchEmployeeDetailforProcess(monthyear,employeeID):Observable<any>{
  
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.GET;
  serviceConf.path = PATH.FETCH_PROCESS_DETAIL+'ProcessedEmployes?EmployeeID='+employeeID+'&MonthYear='+monthyear;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
    if (response && response.data) {
      console.log('processed',response);
      this._EmployeeDetailData.next(response)
      return response;
    }
  });
  return this._EmployeeDetailData.asObservable(); 
}
saveAttendanceUnProcess(params){
  const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_PROCESS_DETAIL+'Unprocess';
    serviceConf.requestHeader = {};
    const payload: AttendanceProcess = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
       
      }
      return response;
    });

}
saveAttendanceProcess(params){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.POST;
  serviceConf.path = PATH.FETCH_PROCESS_DETAIL+'process';
  serviceConf.requestHeader = {};
  const payload: AttendanceProcess = params;
  serviceConf.payloadObjects = payload;
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
    if (response.messageType === 0) {
      this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      this.setForceRefreshGridData(true);
    }else{
      this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
    }
  });

}
}
