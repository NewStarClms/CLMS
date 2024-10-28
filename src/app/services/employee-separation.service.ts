import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpMethod } from "../common/constants/http-method.constants";
import { PATH } from "../common/constants/service-path.constants";
import { UI_CONSTANT } from "../common/constants/ui-constants";
import { NotificationService } from "../common/notification.service";
import { RemoteService } from "../common/remote.service";
import { EmployeeSeparationDetail, EmployeeSettlementDetail } from "../store/model/employee-separation.model";
import { ServiceConfig } from "../store/model/serviceConfig.model";


@Injectable({
    providedIn: 'root'
  })
  export class EmployeeSeparationService {

    public _separationPopupVisibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public _settlementPopupVisibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


    constructor(
        private remoteService: RemoteService<any>,
        private notificationService:NotificationService,
      ) {  }
    
    setSeparationPopupVisibility(val){
        this._separationPopupVisibility.next(val);
    }
        
    getSeparationPopupVisibility(){
        return this._separationPopupVisibility.asObservable();
    }
    setSettlementPopupVisibility(val){
      this._settlementPopupVisibility.next(val);
    }
      
    getSettlementPopupVisibility(){
        return this._settlementPopupVisibility.asObservable();
    }

    public fetchEmployeeList(employeeStatusID:number, searchFlag:string, fromDate: string, toDate: string){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_EMPLOYEE_SETTLEMENT_LIST+"employeeStatusID="+employeeStatusID+"&searchFlag="+searchFlag;
        if(fromDate) serviceConf.path = serviceConf.path +"&fromDate="+ fromDate;
        if(toDate) serviceConf.path = serviceConf.path +"&toDate="+ toDate;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
          if (response && response.employees) {
            return response;
          }
        }));
    }
    
    public fetchEmployeeSeparationDetail(employeeID:number){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_EMPLOYEE_SEPARATION_DETAIL+employeeID;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
          if (response && response.employee) {
            return response;
          }
        }));
    }
    public fetchEmployeeSettlementDetail(employeeID:number){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_EMPLOYEE_SETTLEMENT_DETAIL+employeeID;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
          if (response && response.employee) {
            return response;
          }
        }));
    }

    public saveEmployeeSeparationDetail(employeeSeparationDetail : EmployeeSeparationDetail){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.SAVE_EMPLOYEE_SEPARATION_DETAIL;
      serviceConf.requestHeader = {};
      serviceConf.payloadObjects = employeeSeparationDetail;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.setSeparationPopupVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
    }
    public saveEmployeeSettlementDetail(employeeSettlementDetail : EmployeeSettlementDetail){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.SAVE_EMPLOYEE_SETTLEMENT_DETAIL;
      serviceConf.requestHeader = {};
      serviceConf.payloadObjects = employeeSettlementDetail;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.setSettlementPopupVisibility(false);
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
            headerName: 'Status',
            field: 'employeeStatusName',
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
            headerName: 'ResignationDate',
            field: 'resignationDate',
            filter: true,
            suppressSizeToFit:true,
            sortable: true
          },
          {
            headerName: 'Separation',
            field: 'action',
            cellRenderer: "editableCellRendererComponent",
            editable: false,
            colId: "action",
            suppressSizeToFit:true,
            separation:true
          },
          {
            headerName: "Settlement",
            field:'action',
            cellRenderer: "editableCellRendererComponent",
            editable: false,
            colId: "action",
            suppressSizeToFit:true,
            settlement:true
          }
        ]
        return columnDefs;
      }
  }