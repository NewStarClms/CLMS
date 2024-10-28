import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpMethod } from "../common/constants/http-method.constants";
import { PATH } from "../common/constants/service-path.constants";
import { UI_CONSTANT } from "../common/constants/ui-constants";
import { NotificationService } from "../common/notification.service";
import { RemoteService } from "../common/remote.service";
import { ArrearRequest, UnProcessArrearRequest } from "../store/model/arrear.model";
import { ServiceConfig } from "../store/model/serviceConfig.model";

@Injectable({
    providedIn: 'root'
  })
  export class ArrearService {

    public _monthYear: BehaviorSubject<string> = new BehaviorSubject<string>("");
    public _employeeArrearList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    
    constructor( private remoteService: RemoteService<any>,
                 private notificationService:NotificationService, ) 
                 {  }

    setArrearMonthYearValue(val){
        this._monthYear.next(val);
    }
        
    getArrearMonthYearValue(){
        return this._monthYear.asObservable();
    }
      
    getEmployeeArrearList(){
      return this._employeeArrearList.asObservable();
    }
    

    public fetchEmployeeArrearList(employeeID: number, monthYear: string, flag: string) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path =PATH.FETCH_EMPLOYEE_ARREAR_LIST + '?employeeID=' + employeeID + '&monthYear=' + monthYear+'&flag='+flag;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(
          map((response) => {
            if (response && response.employees) {
              this._employeeArrearList.next(response.employees);
              return response;
            }
          })
        );
      }
      public fetchEmployeeArrearDetail(employeeID: number, financialYearID: number,
        monthYear: string, flag: string, arrearDetailID: number) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path =PATH.FETCH_EMPLOYEE_ARREAR_DETAIL + '?employeeID=' + employeeID +'&financialYearID='+financialYearID+ '&monthYear=' + monthYear+'&flag='+flag+'&arrearDetailID='+arrearDetailID;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(
          map((response) => {
            if (response && response.employee) {
              return response;
            }
          })
        );
      }

      public processArrearRequest(arrearRequest:ArrearRequest) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path =PATH.PROCESS_ARREAR_REQUEST;
        serviceConf.payloadObjects = arrearRequest;
        serviceConf.requestHeader = {};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
            if (response.messageType === 0) {
                this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
                this.fetchEmployeeArrearList(0,arrearRequest.monthYear, "P");
            }
            else{
                this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            }
          });
      }

      public UnprocessArrearRequest(arrearRequest:UnProcessArrearRequest) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path =PATH.UNPROCESS_ARREAR_REQUEST;
        serviceConf.payloadObjects = arrearRequest;
        serviceConf.requestHeader = {};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
            if (response.messageType === 0) {
                this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
                this.fetchEmployeeArrearList(0,arrearRequest.monthYear, "P");
            }
            else{
                this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            }
          });
      }

      prepareColumnForProcessGrid() {
        const columnDefs: any[] = [
          {
            headerName: '',
            field: 'employeeID',
            filter: false,
            editable: false,
            sortable: false,
            checkbox: true,
            suppressSizeToFit:true,
            hideData: true
          },
          {
            headerName: 'Employee Code',
            field: 'employeeCode',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Employee Name',
            field: 'employeeName',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Department',
            field: 'department',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Designation',
            field: 'designation',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Category',
            field: 'category',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Branch',
            field: 'branch',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Arrear Month',
            field: 'arrearMonthYear',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Arrear Days',
            field: 'arrearDays',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'PF',
            field: 'pf',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'ESI',
            field: 'esi',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'LWF',
            field: 'lwf',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'PT',
            field: 'pt',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Earning',
            field: 'Earning',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Deduction',
            field: 'deduction',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'NetPay',
            field: 'netPay',
            filter: true,
            editable: false,
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
          
        ];
        return columnDefs;
      }

      prepareColumnForPendingGrid() {
        const columnDefs: any[] = [
          {
            headerName: '',
            field: 'employeeID',
            filter: false,
            editable: false,
            sortable: false,
            checkbox: true,
            suppressSizeToFit:true,
            hideData: true
                
          },
          {
            headerName: 'Employee Code',
            field: 'employeeCode',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Employee Name',
            field: 'employeeName',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Department',
            field: 'department',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Designation',
            field: 'designation',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Category',
            field: 'category',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Branch',
            field: 'branch',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Arrear Month',
            field: 'arrearMonth',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Arrear Days',
            field: 'arrearDays',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Present',
            field: 'present',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Leave',
            field: 'leave',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Absent',
            field: 'absent',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'WeeklyOff',
            field: 'weeklyOff',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Holiday',
            field: 'holiday',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Working Hours',
            field: 'workingHours',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'OverTime',
            field: 'overTime',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'DataSource',
            field: 'dataSource',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Remark',
            field: 'remark',
            filter: true,
            editable: false,
            sortable: true,
          }
          
        ];
        return columnDefs;
      }
  }