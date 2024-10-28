import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveDepartmentAction } from '../store/actions/master.action';
import { Department } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { selectDepartmentState } from '../store/app.state';
import { BehaviorSubject } from 'rxjs';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  private gridApi: BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  departmentList: any;
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Department>,
    private notificationService: NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private userGroupService: UserGroupService
  ) {
    this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }
  public fetchDepartmentData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_DEPARTMENT;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        this._store.dispatch(new saveDepartmentAction(response.departmentes));
        // console.log(response);
      }
      return response;
    });

  }

  setGridApi(data) {
    this.gridApi.next(data);
  }

  getGridApi() {
    return this.gridApi.asObservable();
  }
  saveDepartment(departmentInfo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_DEPARTMENT;
    serviceConf.requestHeader = {};
    const payload: Department = {
      departmentID: 0,
      departmentCode: departmentInfo.departmentCode,
      departmentName: departmentInfo.departmentName,
      headOfDepartmentID: departmentInfo.headOfDepartmentID,
      emailID: departmentInfo.emailID,
      headOfDepartmentDisplay:departmentInfo.headOfDepartmentDisplay
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, 'Success')
        this.fetchDepartmentData();
        this.setVisibility(false);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: 'Department Code',
        field: 'departmentCode',
        filter: true,
        autoHeight: true,
        sortable: true,
      },
      {
        headerName: 'Department Name',
        field: 'departmentName',
        filter: true,
        autoHeight: true,
        sortable: true,
      },
      {
        headerName: 'Head Of Department',
        field: 'headOfDepartmentDisplay',
        filter: true,
        sortable: true,
      },
      {
        headerName: 'Email ID',
        field: 'emailID',
        filter: true,
        sortable: true,
      },
      {
        headerName: "",
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Department, UI_CONSTANT.ACTIONS.DELETE),
  editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Department, UI_CONSTANT.ACTIONS.UPDATE),
        colId: "action"
      }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_DEPARTMENT + '/' + params.data.departmentID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchDepartmentData();
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
  updateStateOfCell(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_DEPARTMENT;
    serviceConf.requestHeader = {};
    const payload: Department = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchDepartmentData();
        this.setVisibility(false);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }

  getDepartmentByID(id) {
    this._store.select(selectDepartmentState).subscribe(data =>{
      this.departmentList= data.departmentList;
    });
    console.log('departmentList',this.departmentList);
    if(this.departmentList){
      return this.departmentList.filter(item => item.departmentID === id)[0].departmentName;
    }
    return null;
  }
    getCSVReport(data, fileName) {
      this.appCoreCommonService.exportExcel(data, fileName);
    }
}
