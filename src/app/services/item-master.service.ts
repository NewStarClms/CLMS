import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveItemMasterAction } from '../store/actions/item-master.action';
import { ItemMaster } from '../store/model/canteen.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';

@Injectable({
  providedIn: 'root'
})
export class ItemMasterService {
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(  
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private notificationService:NotificationService,
    private appCoreCommonService:AppCoreCommonService) { 
      this._isEditable.next(false);
      this._isEditable.asObservable();
    }

    setVisibility(val){
      this._visiblePopup.next(val);
      }
  
      getVisiblity(){
      return this._visiblePopup.asObservable();
      }

      public fetchItemMasterData() {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_ITEM_MASTER;
        serviceConf.requestHeader = {};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
          if(response){
            this._store.dispatch(new saveItemMasterAction(response.items));
            return response;
          }
          return response;
        });
      }

      saveItemMaster(itemMasterInfo) {
        console.log(itemMasterInfo);
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path = PATH.SAVE_ITEM_MASTER;
        serviceConf.requestHeader = {};
        const payload: ItemMaster = {
          itemID: 0,
          itemCode:itemMasterInfo.itemCode,
          itemName:itemMasterInfo.itemName,
          itemType:itemMasterInfo.itemType,
          description:itemMasterInfo.description,
          startTime:itemMasterInfo.startTime,
          endTime:itemMasterInfo.endTime,
          itemRate:itemMasterInfo.itemRate,
          itemRateAfterSubsidy:itemMasterInfo.itemRateAfterSubsidy,
          employeeContribution:itemMasterInfo.employeeContribution,
          employerContribution:itemMasterInfo.employerContribution,
          subsidizedQuantity:itemMasterInfo.subsidizedQuantity
        };
        serviceConf.payloadObjects = payload;
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
          console.log(response);
          if (response.messageType === 0) {
            this.fetchItemMasterData();
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
            this.fetchItemMasterData();
            this.setVisibility(false);
          }else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            this.setVisibility(true);
          }
          return response;
        
        });
        
      }

      UpdateItemMaster(payload:ItemMaster){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.PUT;
        serviceConf.path = PATH.UPDATE_ITEM_MASTER;
        serviceConf.requestHeader = {};
        serviceConf.payloadObjects = payload;
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
          if (response.messageType === 0) {
            this.fetchItemMasterData();
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          
         
          }else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          }
          return response;
        });
    
      }

      deleteCellFromRemote(params) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.DELETE;
        serviceConf.path = PATH.DELETE_ITEM_MASTER + params.data.itemID;
        serviceConf.requestHeader = {};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
          if (response.messageType === 0) {
               this.fetchItemMasterData();
              this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          }else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          }
          return response;
        });
    
      }

      getCSVReport(data, fileName){
        this.appCoreCommonService.exportExcel(data, fileName);
      }

      prepareColumnForGrid() {
        const columnDefs: any[] = [
          {
            headerName: 'Item Code',
            field: 'itemCode',
            filter: true,
            autoHeight: true,
            sortable: true,
            width: 180
          },
          {
            headerName: 'Item Name',
            field: 'itemName',
            filter: true,
            editable: false,
            sortable: true,
            suppressSizeToFit: true,
          },
          {
            headerName: 'Item Type',
            field: 'itemType',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Start Time',
            field: 'startTime',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true,
    
          },
          {
            headerName: 'End Time',
            field: 'endTime',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'ItemRateAfterSubsidy',
            field: 'itemRateAfterSubsidy',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'EmployeeContribution',
            field: 'employeeContribution',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'EmployerContribution',
            field: 'employerContribution',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'SubsidizedQuantity',
            field: 'subsidizedQuantity',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: "Action",
            cellRenderer: "editableCellRendererComponent",
            editable: false,
            colId: "action",
            editAllow: true,
            deleteAllow: true,
          }]
  
        return columnDefs;
      }

}
