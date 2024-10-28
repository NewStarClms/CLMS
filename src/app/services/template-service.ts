import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpMethod } from "../common/constants/http-method.constants";
import { PATH } from "../common/constants/service-path.constants";
import { UI_CONSTANT } from "../common/constants/ui-constants";
import { NotificationService } from "../common/notification.service";
import { RemoteService } from "../common/remote.service";
import { AlertTemplate, LetterTemplate } from "../store/model/alert-template.model";
import { ServiceConfig } from "../store/model/serviceConfig.model";
import { AppCoreCommonService } from './app.core-common.services';

@Injectable({
    providedIn: 'root'
  })
  export class TemplateService {

    currentTemplate: BehaviorSubject<AlertTemplate>= new BehaviorSubject<AlertTemplate>(null);
    currentLetterTemplate: BehaviorSubject<LetterTemplate>= new BehaviorSubject<LetterTemplate>(null);
    selectedWorkflowModuleID: BehaviorSubject<number>= new BehaviorSubject<number>(null);

    constructor(
        private remoteService: RemoteService<any>,
        private _store: Store<any>,
        private notificationService: NotificationService,
        private router: Router,
        private appCoreCommonService: AppCoreCommonService
        ) {}

    setCurrentTemplate(template) {
        this.currentTemplate.next(template);
    }
    
    getCurrentTemplate() {
        return this.currentTemplate.asObservable();
    }
    setSelectedWorkflowModuleID(id) {
        this.selectedWorkflowModuleID.next(id);
    }
    
    getSelectedWorkflowModuleID() {
        return this.selectedWorkflowModuleID.asObservable();
    }
    
    setCurrentLetterTemplate(template) {
        this.currentLetterTemplate.next(template);
    }
    
    getCurrentLetterTemplate() {
        return this.currentLetterTemplate.asObservable();
    }

    getAlertTemplateList(moduleID:number,workflowID:number=0) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = this.remoteService.getCleanModulePath(PATH.FETCH_ALERT_TEMPLATE, moduleID);
      if(workflowID>0){
        serviceConf.path = this.remoteService.getCleanModulePath(PATH.FETCH_ALERT_TEMPLATE, moduleID)+"?workFlowID="+workflowID;
      }
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf);
    }

    getTags(tagTypeID, workflowID:number=0) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_ALERT_TAGS + tagTypeID+"/"+workflowID;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf);
    }

    saveAlertTemplate(template:AlertTemplate,moduleID:number){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.PUT;
        serviceConf.path = this.remoteService.getCleanModulePath(PATH.UPDATE_ALERT_TEMPLATE,moduleID);
        serviceConf.payloadObjects=template;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
            if (response.messageType === 0) {
              this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
             
            }else {
              this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            }
            return response;
          }));
    }

    getTemplateType(moduleID:number) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = PATH.FETCH_TEMPLATE_TYPE+ moduleID;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf);
    }

     getLetterTemplateList(moduleID:number,templateTypeID:number) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        // const moduleName= UI_CONSTANT.MODULE_ID.filter(x=>x.value === moduleID)[0].key;
        // const pathVar= PATH.GET_LETTER_TEMPLATE.replace('{0}',moduleName);
        serviceConf.path = this.remoteService.getCleanModulePath(PATH.GET_LETTER_TEMPLATE,moduleID)+'?templateTypeID=' + templateTypeID;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf);
    }

    deleteLetterTemplateList(params) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.DELETE;
        serviceConf.path = PATH.DELETE_LETTER_TEMPLATE + '/' + params.data.templateID;
        serviceConf.requestHeader = {};
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
            if (response.messageType === 0) {
              this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
             
            }else {
              this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            }
            return response;
          });
    }

    saveLetterTemplate(template:LetterTemplate,moduleID:number){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path = this.remoteService.getCleanModulePath(PATH.SAVE_LETTER_TEMPLATE,moduleID);
        serviceConf.payloadObjects=template;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
            if (response.messageType === 0) {
              this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
             
            }else {
              this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            }
            return response;
        }));
    }

    prepareColumnForGrid() {
        const columnDefs: any[] = [
         {
            headerName: 'Alert',
            field: 'alertName',
            filter: true,
            sortable: true,
            suppressSizeToFit: true,
          }, 
          {
            headerName: 'Workflow',
            field: 'workFlowName',
            filter: true,
            sortable: true,
            suppressSizeToFit: true,
          },
          {
            headerName: 'Status',
            field: 'statusName',
            filter: true,
            suppressSizeToFit: true,
            sortable: true,
          },
          {
            headerName: 'Subject',
            field: 'alertSubject',
            filter: true,
            suppressSizeToFit: true,
            sortable: true,
          },
          {
            headerName: 'Alert?',
            field: 'enableAlert',
            filter: true,
            sortable: true,
            suppressSizeToFit: true,
          },
          {
            headerName: 'Email?',
            field: 'enableMail',
            filter: true,
            sortable: true,
            suppressSizeToFit: true,
          },
          {
            headerName: 'SMS?',
            field: 'enableSMS',
            filter: true,
            sortable: true,
            suppressSizeToFit: true,
          }, 
          {
            headerName: 'Active',
            field: 'active',
            filter: true,
            sortable: true,
            suppressSizeToFit: true,
          }, 
          {
            headerName: "",
            colId: "action",
            actionModeOn: true,
            hideData: true,
            editAllow: true,
            suppressSizeToFit: true,
            dashboardSetting:true
          }
        ]
        return columnDefs;
      }

      prepareColumnForLetterGrid() {
        const columnDefs: any[] = [
         {
            headerName: 'Template Type',
            field: 'templateTypeName',
            filter: true,
            sortable: true,
            suppressSizeToFit: true,
          }, 
          {
            headerName: 'Template',
            field: 'templateName',
            filter: true,
            sortable: true,
            suppressSizeToFit: true,
          },
          {
            headerName: 'Subject',
            field: 'templateSubject',
            filter: true,
            suppressSizeToFit: true,
            sortable: true,
          },
          {
            headerName: 'Print/Page',
            field: 'printPerPage',
            filter: true,
            suppressSizeToFit: true,
            sortable: true,
          },
          {
            headerName: "",
            colId: "action",
            actionModeOn: true,
            hideData: true,
            editAllow: true,
            deleteAllow:true,
            suppressSizeToFit: true,
          }
        ]
        return columnDefs;
      }
 
  }