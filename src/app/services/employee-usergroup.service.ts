import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveEmployeeUserGroupAction } from '../store/actions/usermanage.action';
import { employeeGeoLocation } from '../store/model/employeeGeoLocation.model';
import { PagedData, PageInfo } from '../store/model/pageinfo.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { EmployeeUserGroup,  UpsertEmployeeUserGroup } from '../store/model/usermanage.model';
import { AppSearchCommonService } from './app-search.common.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeUserGroupService {

  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;

  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  employeeUserGroupList: BehaviorSubject<Array<PagedData>>= new BehaviorSubject<Array<PagedData>>([]);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userGroupTypeStateList: any;

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
    private commonService: AppSearchCommonService
  ) {  }

  public fetchEmployeesUserGroupData(pager: PageInfo=null, selectedGroup: string="0"){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.requestHeader = {};
    serviceConf.path = PATH.FETCH_EMPLOYEE_USERGROUP+ selectedGroup + this.commonService.getPagingQueryString(pager);

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this.employeeUserGroupList.next(response);
        this._store.dispatch(new saveEmployeeUserGroupAction(response));
      }
      return response;
    });

  }

  public upsertEmployeeUserGroup(employeeList: string, usergroupList: string, action: string, pager: PageInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.UPSERT_EMPLOYEE_USERGROUP;
    serviceConf.requestHeader = {};
    const payload: UpsertEmployeeUserGroup = { 
      employeeList : employeeList,
      userGroupList: usergroupList,
      actionType: action
  };
  serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response.messageType === 0){
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchEmployeesUserGroupData(pager);
        this.setVisibility(false);
      }
      else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }


  updateEmployeeGeoLocationss(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.UPDATE_EMPLOYEEGEOLOCATION;
    serviceConf.requestHeader = {};
    const payload: employeeGeoLocation = {
      employeeID:params.employeeID,
      locations:params.locations,
    }
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      //   this.fetchCanteenPolicyDetailData();
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }

  public resetEmployeePwd(empCode: string){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.RESET_EMP_PASSWORD + empCode;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response.messageType === 0){
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.setVisibility(false);
      }
      else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }

  public toggleEssAccess(empCode: string){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.TOGGLE_ESS_ACCESS + empCode;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response.messageType === 0){
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.setVisibility(false);
      }
      else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
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
        
    },
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
          headerName: 'ESS?',
          field: 'active',
          filter: true,
          suppressSizeToFit:true,
          editable: false,
          sortable: true,
          icons: true
       }
        ,
        {
            headerName: "Action",
            field:'action',
            width: 100,
            cellRenderer: "editableCellRendererComponent",
            editable: false,
            colId: "action",
            usermanage: true,
            false: true,
            deleteAllow: false
          }
    ]
    return columnDefs;
  }
}
