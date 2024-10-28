import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { RemoteService } from '../common/remote.service';
import { SaveReportSetupAction } from '../store/actions/report.action';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from '../common/notification.service';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { Router } from '@angular/router';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { SecureURLService } from './secure-url.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private activeModule$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private _store: Store<any>,
    private remoteService: RemoteService<any>,
    private notificationService: NotificationService,
    private router:Router,
    private secureURLService: SecureURLService
  ) { }

  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }
  setActiveModule(activeModule: any) {
    this.activeModule$.next(activeModule);
  }

  getActiveModule() {
    return this.activeModule$.asObservable();
  }

  fetchReportSetupData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_REPORT_SETUP;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        console.log(response, 'report');
        this._store.dispatch(new SaveReportSetupAction(response));
      }
      return response;
    });
  }
  fetchReportDetails(reportId, reportTypeId) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_REPORT_SETUP + '/' + reportId + '/' + reportTypeId;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  saveReportDetailColumn(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_REPORT_SETUP;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = params;
    this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(response=>{
      if (response.messageType === 0) {
        this.fetchReportSetupData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)         
        this.router.navigate(['reports/report-setup']);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });
  }

  updateReportDetailColumn(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_REPORT_SETUP;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = params;
  this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(response=>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)         
        this.fetchReportSetupData();
        this.router.navigate(['reports/report-setup']);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });;
  }

  fetchReportType(reportModuleID) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_REPORT_SETUP + '/reportType/' + reportModuleID;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
  getMappedColumns(typeId,reportID){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_REPORT_SETUP + '/'+reportID+'/'+ typeId;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();

  }

  downlodReport(payload){

  const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.GENERATE_REPORT;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf).subscribe(response => {
      console.log('ereeee',response);
      
      if (response && response.message) {
        if(payload.reportGenerateType === 'H'){
          // this.remoteService.httpHtmlGet(response.message,new HttpHeaders({})).subscribe(data =>{
          //   console.log(data);
          // });
          window.open(this.secureURLService.appendSecurityToken(response.message),'_blank', 'location=yes,height=900,width=900,scrollbars=yes,status=yes');
          // for html to pdf
          // var html = htmlToPdfmake(pdfTable.innerHTML);
          // const documentDefinition = { content: html };
          // pdfMake.createPdf(documentDefinition).download();
        } else {
          window.open(this.secureURLService.appendSecurityToken(response.message),'_blank');
        }
      } else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
    });
  }

//New Changes
  deleteReport(reportId, reportTypeId) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_REPORT_SETUP + '/' + reportId;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
          //this.fetchReportSetupData()
          this.fetchReportDetails(reportId, reportTypeId)
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
  //End

}