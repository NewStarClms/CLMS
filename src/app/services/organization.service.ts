import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveOrganizationAction } from '../store/actions/master.action';
import { selectOrganizationState, selectBusinessTypeState } from '../store/app.state';
import { City, Organization, BusinessType } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { BusinessTypeService } from './business-type.service';
import { AppCoreCommonService } from './app.core-common.services';
import { AppUtil } from '../common/app-util';
import { BehaviorSubject } from 'rxjs';
import { Menu } from '../store/model/usermanage.model';
import { UserGroupService } from './user-group.service';


@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
defaultColDef: { suppressSizeToFit: boolean; };
colResizeDefault: string;

organizationList:Array<Organization>;
public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  menuItems: Array<Menu>=[];
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Organization>,
    private notificationService:NotificationService,
    private userGroupService: UserGroupService,
    private businessTypeService:BusinessTypeService,
    private appCoreCommonService: AppCoreCommonService
  ) {this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }

  public fetchOrganizationData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_ORGANIZATION;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this.organizationList = response.organizationes;
        this._store.dispatch(new saveOrganizationAction(response.organizationes));
      }
      return response;
    });

  }
  saveOrganization(organizationInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_ORGANIZATION;
    serviceConf.requestHeader = {};
    const payload: Organization = {
      organizationID: 0,
      organizationCode: organizationInfo.organizationCode,
      organizationName: organizationInfo.organizationName,
      organizationAddress: organizationInfo.organizationAddress,
      email: organizationInfo.email,
      countryID: organizationInfo.countryID,
      stateID: organizationInfo.stateID,
    cityID: organizationInfo.cityID,
    pinCode: organizationInfo.pinCode,
      phone: organizationInfo.phone,
      fax: organizationInfo.fax,
      webSite: organizationInfo.webSite,
      organizationLogo: organizationInfo.organizationLogo,
      OrganizationLogoID:organizationInfo.OrganizationLogoID,
    businessTypeID: organizationInfo.businessTypeID
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
         this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchOrganizationData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
        this.setVisibility(true);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: 'Code',
        field: 'organizationCode',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        sortable: true,
        width: 100
    },
    {
      headerName: 'Name',
      field: 'organizationName',
      filter: true,
      autoHeight: true,
      suppressSizeToFit:true,
      sortable: true,
      width: 130
  },

  {
    headerName: 'Address',
    field: 'organizationAddress',
    filter: true,
    autoHeight: true,
    suppressSizeToFit:true,
    sortable: true,
    width: 130
},
{
  headerName: 'Email',
  field: 'email',
  filter: true,
  autoHeight: true,
  suppressSizeToFit:true,
  sortable: true,
  width: 130
},
{
  headerName: 'Pincode',
  field: 'pinCode',
  filter: true,
  autoHeight: true,
  suppressSizeToFit:true,
  sortable: true,
  width: 130
},
{
  headerName: 'Business Type',
  field: 'businessTypeID',
  filter: true,
  autoHeight: true,
  cellEditorParams:'businessType',
  sortable: true,
  width: 200,
  cellEditor: 'agSelectCellEditor',
},

  {
  headerName: "",
  minWidth: 0,
  cellRenderer: "editableCellRendererComponent",
  editable: false,
  deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Organization, UI_CONSTANT.ACTIONS.DELETE),
  editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Organization, UI_CONSTANT.ACTIONS.UPDATE),
  colId: "action"
   }
  ]
  return columnDefs;
  
}

deleteCellFromRemote(params){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.DELETE;
  serviceConf.path = PATH.FETCH_ORGANIZATION+'/'+params.data.organizationID;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
    if (response.messageType === 0) {
      this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      this.fetchOrganizationData();
    }else {
      this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
    }
    return response;
  });

 }
  updateStateOfCell(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_ORGANIZATION;
    serviceConf.requestHeader = {};
    const payload: Organization = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
         this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchOrganizationData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
        this.setVisibility(true);
      }
      return response;
    });
  }

  fetchOrganizationById(id){
    let organization = null;
    this._store.select(selectOrganizationState).subscribe(data =>{
      if(data && data.organizationList){
       const organizationList= AppUtil.deepCopy(data.organizationList);
       organization = organizationList.filter(item => item.organizationID === id)[0].organizationName;
      }
    });
    return organization;
  }


  getCSVReport(data, fileName){
    this.appCoreCommonService.exportExcel(data, fileName);
  }

}
