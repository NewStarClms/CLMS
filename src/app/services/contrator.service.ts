import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveContractorAction } from '../store/actions/master.action';
import { Contractor } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class ContratorService {
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Contractor>,
    private notificationService: NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private router:Router,
    private userGroupService: UserGroupService
  ) { }

  public fetchContractorData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_CONTRACTOR;
    serviceConf.requestHeader = {};
    serviceConf.storeAction = "";
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        this._store.dispatch(new saveContractorAction(response.contractores));
        //console.log(response);
      }
      return true;
    });
    return true;
  }
  prepareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: 'Name',
        field: 'contractorName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        editable: false,
        sortable: true,
        pinned: true,
        width: 160,
        onCellValueChanged: function ($event) {
          console.log('event', $event);
        },
        valueSetter: params => {
          console.log('dds', params);
          params.data.contractorName = params.newValue;
          return true;
        }
      },
      {
        headerName: 'Code',
        field: 'contractorCode',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 120,
        onCellValueChanged: function ($event) {
          console.log('event', $event);
        },
        valueSetter: params => {
          console.log('dds', params);
          params.data.contractorCode = params.newValue;
          return true;
        }
      },
      {
        headerName: 'Address',
        field: 'contractorAddress',
        filter: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 190,
        onCellValueChanged: function ($event) {
          console.log('event', $event);
        },
        valueSetter: params => {
          console.log('dds', params);
          params.data.contractorAddress = params.newValue;
          return true;
        }
      },
      {
        headerName: 'Phone',
        field: 'phone',
        filter: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 125,
        onCellValueChanged: function ($event) {
          console.log('event', $event);
        },
        valueSetter: params => {
          console.log('dds', params);
          params.data.phone = params.newValue;
          return true;
        }
      },
      {
        headerName: 'Email',
        field: 'email',
        filter: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 235,
        onCellValueChanged: function ($event) {
          console.log('event', $event);
        },
        valueSetter: params => {
          console.log('dds', params);
          params.data.email = params.newValue;
          return true;
        }
      },
      {
        headerName: "",
        minWidth: 0,
        cellRenderer: "editableCellRendererComponent",
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Contractor, UI_CONSTANT.ACTIONS.DELETE),
        editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Contractor, UI_CONSTANT.ACTIONS.UPDATE),
        editable: false,
        colId: "action"
      }
    ]
    return columnDefs;
  }
  saveContractor(contractorInfo, contractorLicInfo) {
    console.log(contractorInfo);

    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_CONTRACTOR;
    serviceConf.requestHeader = {};
    const payload: Contractor =
    {
      contractorID: 0,
      contractorCode: contractorInfo.contractorCode,
      contractorName: contractorInfo.contractorName,
      shortName: contractorInfo.shortName,
      contractorAddress: contractorInfo.contractorAddress,
      countryID: contractorInfo.countryID,
      stateID: contractorInfo.stateID,
      cityID: contractorInfo.cityID,
      pinCode: contractorInfo.pinCode,
      phone: contractorInfo.phone,
      email: contractorInfo.email,
      fax: contractorInfo.fax,
      webSite: contractorInfo.webSite,
      contractorLogo: contractorInfo.contractorLogo,
      panNo: contractorInfo.panNo,
      tanNo: contractorInfo.tanNo,
      gstNo: contractorInfo.gstNo,
      pfNo: contractorInfo.pfNo,
      esiNo: contractorInfo.esiNo,
      licenseNo: contractorInfo.licenseNo,
      registrationNo: contractorInfo.registrationNo,
      contractorLogoID:contractorInfo.contractorLogoID,
      contractorLicenses: [contractorLicInfo]
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, 'Success')
        this.fetchContractorData();
        this.router.navigate(['/master/contractor']);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
        this.router.navigate(['/add-edit-contractor/' + contractorInfo.contractorID]);
      }
      return response;
    });

  }
  deleteCellFromRemote(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_CONTRACTOR + '/' + params.data.contractorID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchContractorData();
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
      }
      return response;
    });

  }
  updateStateOfCell(params,params1) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_CONTRACTOR;
    serviceConf.requestHeader = {};
    const payload: Contractor = {
      contractorID: params.contractorID,
      contractorCode: params.contractorCode,
      contractorName: params.contractorName,
      shortName: params.shortName,
      contractorAddress: params.contractorAddress,
      countryID: params.countryID,
      stateID: params.stateID,
      cityID: params.cityID,
      pinCode: params.pinCode,
      phone: params.phone,
      email: params.email,
      fax: params.fax,
      webSite: params.webSite,
      contractorLogo: params.contractorLogo,
      panNo: params.panNo,
      tanNo: params.tanNo,
      gstNo: params.gstNo,
      pfNo: params.pfNo,
      esiNo: params.esiNo,
      licenseNo: params.licenseNo,
      registrationNo: params.registrationNo,
      contractorLogoID:params.contractorLogoID,
      contractorLicenses: params.contractorLicenses
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchContractorData();
        this.router.navigate(['/master/contractor']);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.router.navigate(['/add-edit-contractor/' + params.data.contractorID]);
      }
      return response;
    });
  }
  getCSVReport(data, fileName){
    this.appCoreCommonService.exportExcel(data,fileName);
  }
  
}

