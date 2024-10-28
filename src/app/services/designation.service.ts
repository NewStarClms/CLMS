import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveDesignationAction } from '../store/actions/master.action';
import { Designation } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private gridApi: BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Designation>,
    private notificationService: NotificationService,
    private appCoreService:AppCoreCommonService,
    private userGroupService: UserGroupService
  ) {  this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }

  public fetchDesignationData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_DESIGNATION;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        this._store.dispatch(new saveDesignationAction(response.designationes));
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
  saveDesignation(designationInfo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_DESIGNATION;
    serviceConf.requestHeader = {};
    const payload: Designation = {
      designationID: 0,
      designationCode: designationInfo.designationCode,
      designationName: designationInfo.designationName,
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, 'Success')
        this.fetchDesignationData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  perpareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: 'Designation Code',
        field: 'designationCode',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 460,
      },
      {
        headerName: 'Designation Name',
        field: 'designationName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 420,
      },
      {
        headerName: "",
        minWidth: 0,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Designation, UI_CONSTANT.ACTIONS.DELETE),
  editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Designation, UI_CONSTANT.ACTIONS.UPDATE),
        colId: "action"
      }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_DESIGNATION + '/' + params.data.designationID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.fetchDesignationData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }
      else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
  updateStateOfCell(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_DESIGNATION;
    serviceConf.requestHeader = {};
    const payload: Designation = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchDesignationData();
        this.setVisibility(false);
      } else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
        this.setVisibility(true);
      }
      return response;
    });
  }
  getCSVReport(data, fileName){
    this.appCoreService.exportExcel(data, fileName);
  }

}
