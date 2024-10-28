import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveTagMasterAction } from '../store/actions/appData.action';
import {  saveVisitorPassTemplateAction } from '../store/actions/master.action';
import { TagMaster } from '../store/model/appData.model';
import { VisitorPassTemplate } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';

@Injectable({
  providedIn: 'root'
})
export class VisitorPassTemplateService {
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  visitorPassTemplateStateList: BehaviorSubject<Array<VisitorPassTemplate>>= new BehaviorSubject<Array<VisitorPassTemplate>>([]);
  tagMasterStateList:BehaviorSubject<Array<TagMaster>>= new BehaviorSubject<Array<TagMaster>>([]);
  private _visitorPassDetail:BehaviorSubject<VisitorPassTemplate> = new BehaviorSubject<VisitorPassTemplate>(null);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<VisitorPassTemplate>,
    private notificationService:NotificationService,
    private appCoreCommonService:AppCoreCommonService,
    private router: Router,
  ) {
    
  }
  public fetchVisitorPassTemplateData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_VISITOR_PASS_TEMPLATE;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        // console.log(response.visitorPassTemplates);
        this.visitorPassTemplateStateList.next(response.visitorPassTemplates);
        this._store.dispatch(new saveVisitorPassTemplateAction(response.visitorPassTemplates));
      }
      return response;
    });

  }
  saveVisitorPassTemplate(visitorpassInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_VISITOR_PASS_TEMPLATE;
    serviceConf.requestHeader = {};
    const payload: VisitorPassTemplate = {
      templateID: 0,
      templateName: visitorpassInfo.templateName,
      subject: visitorpassInfo.subject,
      template: visitorpassInfo.template,
      alert: visitorpassInfo.alert,
      mail: visitorpassInfo.mail,
      gatePass: visitorpassInfo.gatePass,
      sms: visitorpassInfo.sms,
      sendToVisitor: visitorpassInfo.sendToVisitor,
      sendToGateUser: visitorpassInfo.sendToGateUser,
      sendToEmployee: visitorpassInfo.sendToEmployee,
      requestStatusID: visitorpassInfo.requestStatusID
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchVisitorPassTemplateData();
        this.router.navigate(['/master/visitor-pass-template']);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.router.navigate(['/add-edit-visitor-template/' + visitorpassInfo.templateID]);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: 'Template Name',
        field: 'templateName',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,

    },
    {
      headerName: 'Subject',
      field: 'subject',
      filter: true,
      suppressSizeToFit:true,
      editable: true,
      sortable: true,
      width: 130,

  },
  {
    headerName: "",
    width: 100,
    cellRenderer: "editableCellRendererComponent",
    editable: false,
    deleteAllow: true,
      editAllow: true,
    colId: "action"
  }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_VISITOR_PASS_TEMPLATE+'/'+params.data.templateID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.fetchVisitorPassTemplateData();
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
      serviceConf.path = PATH.FETCH_VISITOR_PASS_TEMPLATE;
      serviceConf.requestHeader = {};
      const payload: VisitorPassTemplate = params;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchVisitorPassTemplateData();
          this.router.navigate(['/master/visitor-pass-template']);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.router.navigate(['/add-edit-visitor-template/' + params.data.templateID]);
        }
        return response;
      });
    }
    
    getCSVReport(data, fileName){
      this.appCoreCommonService.exportExcel(data, fileName);
    }
    public fetchTagMasterData(){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_APP_DATA+'/Tag/3/1';
      serviceConf.requestHeader = {};
  
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response){
          // console.log('tagMaster',response.tagList);
          this.tagMasterStateList.next(response.tagList);
          this._store.dispatch(new saveTagMasterAction(response.tagList));
        }
        return response;
      });
  
    }
    fetchVisitorPassTemplateDetail(id,visitorLogId):Observable<any>{
      const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_VISITOR_PASS_TEMPLATE+'/'+id+'/'+visitorLogId;
        serviceConf.requestHeader = {};
    
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
          if(response && response.gatePass){
            //console.log(response)
             this._visitorPassDetail.next(response.gatePass)
             return response.gatePass;
          }
        });
        return this._visitorPassDetail.asObservable();
    }
}
