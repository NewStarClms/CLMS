import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { AttendanceProcessEmployeeDetail, EmployeeSalarySummaryDetail, SalaryHoldRelease, SalaryProcess } from '../store/model/attendance-process.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryDashboardService {
  public _salaryProcessData: BehaviorSubject<Array<Notification>>= new BehaviorSubject<Array<Notification>>([]);
  public _EmployeeDetailData: BehaviorSubject<Array<AttendanceProcessEmployeeDetail>>= new BehaviorSubject<Array<AttendanceProcessEmployeeDetail>>([]);
  public _EmployeeDetailforSalaryData: BehaviorSubject<Array<SalaryHoldRelease>>= new BehaviorSubject<Array<SalaryHoldRelease>>([]);
  //public _downloadProcessData:BehaviorSubject<string>=new BehaviorSubject<string>(null);
  public _EmployeeSalarySummaryDetail:BehaviorSubject<Array<EmployeeSalarySummaryDetail>>=new BehaviorSubject<Array<EmployeeSalarySummaryDetail>>(null);
  
  constructor(private remoteService:RemoteService<any>,
    private notificationService : NotificationService) { }
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
          headerName: 'Paid Days',
          field: 'paidDays',
          filter: true,
          suppressSizeToFit:true,
          sortable: true,
        },
        {
          headerName: 'PF',
          field: 'pf',
          filter: true,
          suppressSizeToFit:true,
          sortable: true,
          },
          {
            headerName: 'LWF',
            field: 'lwf',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          },
          {
            headerName: 'ESI',
            field: 'esi',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          },
          {
            headerName: 'PT',
            field: 'pt',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          },
          {
            headerName: 'Earning',
            field: 'salaryEaring',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          },
          {
            headerName: 'Deduction',
            field: 'salaryDeduction',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          }, 
          {
            headerName: 'SalaryPay',
            field: 'salaryPay',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          }, 
          {
            headerName: 'ArrearPay',
            field: 'arrearPay',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          }, 
          {
            headerName: 'NetPay',
            field: 'netPay',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          }, 
          {
            headerName: "",
          minWidth: 315,
          cellRenderer: "editableCellRendererComponent",
          editable: false,
          deleteAllow: true,
          detailAllow:true,
          reProcess:true,
          colId: "action"
           }
              
      ]
      return columnDefs;
    }
    prepareColumnForGridRelease() {
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
            headerName: 'NetPay',
            field: 'netPay',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          }, 
          {
            headerName: "",
          minWidth: 315,
          cellRenderer: "editableCellRendererComponent",
          editable: false,
          deleteAllow: false,
          detailAllow:true,
          reProcess:false,
          colId: "action"
           }
              
      ]
      return columnDefs;
    }
    UnProcessprepareColumnForGrid() {
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
          },  
                
      ]
      return columnDefs;
    }
    
    fetchSalaryProcessData(monthyear):Observable<any>{
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.PROCESS_DASHBOARD+'Salary?MonthYear='+monthyear;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response) {
          // console.log('leaveRequest',response);
          this._salaryProcessData.next(response)
          return response;
          
        }
      });
      return this._salaryProcessData.asObservable();
    }
    fetchProcessDownloadData(monthyear,groupId,sequenceno){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.PROCESS_DASHBOARD_DOWNLOAD+'Salary?MonthYear='+monthyear+'&GroupId='+groupId+'&SequenceNo='+sequenceno;
      serviceConf.requestHeader = {};
      return this.remoteService.downloadFile(serviceConf);
    }
    fetchEmployeeDetailforUnProcess(monthyear,employeeID):Observable<any>{
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.SALARY_DASHBOARD+'UnprocessEmployee?EmployeeID='+employeeID+'&MonthYear='+monthyear;
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
      serviceConf.path = PATH.SALARY_DASHBOARD+'ProcessedEmployes?EmployeeID='+employeeID+'&MonthYear='+monthyear;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response && response.data) {
          //console.log('processed',response);
          this._EmployeeDetailData.next(response)
          return response;
        }
      });
      return this._EmployeeDetailData.asObservable(); 
    }
    saveSalaryUnProcess(params){
      const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path = PATH.SALARY_DASHBOARD+'UnProcessRequest';
        serviceConf.requestHeader = {};
        const payload: SalaryProcess = params;
        serviceConf.payloadObjects = payload;
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
          if (response.messageType === 0) {
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
            this.fetchEmployeeDetailforProcess(params.monthYear,0);
            this.fetchSalaryProcessData(params.monthYear);
          }else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
           
          }
          return response;
        });
    
    }
    saveSalaryProcess(params){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.SALARY_DASHBOARD+'ProcessRequest';
      serviceConf.requestHeader = {};
      const payload: SalaryProcess = params;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchEmployeeDetailforProcess(params.monthYear,0);
          this.fetchSalaryProcessData(params.monthYear);
          
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
         
        }
        return response;
      });
    
    }
    fetchEmployeeDetailforHoldRelease(monthyear,actionType: string):Observable<any>{
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.SALARY_DASHBOARD+'HoldReleaseEmployes?actionType='+actionType+'&MonthYear='+monthyear;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response && response.data) {
          console.log('processed',response);
          this._EmployeeDetailforSalaryData.next(response)
          return response;
        }
      });
      return this._EmployeeDetailforSalaryData.asObservable(); 
    }
    saveSalaryHoldRelease(params){
      const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path = PATH.SALARY_DASHBOARD+'HoldRelease';
        serviceConf.requestHeader = {};
        const payload: SalaryHoldRelease = params;
        serviceConf.payloadObjects = payload;
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
          if (response.messageType === 0) {
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
            this.fetchSalaryProcessData(params.monthYear);
          }else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
           
          }
          return response;
        });
    
    }
    
}
