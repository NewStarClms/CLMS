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
import { saveSectionAction } from '../store/actions/master.action';
import { Section } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
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
    private _store: Store<Section>,
    private notificationService:NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private userGroupService: UserGroupService

  ) {this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }

  public fetchSectionData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_SECTION;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._store.dispatch(new saveSectionAction(response.sectiones));
        //console.log(response);
      }
      return response;
    });

  }
  saveSection(sectionInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_SECTION;
    serviceConf.requestHeader = {};
    const payload: Section = {
      sectionID: 0,
      sectionCode: sectionInfo.sectionCode,
      sectionName: sectionInfo.sectionName,
      sectionSupervisorID: sectionInfo.sectionSupervisorID,
      emailID: sectionInfo.emailID,
      sectionSupervisorDisplay : sectionInfo.sectionSupervisorDisplay
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchSectionData();
        this.setVisibility(false);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: 'Section Code',
        field: 'sectionCode',
        filter:true,
    },
    {
      headerName: 'Section Name',
      field: 'sectionName',
      filter:true,
  },
  {
  headerName: 'Section Supervisor',
  field: 'sectionSupervisorDisplay',
  filter:true,
},
{
  headerName: 'Email ID',
  field: 'emailID',
  filter:true,

},
  {
    headerName: "",
  minWidth: 315,
  cellRenderer: "editableCellRendererComponent",
  editable: false,
  deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Section, UI_CONSTANT.ACTIONS.DELETE),
      editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Section, UI_CONSTANT.ACTIONS.UPDATE),
  colId: "action"
   }
  ]
  return columnDefs;
}
deleteCellFromRemote(params){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.DELETE;
  serviceConf.path = PATH.FETCH_SECTION+'/'+params.data.sectionID;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
    if (response.messageType === 0) {
      this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      this.fetchSectionData();
    }else {
      this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
    }
    return response;
  });

 }
  updateStateOfCell(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_SECTION;
    serviceConf.requestHeader = {};
    const payload: Section = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchSectionData();
        this.setVisibility(false);
      }else {
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
