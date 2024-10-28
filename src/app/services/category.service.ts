import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveCategoryAction } from '../store/actions/master.action';
import { Category } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  colResizeDefault: string;
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Category>,
    private notificationService: NotificationService,
    private appCoreService:AppCoreCommonService,
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
  
  public fetchCategoryData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_CATEGORY;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        this._store.dispatch(new saveCategoryAction(response.categoryes));
      }
      return true;
    });
    return true;
  }
  
  saveCategory(categoryInfo) {
    console.log(categoryInfo);
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_CATEGORY;
    serviceConf.requestHeader = {};
    const payload: Category = {
      categoryID: 0,
      categoryCode: categoryInfo.categoryCode,
      categoryName: categoryInfo.categoryName,
      minimumWages: categoryInfo.minimumWages
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      console.log(response);
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchCategoryData();
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
        field: 'categoryCode',
        filter: true,
        autoHeight: true,
        sortable: true,
        width: 180
      },
      {
        headerName: 'Name',
        field: 'categoryName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 354,
      },

      {
        headerName: 'Minimum Wages',
        field: 'minimumWages',
        filter: true,
        suppressSizeToFit: true,
        sortable: true,
        width: 250,
      },
      {
        headerName: "",
        minWidth: 315,
        cellRenderer: "editableCellRendererComponent",
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Category, UI_CONSTANT.ACTIONS.DELETE),
        editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Category, UI_CONSTANT.ACTIONS.UPDATE),
        editable: false,
        colId: "action"
      }
    ]
    return columnDefs;
  }
  
  deleteCellFromRemote(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_CATEGORY + '/' + params.data.categoryID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
           this.fetchCategoryData()
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
  updateStateOfCell(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_CATEGORY;
    serviceConf.requestHeader = {};
    const payload: Category = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchCategoryData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }

  getCSVReport(data, fileName){
    this.appCoreService.exportExcel(data, fileName);
  }
}
