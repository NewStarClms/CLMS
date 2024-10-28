import { Injectable } from '@angular/core';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { RemoteService } from '../common/remote.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { NotificationService } from '../common/notification.service';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { PayGroupModel } from '../store/model/pay-component.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PayGroupService {

  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visiblePolicyPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private notificationService: NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private router: Router
  ) { }
  setVisibility(val) {
    this._visiblePopup.next(val);
  }

  getVisiblity() {
    return this._visiblePopup.asObservable();
  }
  setPolicyVisibility(val) {
    this._visiblePolicyPopup.next(val);
  }

  getPolicyVisiblity() {
    return this._visiblePolicyPopup.asObservable();
  }
  getPayGroupList(): Observable<any> {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.GET_PAY_GROUP;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  getLeterTemplateList(): Observable<any> {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = this.remoteService.getCleanModulePath(PATH.GET_LETTER_TEMPLATE, UI_CONSTANT.MODULE_ID[2].value);
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  deletePayGroup(policyID: number){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.DELETE_PAY_GROUP+policyID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });
  }

  getCSVReport(data, fileName){
    this.appCoreCommonService.exportExcel(data, fileName);
  }

  prepareColumnDef() {
    const columnDefs: any[] = [
      {
        headerName: 'Name',
        field: 'policyName',
        filter: true,
        suppressSizeToFit: true,
        editable: false,
        sortable: true,

      },
      {
        headerName: 'Description',
        field: 'description',
        filter: true,
        editable: false,
        sortable: true,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Map Pay Component',
        field: 'mappingStatus',
        filter: true,
        suppressSizeToFit: true,
        editable: false,
        sortable: true,
      },
      {
        headerName: 'Map Organization',
        field: 'mappedOnOrganization',
        filter: true,
        suppressSizeToFit: true,
        editable: false,
        sortable: true,
        icons: true
      },
      {
        headerName: "Action",
        width: 80,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        colId: "action",
        editAllow: true,
        deleteAllow: true,
        policyOuMap: true,
        OrgUnitMap: true,
      }]
    return columnDefs;
  }
  prepareDefaultPayGroup() {
    const tempPaygroup = {} as PayGroupModel;
    tempPaygroup.allPayComponents = [];
    tempPaygroup.esiApplicable = false;
    tempPaygroup.bonusApplicable = false;
    tempPaygroup.policyID= 0;
    tempPaygroup.policyTypeID= 0;
    tempPaygroup.policyName= null;
    tempPaygroup.description= null;
    tempPaygroup.pfApplicable= false;
    tempPaygroup.esiApplicable= false;
    tempPaygroup.vpfApplicable= false;
    tempPaygroup.lwfApplicable= false;
    tempPaygroup.ptApplicable= false;
    tempPaygroup.leaveEncashmentApplicable= false;
    tempPaygroup.bonusApplicable= false;
    tempPaygroup.bonusSettingID= 0;
    tempPaygroup.gratuityApplicable= false;
    tempPaygroup.paidDaysFormula= null;
    tempPaygroup.salaryDaysFormula= null;
    tempPaygroup.minimumPaidDaysForSalaryProcess= 0;
    tempPaygroup.salarySlipTemplateID= 0;
    tempPaygroup.settlementSlipTemplateID= 0;
    tempPaygroup.taxSlipTemplateID= 0;
    tempPaygroup.reimbursementSlipTemplateID= 0;
    tempPaygroup.revisionLatterTemplateID= 0;
    tempPaygroup.appointmentLatterTemplateID= 0;
    tempPaygroup.contractSlipTemplateID= 0;
    return tempPaygroup;

  }
  getPayGroupByID(id) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.GET_DETAIL_PAY_GROUP + '/?policyID=' + id;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  SavePayGroupData(payGroupObj) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SAVE_PAY_GROUP;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = payGroupObj;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.setVisibility(false);
        this.router.navigate(['payroll/pay-group']);
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
  updatePayGroupData(payGroupObj) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.UPDATE_PAY_GROUP;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = payGroupObj;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.router.navigate(['payroll/pay-group']);
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }

  getPayComponentMappingInfo(policyid) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.GET_PAY_COM_MAPPING_DATA + '?policyID=' + policyid;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  updatePayComponentMappingInfo(payGroupObj) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.UPDATE_PAY_COM_MAPPING_DATA;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = payGroupObj;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.router.navigate(['payroll/pay-group']);
      } else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
}
