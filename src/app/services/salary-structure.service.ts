import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EmployeeSalaryStructure, EmployeeStatutory } from '../store/model/salary-structure.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryStructureService {
    public _statutoryPopupVisibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public _salaryPopupVisibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private remoteService: RemoteService<any>,
        private notificationService:NotificationService,
      ) { 
       
      }

  setStatutoryPopupVisibility(val){
      this._statutoryPopupVisibility.next(val);
  }
      
  getStatutoryPopupVisibility(){
      return this._statutoryPopupVisibility.asObservable();
  }
  setSalaryPopupVisibility(val){
    this._salaryPopupVisibility.next(val);
  }
    
  getSalaryPopupVisibility(){
      return this._salaryPopupVisibility.asObservable();
  }

    public fetchPayrollEmployeeList(assignStatus:any, approvalSttaus:any){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        if(assignStatus=="EMPA")
          assignStatus="A";
        else if(assignStatus=="EMPU")
          assignStatus="U";
        else
          assignStatus="";
        serviceConf.path = PATH.FETCH_PAYROLL_EMPLOYEE_LIST+"sFlag="+assignStatus+"&rStatus="+approvalSttaus;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
          if (response && response.employees) {
            return response;
          }
        }));
        
      }

    public fetchStatutoryDetail(employeeID : number){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_PAYROLL_EMPLOYEE_STATUTORY+"employeeID="+employeeID;
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
        if (response && response.employees) {
          return response;
        }
      }));
    }
    public fetchSalaryStructure(employeeID : number,policyID:number=0){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_PAYROLL_EMPLOYEE_SALARYSTRUCTURE+"employeeID="+employeeID;
      if(policyID>0){
        serviceConf.path= PATH.FETCH_PAYROLL_EMPLOYEE_SALARYSTRUCTURE+"employeeID="+employeeID+"&policyID="+policyID;
      }
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
        if (response && response.employees) {
          return response;
        }
      }));
    }

    public saveStatutoryDetail(employeeStatutory : EmployeeStatutory){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.SAVE_EMPLOYEE_STATUTORY;
      serviceConf.requestHeader = {};
      serviceConf.payloadObjects = employeeStatutory;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.setStatutoryPopupVisibility(false);
          this.fetchPayrollEmployeeList("",1);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
    }
    public saveSalaryStructure(employeeSalaryStructure : EmployeeSalaryStructure){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.SAVE_EMPLOYEE_SALARYSTRUCTURE;
      serviceConf.requestHeader = {};
      serviceConf.payloadObjects = employeeSalaryStructure;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.setSalaryPopupVisibility(false);
          this.fetchPayrollEmployeeList("",1);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
    }

      public prepareColumnForGrid() {
        const columnDefs:any[] = [
          {
            headerName: 'Employee Code',
            field: 'employeeCode',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          },
          {
            headerName: 'Name',
            field: 'employeeName',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          },
          {
            headerName: 'Department',
            field: 'department',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          },
          {
            headerName: 'Designation',
            field: 'designation',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          },
          {
            headerName: 'Branch',
            field: 'branch',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          },
          {
            headerName: 'Joining Date',
            field: 'joiningDate',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          },
          {
            headerName: 'Leaving Date',
            field: 'leavingDate',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          },
          {
            headerName: 'Employee Status',
            field: 'employeeStatus',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          },
          {
            headerName: 'Employee Type',
            field: 'employeeType',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          },
          {
            headerName: "Action",
            field:'action',
            cellRenderer: "editableCellRendererComponent",
            editable: false,
            colId: "action",
            deleteAllow: false,
            salarystructure: true,
          }
        ]
        return columnDefs;
      }
      public prepareColumnForPayComponentGrid() {
        const columnDefs:any[] = [
          {
            headerName: 'Component Name',
            field: 'payComponentName',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          }, 
          {
            headerName: 'Formula',
            field: 'formula',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          }, 
          {
            headerName: 'Monthly Remuneration',
            field: 'amount',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
            editable:true
          }
        ]
        return columnDefs;
      }
}