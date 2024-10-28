import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AttendanceDetailReport, AttendanceSummaryReport, TeamDetail } from '../store/model/team-detail.model';

@Injectable({
  providedIn: 'root'
})
export class TeamDetailService {
  public _teamDetailData:BehaviorSubject<TeamDetail>=new BehaviorSubject<TeamDetail>(null);
  public _attendanceDetailReportData:BehaviorSubject<AttendanceDetailReport>=new BehaviorSubject<AttendanceDetailReport>(null);
  public _attendanceSummaryReportData:BehaviorSubject<AttendanceSummaryReport>=new BehaviorSubject<AttendanceSummaryReport>(null);
  

   constructor(
     private remoteService: RemoteService<any>,
     private notificationService:NotificationService,
   ) { 
    
   }
   public fetchTeamDetailData():Observable<any>{
     const serviceConf = new ServiceConfig();
     serviceConf.method = HttpMethod.GET;
     serviceConf.path = PATH.TEAM_DETAIL+'TeamDetail';
     serviceConf.requestHeader = {};
     this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
       if (response && response) {
         this._teamDetailData.next(response.teams)
         return response.teams;
       }
     });
     return this._teamDetailData.asObservable();
   }
  
   public fetchAttendanceDetailReportData(employeeID,fromDate,toDate):Observable<any>{
    var path;
    if(employeeID !='' && fromDate ==undefined && toDate ==undefined){ 
      path = 'AttendanceDetailReport?EmployeeIdes='+employeeID;
    }else if(fromDate !=undefined && toDate !=undefined && employeeID ==''){
      path = 'AttendanceDetailReport?FromDate='+fromDate+'&ToDate='+toDate
    }else if(employeeID !='' && fromDate !=undefined && toDate !=undefined){
      path ='AttendanceDetailReport?EmployeeIdes='+employeeID+'&FromDate='+fromDate+'&ToDate='+toDate;
    }
     else{
      path = 'AttendanceDetailReport';
     }
     const serviceConf = new ServiceConfig();
     serviceConf.method = HttpMethod.GET;
     serviceConf.path = PATH.TEAM_DETAIL+path;
     serviceConf.requestHeader = {};
     this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
       if (response && response.teams) {
         this._attendanceDetailReportData.next(response.teams)
         return response.teams;
       }
     });
     return this._attendanceDetailReportData.asObservable();
   }
  
   public fetchAttendanceSummaryReportData(employeeID,fromDate,toDate):Observable<any>{
    var path;
    if(employeeID !='' && fromDate ==undefined && toDate ==undefined){
      path = 'AttendanceSummaryReport?EmployeeIdes='+employeeID;
    }else if(employeeID =='' && fromDate !=undefined && toDate !=undefined){
      path = 'AttendanceSummaryReport?FromDate='+fromDate+'&ToDate='+toDate
    }else if(employeeID !='' && fromDate !=undefined && toDate !=undefined){
      path ='AttendanceSummaryReport?EmployeeIdes='+employeeID+'&FromDate='+fromDate+'&ToDate='+toDate;
    }
     else{
      path = 'AttendanceSummaryReport';
     }
     const serviceConf = new ServiceConfig();
     serviceConf.method = HttpMethod.GET;
     serviceConf.path = PATH.TEAM_DETAIL+path;
     serviceConf.requestHeader = {};
     this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
       if (response && response.teams) {
         this._attendanceSummaryReportData.next(response.teams)
         return response.teams;
       }
     });
     return this._attendanceSummaryReportData.asObservable();
   }
   
   public prepareColumnForTeamDetailGrid() {
     const columnDefs:any[] = [
         {
         headerName: 'Employee Code',
         field: 'employeeCode',
         filter: true,
         suppressSizeToFit:true,
         editable: true,
         sortable: true,
         width: 180,
 
     },
     {
       headerName: 'Employee Name',
       field: 'employeeName',
       filter: true,
       suppressSizeToFit:true,
       editable: true,
       sortable: true,
       width: 130,
   },
   {
    headerName: 'Company',
    field: 'company',
    filter: true,
    suppressSizeToFit:true,
    sortable: true,
    },
   {
   headerName: 'Designation',
   field: 'designation',
   filter: true,
   editable: true,
   sortable: true,
   width:170,
 
   },
   {
   headerName: 'Department',
   field: 'department',
   filter: true,
   suppressSizeToFit:true,
   editable: true,
   sortable: true,
   width:150,
 
   },
   {
     headerName: 'Branch',
     field: 'branch',
     filter: true,
     suppressSizeToFit:true,
     sortable: true,
     },
     ]
     return columnDefs;
   }
   public prepareColumnForAttendanceSummaryReportGrid() {
     const columnDefsAttendanceSummaryReport:any[] = [
      {
        headerName: 'Employee Code',
        field: 'employeeCode',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,

    },
    {
      headerName: 'Employee Name',
      field: 'employeeName',
      filter: true,
      suppressSizeToFit:true,
      editable: true,
      sortable: true,
      width: 130,
  },
  {
  headerName: 'Designation',
  field: 'designation',
  filter: true,
  editable: true,
  sortable: true,
  width:170,

  },
  {
  headerName: 'Department',
  field: 'department',
  filter: true,
  suppressSizeToFit:true,
  editable: true,
  sortable: true,
  width:150,

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
        headerName: 'Absent',
        field: 'absent',
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
        headerName: 'WeekOff',
        field: 'weeklyoff',
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
        headerName: 'Late Arrival',
        field: 'lateArrival',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Early Departure',
        field: 'earlyDeparture',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
     ]
     return columnDefsAttendanceSummaryReport;
   }
   public prepareColumnForAttendanceDetailReportGrid() {
    const columnDefsAttendanceDetailReport:any[] = [
      {
        headerName: 'Employee Code',
        field: 'employeeCode',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,

    },
    {
      headerName: 'Employee Name',
      field: 'employeeName',
      filter: true,
      suppressSizeToFit:true,
      editable: true,
      sortable: true,
      width: 130,
  },
  {
  headerName: 'Designation',
  field: 'designation',
  filter: true,
  editable: true,
  sortable: true,
  width:170,

  },
  {
  headerName: 'Department',
  field: 'department',
  filter: true,
  suppressSizeToFit:true,
  editable: true,
  sortable: true,
  width:150,

  },
  {
    headerName: 'Branch',
    field: 'branch',
    filter: true,
    suppressSizeToFit:true,
    sortable: true,
    },
    {
      headerName: 'Attendance Date',
      field: 'attendanceDate',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
      },
      {
        headerName: 'Shift View',
        field: 'shiftView',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'In Time',
        field: 'inTime',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Out Time',
        field: 'outTime',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Status',
        field: 'status',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Working Hours',
        field: 'workingHours',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Extra Work',
        field: 'extraWork',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Late Arrival',
        field: 'lateArrival',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Early Departure',
        field: 'earlyDeparture',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
     ]
     return columnDefsAttendanceDetailReport;
   }
 
}
