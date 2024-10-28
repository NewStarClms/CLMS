import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveEmployeeAction, saveEmployeeMasterAction } from '../store/actions/workforce.action';
import {  Employee, EmployeeMaster, EmployeeProfile } from '../store/model/employee.model';
import { PagedData, PageInfo } from '../store/model/pageinfo.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppSearchCommonService } from './app-search.common.service';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  cityDropDownOption:Array<{cityID:string,cityName:string}>;
  stateDropDownOption:Array<{stateID:string,stateName:string}>;

  private _employeeDetail:BehaviorSubject<Employee> = new BehaviorSubject<Employee>(null);
  employeeList: BehaviorSubject<Array<PagedData>>= new BehaviorSubject<Array<PagedData>>([]);
  employeeStateList: BehaviorSubject<Array<Employee>>= new BehaviorSubject<Array<Employee>>([]);
  employeeUserDeatilStateList: BehaviorSubject<Array<EmployeeProfile>>= new BehaviorSubject<Array<EmployeeProfile>>([]);
  MasterStateList : BehaviorSubject<Array<EmployeeMaster>>= new BehaviorSubject<Array<EmployeeMaster>>([]);
  
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Employee>,
    private notificationService:NotificationService,
    private router: Router,
    private appCoreCommonService:AppCoreCommonService,
    private commonService: AppSearchCommonService,
    private userGroupService: UserGroupService
  ) { }

  public fetchEmployeeData(pager: PageInfo=null):Observable<any>{

    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.requestHeader = {};
    serviceConf.path = PATH.FETCH_EMPLOYEE + this.commonService.getPagingQueryString(pager);


    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      // console.log('employee',response.employees);
      if(response){
        this.employeeList.next(response);
        this.employeeStateList.next(response.data);
        return response;
      }
    });
    return this.employeeList.asObservable();

  }
  public fetchEmployeeListForDropDown(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_EMPLOYEE;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this.employeeStateList.next(response.employees);
        this._store.dispatch(new saveEmployeeAction(response.employees));
      }
      return response;
    });

  }
  saveEmployee(employeeeInfo){
    console.log("servicee",employeeeInfo)
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_EMPLOYEE;
    serviceConf.requestHeader = {};
    const payload: Employee = employeeeInfo;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchEmployeeData();
        this.router.navigate(['/work/employee/']);
      }
      if (response.messageType === 1) {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.router.navigate(['/work/add-edit-employee/'+employeeeInfo.employeeID]);
      }
      return response;
    });

  }

  getEmployeeWorkflow(employeeID, workflowID){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_EMPLOYEE_WORKFLOW+'WorkflowID='+workflowID+'&employeeID='+employeeID;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response =>{
      if (response.approverDetail!=null && response.approverDetail.responseMessage.messageType === 0) {
         return response;
      }
      if (response.approverDetail.responseMessage.messageType === 1) {
        this.notificationService.showError(response.approverDetail.responseMessage.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    }));
  }

  prepareColumnForGrid() {
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
  headerName: 'Punch ID',
  field: 'punchID',
  filter: true,
  editable: true,
  sortable: true,
  width:170,

  },{
    headerName: 'Pan No.',
    field: 'panNo',
    filter: true,
    autoHeight: true,
    suppressSizeToFit: true,
    editable: true,
    sortable: true,
    width: 190
  },
  {
    headerName: 'Aadhar Number',
    field: 'aadharNumber',
    filter: true,
    suppressSizeToFit:true,
    editable: true,
    sortable: true,
    },

  {
    headerName: "",
    width: 100,
    cellRenderer: "editableCellRendererComponent",
    editable: false,
    deleteAllow: true,
    editAllow: true,
    colId: "action"
  }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_EMPLOYEE+'/'+params.data.employeeID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.fetchEmployeeData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }
      else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

   }
    updateStateOfCell(params){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_EMPLOYEE;
      serviceConf.requestHeader = {};
      const payload: Employee = params;
      // console.log('payload',payload);
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchEmployeeData();
          this.router.navigate(['/work/employee/']);
        }
        if (response.messageType === 1) {
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.router.navigate(['/work/add-edit-employee/'+params.employeeID]);
          console.log('payload',params.joiningDate);
        }
        return response;
      });
    }

    getEmployeeDropdownOptionList(action:string){
      let dropDownOption: Array<any> = [];
      let key = 'employeeID';
      if(action === 'employee'){
        const stateList:Array<Employee> = this.employeeStateList.getValue();
        stateList.map(x => {
          dropDownOption.push({
            employeeID: x.employeeID,
            employeeCode: x.employeeCode
          })
        });
      }

      const arrayUniqueByKey = [...new Map(dropDownOption.map(item =>
        [item[key], item])).values()];
      return arrayUniqueByKey;
    }

    public fetchEmployeeMasterData(){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_EMPLOYEE_MASTER;
      serviceConf.requestHeader = {};
  
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
  
        if(response){
          this.MasterStateList.next(response.staticMaster);
          this._store.dispatch(new saveEmployeeMasterAction(response.staticMaster));
          //console.log('employeemast',response.staticMaster);
        }
        return response;
      });

  }
  fetchEmployeeDetail(id):Observable<any>{
    const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_EMPLOYEE_DETAIL.replace('{1}',id);
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response && response.employee){
           this._employeeDetail.next(response.employee)
           return response.employee;
        }
      });
      return this._employeeDetail.asObservable();
  }
    getCSVReport(data, fileName){
      this.appCoreCommonService.exportExcel(data, fileName);
    }
    public fetchEmployeeUserDetail():Observable<any>{
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.requestHeader = {};
      serviceConf.path = PATH.FETCH_EMPLOYEE+'/UserDetail' ;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        console.log('employee',response);
        if(response){
          this.employeeUserDeatilStateList.next(response);
          return response;
        }
      });
      return this.employeeUserDeatilStateList.asObservable();
    }
}
