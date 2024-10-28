import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi, GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveEmployeesOUStatusAction } from '../store/actions/usermanage.action';
import { PagedData, PageInfo } from '../store/model/pageinfo.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { EmployeeOUMapping, EmployeeUserGroup,  UpsertEmployeeUserGroup } from '../store/model/usermanage.model';
import { AppSearchCommonService } from './app-search.common.service';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeOUService {

  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;

  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  employeesOUStatusList: BehaviorSubject<Array<PagedData>>= new BehaviorSubject<Array<PagedData>>([]);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  employeeOUMappings: BehaviorSubject<Array<EmployeeUserGroup>>= new BehaviorSubject<Array<EmployeeUserGroup>>([]);
  currentEmp: BehaviorSubject<EmployeeUserGroup>= new BehaviorSubject<EmployeeUserGroup>(null);
  
  setGridApi(data) {
    this._gridApi.next(data);
 }

 getGridApi() {
   return this._gridApi.asObservable();
 }
 setVisibility(val){
  this._visiblePopup.next(val);
  }

  getVisiblity(){
  return this._visiblePopup.asObservable();
  }
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<EmployeeUserGroup>,
    private notificationService:NotificationService,
    private commonService: AppSearchCommonService,
    private userGroupService: UserGroupService
  ) {  }

  public fetchEmployeesOUStatusData(pager: PageInfo=null){
    
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_EMPLOYEES_OUSTATUS +"0" + this.commonService.getPagingQueryString(pager);
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
    
      if(response){
        this.employeesOUStatusList.next(response);
        this._store.dispatch(new saveEmployeesOUStatusAction(response));
        //return response;
      }
      return response;
    });
  }

  

  public fetchEmployeeOU(employeeID: any):Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_EMPLOYEE_OU+employeeID;
    
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response){
            this.employeeOUMappings.next(response.userOUMapping);
            return response.userOUMapping;
          }
    });
    return this.employeeOUMappings.asObservable();
   
  }

  public upsertEmployeeOU(employeeOUMapping: EmployeeOUMapping){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.UPSERT_EMPLOYEE_OUMAPPING;
    serviceConf.requestHeader = {};
    const payload: EmployeeOUMapping = { 
        employeeID : employeeOUMapping.employeeID,
        userOUMappings: employeeOUMapping.userOUMappings
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
 
      if(response.messageType === 0){
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchEmployeesOUStatusData();
        this.setVisibility(false);
      }
      else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }

  setCurrentEditedEmp(emp) {
    this.currentEmp.next(emp);
 }

 getCurrentEditedEmp() {
   return this.currentEmp.asObservable();
 }

 prepareColumnForGrid() {
  const columnDefs:any[] = [
  
  {
      headerName: 'Employee Code',
      field: 'employeeCode',
      filter: true,
      editable: false,
      sortable: true,
      suppressSizeToFit:true,
  },
  {
      headerName: 'Employee Name',
      field: 'employeeName',
      filter: true,
      suppressSizeToFit:true,
      editable: false,
      sortable: true,

  },
  {
      headerName: 'Company',
      field: 'company',
      filter: true,
      editable: false,
      sortable: true,
      suppressSizeToFit:true,
  },
  {
      headerName: 'Department',
      field: 'department',
      filter: true,
      suppressSizeToFit:true,
      editable: false,
      sortable: true,
  },
  {
      headerName: 'Designation',
      field: 'designation',
      filter: true,
      suppressSizeToFit:true,
      editable: false,
      sortable: true,
  },
  {
      headerName: 'Branch',
      field: 'branch',
      filter: true,
      suppressSizeToFit:true,
      editable: false,
      sortable: true,
  },
  {
      headerName: 'Mapped Group',
      field: 'mappedGroup',
      filter: true,
      suppressSizeToFit:true,
      editable: true,
      sortable: true,
  },
  {
      headerName: 'Status',
      field: 'ouMappingStatus',
      filter: true,
      suppressSizeToFit:true,
      editable: false,
      sortable: true,
      icons: true
  },
  {
      headerName: "Action",
      width: 100,
      cellRenderer: "editableCellRendererComponent",
      editable: false,
      colId: "action",
      editAllow: true,//this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Map_Organization,UI_CONSTANT.ACTIONS.UPDATE),
      deleteAllow: false//this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Map_Organization,UI_CONSTANT.ACTIONS.DELETE)
    }
  ]
  return columnDefs;
}

  
}
