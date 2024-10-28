import { Component, Input, OnInit } from '@angular/core';
import { RemoteService } from '../../../common/remote.service';
import { WorkflowService } from '../../../services/workflow.service';
import { AppUtil } from '../../../common/app-util';
import { map } from 'rxjs/operators';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { Store } from '@ngrx/store';
import { selectBranchState, selectCategoryState, selectCompanyState, selectDepartmentState, selectDesignationState, selectEmployeeMasterState, selectGradeState, selectLevelState, selectOrganizationState, selectSectionState, selectWorkflowRuleState } from '../../../store/app.state';
import { ConfirmationService } from 'primeng/api';
import { Branch, Category, Designation, Grade, organizationMapping, SubDepartment, Department, Contractor, Company, Level, Section, Organization } from 'src/app/store/model/master-data.model';
import { Router } from '@angular/router';
import { Workflow, WorkFlowRequest } from 'src/app/store/model/workflow.model';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { selectSubDepartmentState, selectContractorState } from 'src/app/store/app.state';
import { AuthService } from 'src/app/services/authentication.service';
import { AppCoreCommonService } from '../../../services/app.core-common.services';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {
  workflowOptionList:Array<{key:string; value:number}> = [];
  requestTypeList: Array<WorkFlowRequest> = [];
  rowData: Array<any> = [];
  columnDefs: Array<any> = [];
  public orgnaizationMappingInfo: organizationMapping = {} as organizationMapping;
  public orgUnitList = UI_CONSTANT.ORGANIZATIONLIST;
  public locationList = UI_CONSTANT.LOCATIONLIST;
  public selectedLocation: Array<number>;
  public selectedOrganiztion: Array<number>;
  public orgDataUnitList =[];
  public locationDataList: Array<any> = [];
  public displayOUMap = false;
  public workflowList:Array<Workflow> = []; 
  public workflowObj:{
    workFlowID: number,
    workFlowModuleID: number  }= {workFlowID: 1, workFlowModuleID: 1
    };
    moduleID:number;
  @Input() moduleId: number;
  constructor(
    private workflowService: WorkflowService,
    private _store: Store<any>,
    private confirmationService: ConfirmationService,
    private router: Router,
    private authenticationService:AuthService,
    public appCoreCommonService:AppCoreCommonService
  ) { 
    
  }

  ngOnInit(): void {
    this.moduleID = this.moduleId;
    this.authenticationService.setGlobalFilterVisibility(false);
    this.workflowService.getVisiblity().subscribe(res=>{
        this.displayOUMap = res;
    });
    this.workflowObj.workFlowID= 1;
    this.columnDefs = this.workflowService.perpareColumnForGrid();
    this.workflowOptionList = [];
    this.workflowService.fetchWorkflowRule(this.moduleID,0,0,0);
    this._store.select(selectWorkflowRuleState).subscribe(data =>{
      if(data && data.workflows){
        console.log(data.workflows, 'data');
        const tempData= AppUtil.deepCopy(data.workflows);
        this.rowData = tempData.filter(x=> x.workFlowID==this.workflowObj.workFlowID);
        
        console.log(this.rowData, 'datarow');

      } 
    });
    this.workflowService.getWorkflowList(this.moduleID).subscribe(flowList => {
      if(flowList.workFlows){
        this.workflowList = AppUtil.deepCopy(flowList.workFlows);
        this.workflowList.map(y => {
          this.workflowOptionList.push({
            key: y.workFlowModuleName,
            value: y.workFlowModuleID
          });
        });
        this.prepareRequestType(1);
      }
    });
   
  }
getRequesTypeList(e){
this.prepareRequestType(e);
}
  prepareRequestType(modid){
    this.requestTypeList = [];
    console.log(this.workflowObj, 'and', this.workflowOptionList);
    this.workflowObj.workFlowModuleID = modid;
    this.requestTypeList = this.workflowList.filter(c=>c.workFlowModuleID === this.workflowObj.workFlowModuleID)[0].workFlows;
    console.log(this.requestTypeList);
    
  }
  getWorkflowData(){
    console.log(this.workflowObj,'obj-111');
    const moduleID:number= UI_CONSTANT.MODULE_ID[0].value;
    const workflowId:number= this.workflowObj.workFlowID;
    const workflowRuleId:number=0;
    const workflowModuleId:number=0;
    this.workflowService.fetchWorkflowRule(this.moduleID,this.workflowObj.workFlowID,0,this.workflowObj.workFlowModuleID);
  }
  
  addNew(){
    this.router.navigate(['/master/add-edit-workflow/'+this.moduleID+'/0']);
  }

  exportGridData(){
    
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.router.navigate(['/master/add-edit-workflow/' +this.moduleID+'/'+ params.data.workFlowRuleID]);
      }
      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item) => item.workFlowRuleID == params.data.workFlowRuleID);
            temdata.splice(index, 1);
            this.workflowService.deleteCellFromRemote(params,this.moduleID);
            this.rowData = temdata;

          },
          reject: (type) => {
            switch (type) {
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                // this.notificationService.showError('Comfirmation Rejected', null);
                break;
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                // this.notificationService.showWarning('Comfirmation Canceled');
                break;
            }
          }
        });
      }
      
      if (action === UI_CONSTANT.ACTIONS.UPDATE) {
        params.api.stopEditing(false);
        console.log('update', params);
        this.workflowService.updateStateOfCell(params);
      }

      if (action === UI_CONSTANT.ACTIONS.CANCEL) {
        params.api.stopEditing(true);
      }
      if (action === UI_CONSTANT.ACTIONS.MAPOU) {
        this.orgDataUnitList = [];
        this.locationDataList = [];
        this.orgnaizationMappingInfo.workFlowID = params.data.workFlowID;
        this.workflowService.fetchPolicyMappingDetail(params.data.workFlowRuleID,params.data.workFlowID,this.moduleID).subscribe(res => {
          if (res) {
            this.workflowService.setVisibility(true);
            this.orgnaizationMappingInfo = res.mapping;
            this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(res.mapping.organizationKeyID);
            this.locationDataList = this.appCoreCommonService.preparelocationDataByOU(res.mapping.locationKeyID);
            this.selectedLocation = res.mapping.location;
            this.selectedOrganiztion=res.mapping.organization;
          }
        });
      }
    }
  }

  CancelOrgnaizationMapping(){
    this.displayOUMap = false;
    this.workflowService.setVisibility(false);
  }

  SaveOrgnaizationMapping(){
    this.orgnaizationMappingInfo.policyTypeID = 1;
    this.orgnaizationMappingInfo.organization = ((this.selectedOrganiztion.map(x => x).join('~')).split('~')).map(i => Number(i));
    this.orgnaizationMappingInfo.location = ((this.selectedLocation.map(x => x).join('~')).split('~')).map(i => Number(i));
    console.log(this.orgnaizationMappingInfo.organization, this.orgnaizationMappingInfo.location,'ogr');
    this.workflowService.SaveOrgnaizationMapping(this.orgnaizationMappingInfo,this.moduleID);
  }
 
  prepareOrgListByOU(params) {
    console.log(params);
    this.selectedOrganiztion = [];
    this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(params);
  }
  preparelocationDataByOU(params) {
  this.selectedLocation = [];
  this.locationDataList = this.appCoreCommonService.preparelocationDataByOU(params);
}
}
