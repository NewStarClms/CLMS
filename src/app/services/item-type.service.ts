import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveItemTypeAction } from '../store/actions/master.action';
import { ItemTypes } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class ItemTypeService {
  private gridApi;
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
defaultColDef: { suppressSizeToFit: boolean; };
colResizeDefault: string;
public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<ItemTypes>,
    private notificationService:NotificationService,
    private appCoreCommonService: AppCoreCommonService,
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

  public fetchItemTypeData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_ITEM_TYPE;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new saveItemTypeAction(response.itemTypes));
        // console.log(response);
      }
      return response;
    });
  }
  saveItemType(itemTypeInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_ITEM_TYPE;
    serviceConf.requestHeader = {};
    const payload: ItemTypes = {
      itemTypeID: 0,
      itemTypeName: itemTypeInfo.itemTypeName
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
         this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchItemTypeData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  perpareColumnForGrid() {
   const columnDefs:any[] = [
      {
        headerName: 'Item Type Name',
        field: 'itemTypeName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 720,
        onCellValueChanged: function ($event) {
          console.log('event',$event);
        },
        valueSetter: params => {
          console.log('dds',params);
          params.data.itemTypeName = params.newValue;
          return true;
      }
    },
    {
      headerName: "",
      minWidth: 315,
      cellRenderer: "editableCellRendererComponent",
      editable: false,
      editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.ItemType,UI_CONSTANT.ACTIONS.UPDATE),
      deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.ItemType,UI_CONSTANT.ACTIONS.DELETE),
      colId: "action"
    }
      ]
      return columnDefs;
    }
    deleteCellFromRemote(params){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.DELETE;
      serviceConf.path = PATH.FETCH_ITEM_TYPE+'/'+params.data.itemTypeID;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
         if(response.messageType === 0){
           
           this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
          this.fetchItemTypeData();
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });

     }
      updateStateOfCell(params){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.PUT;
        serviceConf.path = PATH.FETCH_ITEM_TYPE;
        serviceConf.requestHeader = {};
        const payload: ItemTypes = params;
        serviceConf.payloadObjects = payload;
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
           if(response.messageType === 0){
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
            this.fetchItemTypeData();
            this.setVisibility(false);
          }else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            this.setVisibility(true);
          }
          return response;
        });
      }

      getCSVReport(data, fileName){
        this.appCoreCommonService.exportExcel(data, fileName);
      }
}
