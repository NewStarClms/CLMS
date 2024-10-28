import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveQualificationAction } from '../store/actions/master.action';
import { Qualification } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  private _gridApi: BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Qualification>,
    private notificationService:NotificationService,
    private appCoreCommonService:AppCoreCommonService,
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
  setGridApi(data) {
    this._gridApi.next(data);
  }

  getGridApi() {
    return this._gridApi.asObservable();
  }
  public fetchQualificationData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_QUALIFICATION;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new saveQualificationAction(response.qualifications));
        // console.log(response);
      }
      return response;
    });

  }

  saveQualification(qualificationInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_QUALIFICATION;
    serviceConf.requestHeader = {};
    const payload: Qualification = {
      qualificationID: 0,
      qualificationName: qualificationInfo.qualificationName,
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchQualificationData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: 'Qualification Name',
        field: 'qualificationName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 720,

      },
      {
        headerName: "",
        minWidth: 0,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Qualification, UI_CONSTANT.ACTIONS.DELETE),
      editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Qualification, UI_CONSTANT.ACTIONS.UPDATE),
        colId: "action"
      }
        ]
        return columnDefs;
      }
      deleteCellFromRemote(params){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.DELETE;
        serviceConf.path = PATH.FETCH_QUALIFICATION+'/'+params.data.qualificationID;
        serviceConf.requestHeader = {};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
           if(response.messageType === 0){
             const qualificationName =  params.node.data.qualificationName;
             this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
            this.fetchQualificationData();
          }else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
          }
          return response;
        });

       }
        updateStateOfCell(params){
          const serviceConf = new ServiceConfig();
          serviceConf.method = HttpMethod.PUT;
          serviceConf.path = PATH.FETCH_QUALIFICATION;
          serviceConf.requestHeader = {};
          const payload: Qualification = {
            qualificationID: params.qualificationID,
            qualificationName:params.qualificationName,
          };
          serviceConf.payloadObjects = payload;
          this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
            if (response.messageType === 0) {
              this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
              this.fetchQualificationData();
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
