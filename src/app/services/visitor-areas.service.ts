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
import { saveVisitorAreaAction } from '../store/actions/master.action';
import { VisitorAreas } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class VisitorAreasService {
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
    private _store: Store<VisitorAreas>,
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

  public fetchVisitorAreaData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_VISITOR_AREA;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new saveVisitorAreaAction(response.visitorAreas));
        // console.log(response);
      }
      return response;
    });
  }
  saveVisitorArea(visitorareaInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_VISITOR_AREA;
    serviceConf.requestHeader = {};
    const payload: VisitorAreas = {
      "visitorAreaID": 0,
      "visitorAreaName": visitorareaInfo.visitorAreaName
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
         this.notificationService.showSuccess(response.message, 'Success')
        this.fetchVisitorAreaData();
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
        headerName: 'Visitor Area Name',
        field: 'visitorAreaName',
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
          params.data.visitorAreaName = params.newValue;
          return true;
      }
      },
      {
        headerName: "",
        minWidth: 315,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.VisitorArea,UI_CONSTANT.ACTIONS.UPDATE),
      deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.VisitorArea,UI_CONSTANT.ACTIONS.DELETE),
        colId: "action"
      }
        ]
        return columnDefs;
      }
      deleteCellFromRemote(params){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.DELETE;
        serviceConf.path = PATH.FETCH_VISITOR_AREA+'/'+params.data.visitorAreaID;
        serviceConf.requestHeader = {};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
           if(response.messageType === 0){
             const visitorAreaName =  params.data.visitorAreaName;
             this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
            this.fetchVisitorAreaData();
          } else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          }
          return response;
        });

       }
        updateStateOfCell(params){
          const serviceConf = new ServiceConfig();
          serviceConf.method = HttpMethod.PUT;
          serviceConf.path = PATH.FETCH_VISITOR_AREA;
          serviceConf.requestHeader = {};
          const payload: VisitorAreas = params;
          serviceConf.payloadObjects = payload;
          this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
             if(response.messageType === 0){
               this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
              this.fetchVisitorAreaData();
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
