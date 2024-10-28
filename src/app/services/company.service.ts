import { Injectable } from '@angular/core';
import { Company } from '../store/model/master-data.model';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { Store } from '@ngrx/store';
import { saveCompanyAction } from '../store/actions/master.action';
import { ColDef, GridApi } from 'ag-grid-community';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { OrganizationService } from './organization.service';
import { BehaviorSubject } from 'rxjs';
import { selectCompanyState } from '../store/app.state';
import { AppCoreCommonService } from './app.core-common.services';
import { Router } from '@angular/router';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
defaultColDef: { suppressSizeToFit: boolean; };
colResizeDefault: string;
private gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
companyStateList: BehaviorSubject<Array<Company>>= new BehaviorSubject<Array<Company>>([]);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Company>,
    private notificationService: NotificationService,
    private organizationService: OrganizationService,
    private appCoreCommonService: AppCoreCommonService,
    private router: Router,
    private userGroupService: UserGroupService
  ) {

   }

  public fetchCompanyData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_COMPANY;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this.companyStateList.next(response.companyes);
        this._store.dispatch(new saveCompanyAction(response.companyes));
      }
      return true;
    });
    return true;
  }
  saveCompany(companyInfo){
    console.log(companyInfo)
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_COMPANY;
    serviceConf.requestHeader = {};
    const payload: Company = {
      companyID: 0,
      organizationID: companyInfo.organizationID,
      companyCode: companyInfo.companyCode,
      companyName: companyInfo.companyName,
      shortName: companyInfo.shortName,
      companyAddress: companyInfo.companyAddress,
      countryID: companyInfo.countryID,
      stateID: companyInfo.countryID,
      cityID: companyInfo.cityID,
      pinCode: companyInfo.pinCode,
      phone: companyInfo.phone,
      email: companyInfo.email,
      fax: companyInfo.fax,
      webSite: companyInfo.webSite,
      companyLogoID: companyInfo.companyLogoID,
      companyLogoUrl:companyInfo.companyLogoUrl,
      panNo: companyInfo.panNo,
      tanNo: companyInfo.tanNo,
      gstNo: companyInfo.gstNo,
      pfNo: companyInfo.pfNo,
      esiNo: companyInfo.esiNo,
      licenseNo: companyInfo.licenseNo,
      registrationNo: companyInfo.registrationNo,
      viewNameOnReport: companyInfo.viewNameOnReport,
      viewLogoOnReport: companyInfo.viewLogoOnReport,
      viewAddressOnReport: companyInfo.viewAddressOnReport
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchCompanyData();
        this.router.navigate(['/master/company']);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.router.navigate(['/add-edit-company/' + companyInfo.companyID]);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs:any[] = [

      {
        headerName: 'Company Name',
        field: 'companyName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 190,
        onCellValueChanged: function ($event) {
          console.log('event',$event);
        },
        valueSetter: params => {
          console.log('dds',params);
          params.data.companyName = params.newValue;
          return true;
      }
    },
    {
      headerName: 'Code',
      field: 'companyCode',
      filter: true,
      autoHeight: true,
      suppressSizeToFit:true,
      editable: false,
      sortable: true,
      width: 140,
      onCellValueChanged: function ($event) {
        console.log('event',$event);
      },
      valueSetter: params => {
        console.log('dds',params);
        params.data.companyCode = params.newValue;
        return true;
    }
  },
  {
  headerName: 'Company Address',
  field: 'companyAddress',
  filter: true,
  suppressSizeToFit:true,
  editable: true,
  sortable: true,
  width:215,
  onCellValueChanged: function ($event) {
    console.log('event',$event);
  },
  valueSetter: params => {
    console.log('dds',params);
    params.data.companyAddress = params.newValue;
    return true;
}
},
{
  headerName: 'Short Name',
  field: 'shortName',
  filter: true,
  suppressSizeToFit:true,
  editable: true,
  sortable: true,
  width:135,
  onCellValueChanged: function ($event) {
    console.log('event',$event);
  },
  valueSetter: params => {
    console.log('dds',params);
    params.data.shortName = params.newValue;
    return true;
}
},
{
  headerName: 'Organization',
  field: 'organizationID',
  filter: true,
  width:155,
  cellEditorParams: 'organization'
},
  {
  headerName: "",
  minWidth: 0,
  cellRenderer: "editableCellRendererComponent",
  editable: false,
  deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Company, UI_CONSTANT.ACTIONS.DELETE),
  editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Company, UI_CONSTANT.ACTIONS.UPDATE),
  colId: "action"
   }
  ]
  return columnDefs;
}
deleteCellFromRemote(params){
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.DELETE;
  serviceConf.path = PATH.FETCH_COMPANY+'/'+params.data.companyID;
  serviceConf.requestHeader = {};
  this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
    if (response.messageType === 0) {
      this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      this.fetchCompanyData();
    }else {
      this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
    }
    return response;
 });

 }
  updateStateOfCell(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_COMPANY;
    serviceConf.requestHeader = {};
    const payload: Company = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchCompanyData();
        this.router.navigate(['/master/company']);
      }else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.router.navigate(['/add-edit-company/' + params.data.companyID]);
      }
      return response;
    });
  }
  fetchStateCompanyDataByID(companyid){
    let companyObj: any= null;
    this._store.select(selectCompanyState).subscribe(data =>{
      let companyStateList= data.companyList;
      console.log('obj-',this.companyStateList);
      if(companyStateList){
        companyObj = companyStateList.filter(item=> item.companyID === companyid)[0];
    }
    });

    console.log('obj',companyObj);
    return (companyObj)?companyObj:false;
  }
  getCompanyDropdownOptionList(action:string){
    let dropDownOption: Array<any> = [];
    let key = 'companyID';
    if(action === 'company'){
      const stateList:Array<Company> = this.companyStateList.getValue();
      stateList.map(x => {
        dropDownOption.push({
          companyID: x.companyID,
          companyName: x.companyName
        })
      });
    }

    const arrayUniqueByKey = [...new Map(dropDownOption.map(item =>
      [item[key], item])).values()];
    return arrayUniqueByKey;
  }


  getCSVReport(data, fileName) {
    this.appCoreCommonService.exportExcel(data, fileName);
  }

}
