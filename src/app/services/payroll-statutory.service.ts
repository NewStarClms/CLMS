import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { ESISetting, GratuitySetting, LWFSetting, MinimumWagesSetting, PFSetting, PTSetting } from '../store/model/payroll-statutory.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollStatutoryService {
 public _pfSettingData:BehaviorSubject<PFSetting>=new BehaviorSubject<PFSetting>(null);
 public _esiSettingData:BehaviorSubject<ESISetting>=new BehaviorSubject<ESISetting>(null);
 public _lwfSettingData:BehaviorSubject<LWFSetting>=new BehaviorSubject<LWFSetting>(null);
 public _gratuitySettingData:BehaviorSubject<GratuitySetting>=new BehaviorSubject<GratuitySetting>(null);
 public _ptSettingData:BehaviorSubject<PTSetting>=new BehaviorSubject<PTSetting>(null);
 public _minwagesSettingData:BehaviorSubject<MinimumWagesSetting>=new BehaviorSubject<MinimumWagesSetting>(null);
 public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 public _visibleptPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 public _visibleminwagPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 setVisibility(val){
  this._visiblePopup.next(val);
  }

  getVisiblity(){
  return this._visiblePopup.asObservable();
  }
  setptVisibility(val){
    this._visibleptPopup.next(val);
    }
  
    getptVisiblity(){
    return this._visibleptPopup.asObservable();
    }
  setwagesmasterVisiblity(val){
    this._visibleminwagPopup.next(val);
  }
    
  getwagesmasterVisiblity(){
  return this._visibleminwagPopup.asObservable();
  }
  constructor(
    private remoteService: RemoteService<any>,
    private notificationService:NotificationService,
  ) { 
   
  }
  public fetchPFSettingData():Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.PF_SETTING;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.setting) {
        this._pfSettingData.next(response.setting)
        return response.setting;
      }
    });
    return this._pfSettingData.asObservable();
  }
  savePFSetting(pfsettingInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.PF_SETTING;
    serviceConf.requestHeader = {};
    const payload: PFSetting = pfsettingInfo;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchPFSettingData();
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
  public fetchESISettingData():Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.ESI_SETTING;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.setting) {
        this._esiSettingData.next(response.setting)
        return response.setting;
      }
    });
    return this._esiSettingData.asObservable();
  }
  saveESISetting(esisettingInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.ESI_SETTING;
    serviceConf.requestHeader = {};
    const payload: ESISetting = esisettingInfo;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchESISettingData();
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
  public fetchLWFSettingData():Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.LWF_SETTING;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response) {
        this._lwfSettingData.next(response)
        return response;
      }
    });
    return this._lwfSettingData.asObservable();
  }
  
  public prepareColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: 'State Name',
        field: 'stateName',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,

    },
    {
      headerName: 'LWF Deduction Rule',
      field: 'lwfDeductionRule',
      filter: true,
      suppressSizeToFit:true,
      editable: true,
      sortable: true,
      width: 130,
   //   cellEditorParams: UI_CONSTANT.PAYROLL.LWFDEDUCTIONRULE,
  },
  {
  headerName: 'Employee LWF',
  field: 'employeeLWF',
  filter: true,
  editable: true,
  sortable: true,
  width:170,

  },
  {
  headerName: 'LWF On Gross Salary',
  field: 'lwfOnGrossSalary',
  filter: true,
  suppressSizeToFit:true,
  editable: true,
  sortable: true,
  width:150,

  },
  {
    headerName: 'Prorate On Paid Days',
    field: 'prorateOnPaidDays',
    filter: true,
    suppressSizeToFit:true,
    sortable: true,
    },
    {
      headerName: 'Employer LWF',
      field: 'employerLWF',
      filter: true,
      suppressSizeToFit:true,
      sortable: true,
      },
      {
        headerName: 'Employee LWF Round',
        field: 'employeeLWFRound',
        filter: true,
        suppressSizeToFit:true,
        sortable: true,
        },
  {
    headerName: "",
    width: 100,
    colId: "action",
    editAllow:true
  }
    ]
    return columnDefs;
  }
  saveLWFSetting(lwfsettingInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.LWF_SETTING;
    serviceConf.requestHeader = {};
    const payload: LWFSetting = lwfsettingInfo;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.setVisibility(false);
        this.fetchLWFSettingData();
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  public fetchGratuitySettingData():Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.GRATUITY_SETTING;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.setting) {
        this._gratuitySettingData.next(response.setting)
        return response.setting;
      }
    });
    return this._gratuitySettingData.asObservable();
  }
  saveGratuitySetting(gratuitySettingInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.GRATUITY_SETTING;
    serviceConf.requestHeader = {};
    const payload: GratuitySetting = gratuitySettingInfo;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchGratuitySettingData();
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
  public prepareColumnForPTSettingGrid() {
    const columnDefsptSetting:any[] = [
      {
        headerName: 'State Name',
        field: 'stateName',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,

    },
    {
      headerName: 'PT On Arrear',
      field: 'ptOnArrear',
      filter: true,
      suppressSizeToFit:true,
      editable: true,
      sortable: true,
      width: 130,
  },

  {
    headerName: "",
    width: 100,
    colId: "action",
    editAllow:true
  }
    ]
    return columnDefsptSetting;
  }
  public prepareColumnForMinimumWagesGrid() {
    const columnDefsminimumwages:any[] = [
      {
        headerName: 'State Name',
        field: 'stateName',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,

    },
    
  {
    headerName: "",
    width: 100,
    colId: "action",
    editAllow:true
  }
    ]
    return columnDefsminimumwages;
  }
  public fetchPTSettingData():Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.PT_SETTING;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.settings) {
        this._ptSettingData.next(response.settings)
        return response.settings;
      }
    });
    return this._ptSettingData.asObservable();
  }
  saveptSetting(ptSettingInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.PT_SETTING;
    serviceConf.requestHeader = {};
    const payload: PTSetting = ptSettingInfo;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchPTSettingData();
        this.setptVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setptVisibility(true);
      }
      return response;
    });

  }
  public fetchminwagesSettingData():Observable<any>{
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.WAGES_MASTER;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response && response.settings) {
       // console.log(response.settings)
        this._visibleminwagPopup.next(response.settings)
        return response.settings;
      }
    });
    return this._visibleminwagPopup.asObservable();
  }
  saveminwagesSetting(wagesSettingInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.WAGES_MASTER;
    serviceConf.requestHeader = {};
    const payload: MinimumWagesSetting = wagesSettingInfo
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchminwagesSettingData();
        this.setwagesmasterVisiblity(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setwagesmasterVisiblity(true);
      }
      return response;
    });

  }
}
