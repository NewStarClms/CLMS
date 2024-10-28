import { Injectable, Pipe } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeVariableSalary, EmployeeYearlyStatistics, LoanRequestModel, PaidDaysRequest, saveLeaveEncashPayment } from '../store/model/payroll-action.model';
import * as moment from 'moment';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';

@Injectable({
  providedIn: 'root'
})
export class PayrollActionService {

  public _employeeStatisticData: BehaviorSubject<Array<EmployeeYearlyStatistics>> = new BehaviorSubject([]);
  public _PaidDaysRequestDetail: BehaviorSubject<Array<PaidDaysRequest>> = new BehaviorSubject([]);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private notificationService: NotificationService
  ) { }

  getFinancialYear() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_FINANCIAL_YEAR;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  fetchEmployeeStatistics() {
    return this._employeeStatisticData.asObservable();
  }
  getEmployeeYearStatics(id, financialYear) {
    const path = PATH.GET_EMPLOYEE_YEAR_STATICS;
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = path.replace('{1}', id).replace('{2}', financialYear);
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).pipe();

  }
  getSalarySummaryDetail(id, financialYear) {
    const path = PATH.GET_SALARY_SUMMARY;
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = path.replace('{1}', id).replace('{2}', financialYear);
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();

  }

  getSalaryMonthlySummaryDetail(id, financialYear) {
    const path = PATH.GET_SALARY_SUMMARY_MONTHLY;
    const d = new Date('01-' + financialYear)
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = path.replace('{1}', id).replace('{2}', financialYear);
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();

  }

  getLoanSummaryDetail(id) {
    const path = PATH.GET_LOAN_SUMMARY;
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = path + '?EmployeeID=' + id;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  unprocessEmployeeSalaryByMonth(id: number[], month) {
    const path = PATH.UN_PROCESS_SALARY;
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = path;
    serviceConf.requestHeader = {};
    const payload = {
      "employeeIdes": id,
      "monthYear": moment('01-' + month).format("YYYY-MM-DD") + 'T00:00:00.00Z',

    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);

      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });
  }
  processEmployeeSalaryByMonth(id, month) {
    const path = PATH.PROCESS_SALARY;
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = path;
    serviceConf.requestHeader = {};
    const payload = {
      "employeeIdes": id,
      "monthYear": moment('01-' + month).format("YYYY-MM-DD") + 'T00:00:00.00Z',
      "actionType": "P",
      "executeManual": true,
      "remark": "salary Processed"
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);

      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });
  }

  getEmpMappedComponent(id){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.GET_EMP_MAPPED_COMPONENT + '?employeeID='+id+'&payHeadID='+8;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  saveLoanRquest(params) {
    const path = PATH.LOAN_REQUEST+'Admin';
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = path;
    serviceConf.requestHeader = {};
    const payload :LoanRequestModel = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);

      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });
  }
  getPaidDaysDetail(employeeID,monthYear) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_PROCESS_DETAIL+"SingleEmployee?EmployeeID="+employeeID+"&MonthYear="+monthYear;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  savePaidDaysRquest(params) {
    const path = PATH.FETCH_PROCESS_DETAIL+'UpdateManual';
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = path;
    serviceConf.requestHeader = {};
    const payload :PaidDaysRequest = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);

      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });
  }
  getEncashPaymentDetail(flag,monthYear,leaveyear) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.ENCASH_PAYMENT+"employeeForPayment?LeaveYear="+leaveyear+"&Flag="+flag+"&MonthYear="+monthYear;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  getEmployeeVariableSalary(employeeID,monthYear){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.GET_EMPLOYEE_VARIABLE_SALARY+"?EmployeeID="+employeeID+"&MonthYear="+monthYear;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  updateEmployeeVariableSalary(employeeVariableSalary: EmployeeVariableSalary){
    const path = PATH.UPDATE_EMPLOYEE_VARIABLE_SALARY;
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = path;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = employeeVariableSalary;
    this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);

      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });
  }

  saveLoanEMIAdjustment(payload: any) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_LOAN_ADJUSTMENT;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects=payload;
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  EncashPaymentprepareColumnForGrid() {
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
        headerName: 'Leave Code',
        field: 'leaveCode',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      {
        headerName: 'Encashed Leave',
        field: 'encash',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
      
      {
        headerName: 'Paid',
        field: 'paid',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
      },
        
    ]
    return columnDefs;
  }
  saveLeaveEncashForEmployee(params){
    const path = PATH.ENCASH_PAYMENT+'LeaveEncashmentPayment';
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = path;
    serviceConf.requestHeader = {};
    const payload :saveLeaveEncashPayment = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);

      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });
  }
}
