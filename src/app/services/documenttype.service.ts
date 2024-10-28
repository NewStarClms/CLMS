import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveDocumentCategoryAction } from '../store/actions/appData.action';
import { saveDocumentTypeAction } from '../store/actions/master.action';
import { documentCategory, DocumentTypes } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class DocumenttypeService {
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  documentTypeStateList: BehaviorSubject<Array<DocumentType>>= new BehaviorSubject<Array<DocumentType>>([]);
  documentCategoryStateList: BehaviorSubject<Array<documentCategory>>= new BehaviorSubject<Array<documentCategory>>([]);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  setGridApi(data) {
    this._gridApi.next(data);
 }

 getGridApi() {
   return this._gridApi.asObservable();
 }
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<DocumentType>,
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

  public fetchDocumentTypeData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_DOCUMENT_TYPE;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this.documentTypeStateList.next(response.documentTypes);
        this._store.dispatch(new saveDocumentTypeAction(response.documentTypes));
      }
      return response;
    });

  }
  saveDocumentType(documentTypeInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_DOCUMENT_TYPE;
    serviceConf.requestHeader = {};
    const payload: DocumentTypes = {
      documentTypeID: 0,
      documentCategoryID: documentTypeInfo.documentCategoryID,
      documentTypeName: documentTypeInfo.documentTypeName,
      documentCategoryName: documentTypeInfo.documentCategoryName
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchDocumentTypeData();
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
        headerName: 'Document Category Name',
        field: 'documentCategoryName',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 130,

    },{
        headerName: 'Document Type Name',
        field: 'documentTypeName',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,

    },


  {
    headerName: "",
    width: 100,
    cellRenderer: "editableCellRendererComponent",
    editable: false,
    deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.DocumentType, UI_CONSTANT.ACTIONS.DELETE),
      editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.DocumentType, UI_CONSTANT.ACTIONS.UPDATE),
    colId: "action"
  }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_DOCUMENT_TYPE+'/'+params.data.documentTypeID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.fetchDocumentTypeData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }
      else {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

   }
    updateStateOfCell(params){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_DOCUMENT_TYPE;
      serviceConf.requestHeader = {};
      const payload: DocumentTypes = params;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchDocumentTypeData();
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

    public fetchDocumentCategoryData(){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_APP_DATA+'/DocumentCategory';
      serviceConf.requestHeader = {};

      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response){
          // console.log("type",response.documentCategories);
          this.documentCategoryStateList.next(response.documentCategories);
          this._store.dispatch(new saveDocumentCategoryAction(response.documentCategories));
        }
        return response;
      });

    }
}
