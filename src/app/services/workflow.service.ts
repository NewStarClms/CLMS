import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RemoteService } from '../common/remote.service';
import { NotificationService } from '../common/notification.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { SaveWorkflowRuleAction } from '../store/actions/workflow.action';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { RuleLevelMapping, WorkflowRule } from '../store/model/workflow.model';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { organizationMapping } from '../store/model/master-data.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class WorkflowService {
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private notificationService: NotificationService,
    private router: Router
    ) {
    }
    setVisibility(val){
      this._visiblePopup.next(val);
    }
  
    getVisiblity(): Observable<any> {
      return this._visiblePopup.asObservable();
    }
    getWorkflowList(moduleId) {
        const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = this.remoteService.getCleanModulePath(PATH.FETCH_WORKFLOW,moduleId);
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf);
    }

    fetchWorkflowRule(moduleId:number,workflowId:number,workflowRuleId:number,workflowModuleId:number){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = this.remoteService.getCleanModulePath(PATH.FETCH_WORKFLOW_RULE,moduleId)+ workflowId + '/'+ workflowRuleId + '/'+ workflowModuleId;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf).subscribe(data=>{
        if(data && data.workFlowRules){
          console.log('data.workFlowRules',data.workFlowRules)
          this._store.dispatch(new SaveWorkflowRuleAction(data.workFlowRules));
        }
      });
    }

    saveWorkflowRule(workflowRuleObj: WorkflowRule,moduleId){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = this.remoteService.getCleanModulePath(PATH.ADD_WORKFLOW_RULE,moduleId);
      serviceConf.requestHeader = {};
      serviceConf.payloadObjects = workflowRuleObj;
      const moduleName= UI_CONSTANT.MODULE_ID.filter(x=>x.value === moduleId)[0].path;
      this.remoteService.httpServiceRequest(serviceConf).subscribe(response=>{
        if(response.messageType === 0){
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
         this.fetchWorkflowRule(moduleId,0,0,0);
         this.router.navigate(['/'+moduleName+'/workflow-detail']);
       } else{
         this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
       }
       return response;
      });
    }
    updateWorkflowRule(workflowRuleObj: WorkflowRule,moduleId){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = this.remoteService.getCleanModulePath(PATH.UPDATE_WORKFLOW_RULE,moduleId);;
      serviceConf.requestHeader = {};
      serviceConf.payloadObjects = workflowRuleObj;
      const moduleName= UI_CONSTANT.MODULE_ID.filter(x=>x.value === moduleId)[0].path;
      this.remoteService.httpServiceRequest(serviceConf).subscribe(response=>{
        if(response.messageType === 0){
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
         this.fetchWorkflowRule(moduleId,0,0,0);
         this.router.navigate(['/'+moduleName+'/workflow-detail']);
       } else{
         this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
       }
       return response;
      });
    }

    fetchPolicyMappingDetail(ruleID:number,workflowID:number,moduleId:number):Observable<any>{
      const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path = this.remoteService.getCleanModulePath(PATH.GET_WORKFLOW_OU_MAPPING,moduleId)+'?ruleId='+ruleID+'&workFlowID='+workflowID;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
    }

    perpareColumnForGrid() {
        const columnDefs:any[] = [
          {
            headerName: 'Rule Name',
            field: 'workFlowRuleName',
            filter: true,
            autoHeight: true,
            suppressSizeToFit:true,
            editable: true,
            sortable: true,
            width: 720,
          },
           {
            headerName: 'Description',
            field: 'description',
            filter: true,
            autoHeight: true,
            suppressSizeToFit:true,
            editable: true,
            sortable: true,
            width: 720,
          },          
          {
            headerName: 'Number Of Level',
            field: 'numberOfLevel',
            filter: true,
            autoHeight: true,
            suppressSizeToFit:true,
            editable: true,
            sortable: true,
            width: 720,
          },
           {
             headerName: "",
             minWidth: 315,
             cellRenderer: "editableCellRendererComponent",
             editable: false,
             editAllow: true,
             deleteAllow: true,
             colId: "action",
             policyOuMap:true
           }
             ]
             return columnDefs;
           }


  deleteCellFromRemote(params,moduleId){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = this.remoteService.getCleanModulePath(PATH.DELETE_WORKFLOW_RULE,moduleId)+params.data.workFlowID+'/'+params.data.workFlowRuleID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
        this.fetchWorkflowRule(moduleId,0,0,0);
         this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
      }
      return response;
    });
  }       
  updateStateOfCell(params){

  }

  prepareRuleMappingData(mappingArr){
    const ruleLevelMappings:RuleLevelMapping = {
            workFlowRuleID: 1,
            levelNumber: mappingArr.length +1,
            userRoleID: 1,
            employeeID: 0,
            dueDay: 1,
            tat: 0,
            identifier:null,
            intimationOnly: false
          };
  return ruleLevelMappings;
  }

  SaveOrgnaizationMapping(params,moduleId){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = this.remoteService.getCleanModulePath(PATH.UPDATE_WORKFLOW_OU_MAPPING,moduleId);
    serviceConf.requestHeader = {};
    const payload: organizationMapping = params;
    serviceConf.payloadObjects = {
      policyID: params.policyID,
      policyTypeID: params.policyTypeID,
      workFlowID: params.workFlowID,
      organizationKeyID: params.organizationKeyID,
      locationKeyID: params.locationKeyID,
      organization: params.organization,
      location: params.location 
    };
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchWorkflowRule(1,0,0,0);
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
}
