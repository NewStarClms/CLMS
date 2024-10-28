import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NatureOfWork } from '../store/model/master-data.model';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { Store } from '@ngrx/store';
import { saveNatureofWorkAction } from '../store/actions/master.action';
import { ColDef } from 'ag-grid-community';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { selectNatureofworkState } from '../store/app.state';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class NatureofworkService {
  private gridApi;
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
defaultColDef: { suppressSizeToFit: boolean; };
colResizeDefault: string;
natureStateList: BehaviorSubject<Array<NatureOfWork>>= new BehaviorSubject<Array<NatureOfWork>>([]);
public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<NatureOfWork>,
    private notificationService:NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private userGroupService: UserGroupService
  ) { this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }

  public fetchNatureOfWorkData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_NATUREOFWORK;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this.natureStateList.next(response.natureOfWorkes);
        this._store.dispatch(new saveNatureofWorkAction(response.natureOfWorkes));
      }
      return response;
    });

  }
  saveNatureOfWork(natureofworkInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_NATUREOFWORK;
    serviceConf.requestHeader = {};
    const payload: NatureOfWork = {
      natureOfWorkID: 0,
      natureOfWorkName: natureofworkInfo.natureOfWorkName,
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchNatureOfWorkData();
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
        headerName: 'Nature Of Work Name',
        field: 'natureOfWorkName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 740,
        onCellValueChanged: function ($event) {
          console.log('event',$event);
        },
        valueSetter: params => {
          console.log('dds',params);
          params.data.natureOfWorkName = params.newValue;
          return true;
      }
    },

  {
    headerName: "",
  minWidth: 295,
  cellRenderer: "editableCellRendererComponent",
  editable: false,
  deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.NatureOfWork, UI_CONSTANT.ACTIONS.DELETE),
      editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.NatureOfWork, UI_CONSTANT.ACTIONS.UPDATE),
  colId: "action"
   }
  ]
  return columnDefs;
}
deleteCellFromRemote(params){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.DELETE;
  serviceConf.path = PATH.FETCH_NATUREOFWORK+'/'+params.data.natureOfWorkID;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
    if (response.messageType === 0) {
      this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      this.fetchNatureOfWorkData();
    }else {
      this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
    }
    return response;
  });
 }
  updateStateOfCell(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_NATUREOFWORK;
    serviceConf.requestHeader = {};
    const payload: NatureOfWork = {
      natureOfWorkID: params.natureOfWorkID,
      natureOfWorkName:params.natureOfWorkName,
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchNatureOfWorkData();
        this.setVisibility(false);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }

  fetchStateNatureDataByID(natureid){
    let natureObj: any= null;
    this._store.select(selectNatureofworkState).subscribe(data =>{
      let natureStateList= data.natureList;
      console.log('obj-',this.natureStateList);
      if(natureStateList){
        natureObj = natureStateList.filter(item=> item.natureOfWorkID === natureid)[0];
    }
    });

    console.log('obj',natureObj);
    return (natureObj)?natureObj:false;
  }
  getNatureDropdownOptionList(action:string){
    let dropDownOption: Array<any> = [];
    let key = 'natureOfWorkID';
    if(action === 'nature'){
      const stateList:Array<NatureOfWork> = this.natureStateList.getValue();
      stateList.map(x => {
        dropDownOption.push({
          natureOfWorkID: x.natureOfWorkID,
          natureOfWorkName: x.natureOfWorkName
        })
      });
    }

    const arrayUniqueByKey = [...new Map(dropDownOption.map(item =>
      [item[key], item])).values()];
    return arrayUniqueByKey;
  }
  getCSVReport(data, fileName){
    this.appCoreCommonService.exportExcel(data, fileName);
  }
}
