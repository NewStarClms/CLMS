import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveVisitorTypeAction } from '../store/actions/master.action';
import { VisitorType } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class VisitorTypeService {
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
    private _store: Store<VisitorType>,
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

  public fetchVisitorTypeData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_VISITOR_TYPE;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new saveVisitorTypeAction(response.visitorTypes));
      }
      return response;
    });
  }
  saveVisitorType(visitortypeInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_VISITOR_TYPE;
    serviceConf.requestHeader = {};
    const payload: VisitorType = {
      "visitorTypeID": 0,
      "visitorTypeName": visitortypeInfo.visitorTypeName
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
         this.notificationService.showSuccess(response.message, 'Success')
        this.fetchVisitorTypeData();
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
        headerName: 'Visitor Type Name',
        field: 'visitorTypeName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 720,
      },
      {
        headerName: "",
        minWidth: 315,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.VisitorType,UI_CONSTANT.ACTIONS.UPDATE),
      deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.VisitorType,UI_CONSTANT.ACTIONS.DELETE),
        colId: "action"
      }
        ]
        return columnDefs;
      }
      deleteCellFromRemote(params){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.DELETE;
        serviceConf.path = PATH.FETCH_VISITOR_TYPE+'/'+params.data.visitorTypeID;
        serviceConf.requestHeader = {};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
           if(response.messageType === 0){
             const visitorTypeName =  params.data.visitorTypeName;
             this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
            this.fetchVisitorTypeData();
          } else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
          }
          return response;
        });

       }
        updateStateOfCell(params){
          const serviceConf = new ServiceConfig();
          serviceConf.method = HttpMethod.PUT;
          serviceConf.path = PATH.FETCH_VISITOR_TYPE;
          serviceConf.requestHeader = {};
          const payload: VisitorType = params;
          serviceConf.payloadObjects = payload;
          this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
             if(response.messageType === 0){
               this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
              this.fetchVisitorTypeData();
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
