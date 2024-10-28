import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Branch, BusinessType, Company, NatureOfWork } from '../store/model/master-data.model';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { Store } from '@ngrx/store';
import { saveBranchAction } from '../store/actions/master.action';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { selectCompanyState, selectNatureofworkState } from '../store/app.state';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private api!: GridApi;
  private columnApi!: ColumnApi;
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<BusinessType>,
    private notificationService: NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private userGroupService: UserGroupService
  ) {
    this.defaultColDef = {
      suppressSizeToFit: true,
    };
    this.colResizeDefault = 'shift';
    this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }
  

  public fetchBranchData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_BRANCH;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        // console.log(response);
        this._store.dispatch(new saveBranchAction(response.branches));
      }
      return response;
    });

  }
  saveBranch(branchInfo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_BRANCH;
    serviceConf.requestHeader = {};
    const payload: Branch = {
      branchID: 0,
      companyID: branchInfo.companyID,
      branchCode: branchInfo.branchCode,
      branchName: branchInfo.branchName,
      address: branchInfo.address,
      countryID: branchInfo.countryID,
      stateID: branchInfo.stateID,
      cityID: branchInfo.cityID,
      branchHeadID: branchInfo.branchHeadID,
      email: branchInfo.email,
      natureOfWorkID: branchInfo.natureOfWorkID,
      pinCode: branchInfo.pinCode,
      branchHeadDisplay: '',
      latitude: branchInfo.latitude,
      longitude: branchInfo.longitude                

    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchBranchData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }

  prepareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: 'Code',
        field: 'branchCode',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 160,
      },
      {
        headerName: ' Name',
        field: 'branchName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 200,

      },
      {
        headerName: 'Company',
        field: 'companyID',
        filter: true,
        cellEditorParams: UI_CONSTANT.MASTER.COMPANY,
        sortable: true,
        width: 210,
      },
      {
        headerName: 'Address',
        field: 'address',
        filter: true,
        sortable: true,
        width: 210,

      },

      {
        headerName: 'Branch Head',
        field: 'branchHeadDisplay',
        filter: true,
        sortable: true,
        width: 210,
      },

      {
        headerName: "",
        minWidth: 0,
        editable: false,
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Branch, UI_CONSTANT.ACTIONS.DELETE),
    editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Branch, UI_CONSTANT.ACTIONS.UPDATE),
        colId: "action"
      }
    ]
    return columnDefs;
  }

  deleteCellFromRemote(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_BRANCH + '/' + params.data.branchID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        const branchName = params.node.data.branchName;
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchBranchData();
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
      }
      return response;
    });

  }
  updateStateOfCell(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_BRANCH;
    serviceConf.requestHeader = {};
    const payload: Branch = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchBranchData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
  bindRendererData(params, task: string) {
    let tempData = null;
    if (task === 'company') {
      this._store.select(selectCompanyState).subscribe(res => {
        if (res && res.companyList) {
          const tempArray: Company[] = res.companyList;
          tempData = tempArray.filter(i => i.companyID === params.data.companyID)[0].companyName;
        }
      })
    }
    if (task === 'NOfW') {
      this._store.select(selectNatureofworkState).subscribe(res => {
        if (res && res.natureofworkList) {
          const tempArray: NatureOfWork[] = res.natureofworkList;
          tempData = tempArray.filter(i => i.natureOfWorkID === params.data.natureOfWorkID)[0].natureOfWorkName;
        }
      })
    }
    // console.log(tempData);
    return tempData;
    
  }

  getCSVReport(data, fileName) {
    this.appCoreCommonService.exportExcel(data, fileName);
  }
}
