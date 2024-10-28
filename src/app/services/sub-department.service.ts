import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { AppUtil } from '../common/app-util';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveSubDepartmentAction } from '../store/actions/master.action';
import { selectDepartmentState, selectSubDepartmentState } from '../store/app.state';
import { Department, SubDepartment } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { DepartmentService } from './department.service';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class SubDepartmentService {
  private gridApi: BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
defaultColDef: { suppressSizeToFit: boolean; };
colResizeDefault: string;
public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
private departmentList:Array<Department> = null;
subDepartmentStateList: BehaviorSubject<Array<SubDepartment>> = new BehaviorSubject<Array<SubDepartment>>([]);
dropdownlist:any[];
  public deptFordropDown: Array<string> = ["Please Select"];
constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<SubDepartment>,
    private notificationService:NotificationService,
    private departmentService: DepartmentService,
    private appCoreCommonService:AppCoreCommonService,
    private userGroupService: UserGroupService
  ) {
    this._store.select(selectDepartmentState).subscribe(depts =>{
      if(depts && depts.departmentList){
        this.departmentList  = AppUtil.deepCopy(depts.departmentList);
        this.deptFordropDown.concat(this.departmentList.map(x=>x.departmentName));
      }
    });
    this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();

  }
  setGridApi(data) {
    this.gridApi.next(data);
  }

  getGridApi() {
    return this.gridApi.asObservable();
  }

  public fetchSubDepartmentData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_SUBDEPARTMENT;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new saveSubDepartmentAction(response.subDepartmentes));
      }
      return response;
    });

  }
  saveSubDepartment(subDepartmentInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_SUBDEPARTMENT;
    serviceConf.requestHeader = {};
    const payload: SubDepartment = {
      subDepartmentID: 0,
      departmentID: subDepartmentInfo.departmentID,
      subDepartmentCode: subDepartmentInfo.subDepartmentCode,
      subDepartmentName: subDepartmentInfo.subDepartmentName,
      subDepartmentSupervisorID: subDepartmentInfo.subDepartmentSupervisorID,
      emailID: subDepartmentInfo.emailID,
      subDepartmentSupervisorDisplay : subDepartmentInfo.subDepartmentSupervisorDisplay
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchSubDepartmentData();
        this.setVisibility(false)
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true)
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: 'Name',
        field: 'subDepartmentName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        sortable: true,
        pinned:true,
        width: 200,
    },
      {
        headerName: 'Code',
        field: 'subDepartmentCode',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 190,
    },
    {
      headerName: 'Department Name',
      field: 'departmentID',
      filter: true,
      autoHeight: true,
      cellEditorParams:'department',
      sortable: true,
      width: 190,
  },
  {
  headerName: 'Supervisor',
  field: 'subDepartmentSupervisorDisplay',
  filter: true,
  sortable: true,
  width:225,
},
{
  headerName: 'Email ID',
  field: 'emailID',
  filter: true,
  suppressSizeToFit:true,
  sortable: true,
  width:200,
},
  {
    headerName: "",
  minWidth: 0,
  cellRenderer: "editableCellRendererComponent",
  editable: false,
  deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.SubDepartment, UI_CONSTANT.ACTIONS.DELETE),
      editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.SubDepartment, UI_CONSTANT.ACTIONS.UPDATE),
  colId: "action"
   }
  ]
  return columnDefs;
}
deleteCellFromRemote(params){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.DELETE;
  serviceConf.path = PATH.FETCH_SUBDEPARTMENT+'/'+params.data.subDepartmentID;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
    if (response.messageType === 0) {
      this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      this.fetchSubDepartmentData();
    }else {
      this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
    }
    return response;
  });

 }
  updateStateOfCell(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_SUBDEPARTMENT;
    serviceConf.requestHeader = {};
    const payload: SubDepartment = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchSubDepartmentData();
        this.setVisibility(false)
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true)
      }
      return response;
    });
  }

  // setDropDownOption(){
  //   this._store.select(selectDepartmentState).subscribe(depts =>{
  //     if(depts && depts.departmentList){
  //       this.departmentList  = AppUtil.deepCopy(depts.departmentList);
  //       this.deptFordropDown.concat(this.departmentList.map(x=>x.departmentName));
  //     }
  //   });
  // }
  getCSVReport(data, fileName) {
    this.appCoreCommonService.exportExcel(data, fileName);
  }
  getSubDeptDropdownOptionList(ID:number){
    this.dropdownlist = null;
      this._store.select(selectSubDepartmentState).subscribe(data => {
        if (data && data.subdepartmentList) {
          // console.log(data.subdepartmentList)
          const subDepartmentStateList: SubDepartment[] = AppUtil.deepCopy(data.subdepartmentList);

          let dropDownOption: Array<any> = [];
          let key = '';

            key = 'departmentID';
          const subdepartmentList: Array<SubDepartment> = subDepartmentStateList.filter(i => i.departmentID === ID);
          // console.log('>>',subdepartmentList);
          subdepartmentList.map(x => {
            dropDownOption.push({
              subdeptID: x.subDepartmentID,
              subdeptName: x.subDepartmentName
            })
          });

          this.dropdownlist = dropDownOption;
          // console.log('arrayUniqueByKey1BankBranch', this.dropdownlist);
        }
      });
      //console.log('arrayUniqueByKey1BankBranch', this.dropdownlist);

      return this.dropdownlist;
  }
}
