import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BusinessType } from '../store/model/master-data.model';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { Store } from '@ngrx/store';
import { saveBusinessTypeAction } from '../store/actions/master.action';
import { ColDef, GridApi, ColumnApi, ICellRendererParams } from 'ag-grid-community';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { NotificationService } from '../common/notification.service';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { AppUtil } from '../common/app-util';
import { ConfirmationService } from 'primeng/api';
import { selectBusinessTypeState } from '../store/app.state';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessTypeService {
  public columnDefs!: any[][];
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public businessName: string;
  private gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  businessStateList: BehaviorSubject<Array<BusinessType>> = new BehaviorSubject<Array<BusinessType>>([]);
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<BusinessType>,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private appCoreService: AppCoreCommonService,
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
  public fetchBusinessTypeData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_BUSINESS_TYPE;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        this.businessStateList.next(response.businessTypees);
        this._store.dispatch(new saveBusinessTypeAction(response.businessTypees));
      }
      return true;
    });
    return true;
  }

  saveBusinessType(params) {
    let response = false;
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_BUSINESS_TYPE;
    serviceConf.requestHeader = {};
    const payload: BusinessType = {
      businessTypeID: 0,
      businessTypeName: params.businessTypeName
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.fetchBusinessTypeData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.setVisibility(false);
      }
      else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }

  public prepareColumnDefs() {
    const colDefs: any[] = [
      {
        headerName: 'Business Type',
        field: 'businessTypeName',
        filter: true,
      },
      {
        headerName: "",
        minWidth: 0,
        editable: false,
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.BusinessType, UI_CONSTANT.ACTIONS.DELETE),
  editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.BusinessType, UI_CONSTANT.ACTIONS.UPDATE),
        colId: "action"
      }
    ]
    return colDefs;
  }
  deleteCellFromRemote(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_BUSINESS_TYPE + '/' + params.data.businessTypeID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.fetchBusinessTypeData();
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
    serviceConf.path = PATH.FETCH_BUSINESS_TYPE;
    serviceConf.requestHeader = {};
    const payload: BusinessType = {
      businessTypeID: params.businessTypeID,
      businessTypeName: params.businessTypeName
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchBusinessTypeData();
        this.setVisibility(false);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
    });
  }

  public removeConfirmation(params) {
    this.confirmationService.confirm({
      message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
      header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteCellFromRemote(params);
        this.notificationService.showInfo(UI_CONSTANT.MESSAGE_TEXT.DELETED_MESSAGE, null);
      },
      reject: (type) => {
        switch (type) {
          case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
            this.notificationService.showError('Comfirmation Rejected', null);
            break;
          case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
            this.notificationService.showWarning('Comfirmation Canceled',null);
            break;
        }
      }
    });
  }
  fetchBusinessTypeDataByID(businessTypeid) {
    let businessObj = "NA";
    this._store.select(selectBusinessTypeState).subscribe(data => {
      if(data && data.businessList){
        let businessStateList = AppUtil.deepCopy(data.businessList);
        console.log('obj-', this.businessStateList);
          businessObj = businessStateList.filter(item => item.businessTypeID === businessTypeid)[0].businessTypeName;
      }
    });
    console.log('obj', businessObj);
    return businessObj;
  }
  getBusinessTypeDropdownOptionList(action: string) {
    let dropDownOption: Array<any> = [];
    let key = 'businessTypeID';
    if (action === 'businessType') {
      const stateList: Array<BusinessType> = this.businessStateList.getValue();
      stateList.map(x => {
        dropDownOption.push({
          businessTypeID: x.businessTypeID,
          businessTypeName: x.businessTypeName
        })
      });
    }

    const arrayUniqueByKey = [...new Map(dropDownOption.map(item =>
      [item[key], item])).values()];
    return arrayUniqueByKey;
  }

  getCSVReport(data, fileName){
    this.appCoreService.exportExcel(data, fileName);
  }

}
