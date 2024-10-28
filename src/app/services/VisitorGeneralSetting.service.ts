import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveVisitorGeneralSettingAction } from '../store/actions/VisitorGeneralSetting.action';
import { VisitorGeneralSetting } from '../store/model/VisitorGeneralSetting.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';


@Injectable({
  providedIn: 'root'
})
export class VisitorGeneralSettingService {
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  generalSettingsList: BehaviorSubject<Array<VisitorGeneralSetting>>= new BehaviorSubject<Array<VisitorGeneralSetting>>([]);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  setGridApi(data) {
    this._gridApi.next(data);
 }
 setVisibility(val){
  this._visiblePopup.next(val);
  }

  getVisiblity(){
  return this._visiblePopup.asObservable();
  }
 getGridApi() {
   return this._gridApi.asObservable();
 }
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<VisitorGeneralSetting>,
    private notificationService:NotificationService,
    private appCoreCommonService:AppCoreCommonService
  ) {

  }

    public fetchGeneralSettigsData() {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_VISITOR_GENERAL_SETTING;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response) {
          // console.log(response)
          this.generalSettingsList.next(response.generalSettings);
          this._store.dispatch(new saveVisitorGeneralSettingAction(response.generalSettings));
        }
        return response;
    });

  }

    prepareColumnForGrid() {
      const columnDefs: ColDef[] = [
        {
          headerName: 'general Setting ID',
          field: 'generalSettingID',
          filter: true,
          autoHeight: true,
          sortable: true,
          suppressSizeToFit: true,
          editable: true,
          width: 190,
        },
        {
          headerName: 'general Setting Name',
          field: 'generalSettingName',
          filter: true,
          autoHeight: true,
          suppressSizeToFit: true,
          sortable: true,
          editable: true,
          width: 354,
        },
  
        {
          headerName: 'value',
          field: 'value',
          filter: true,
          suppressSizeToFit: true,
          sortable: true,
          editable: true,
          autoHeight: true,
          width: 250,
        },
        {
          headerName: "",
          minWidth: 315,
          cellRenderer: "editableCellRendererComponent",
          editable: false,
          colId: "action"
        }
      ]
      return columnDefs;
    }

    updateStateOfCell(generalSettingsInfo){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_VISITOR_GENERAL_SETTING;
      serviceConf.requestHeader = {};
      const payload: VisitorGeneralSetting = generalSettingsInfo;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchGeneralSettigsData();
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);

        }
        return response;
      });
    }



    
    deleteCellFromRemote(params) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.DELETE;
      serviceConf.path = PATH.FETCH_VISITOR_GENERAL_SETTING + '/' + params.data.generalSettingID;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
             this.fetchGeneralSettigsData()
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
  
    }
    
   
}


