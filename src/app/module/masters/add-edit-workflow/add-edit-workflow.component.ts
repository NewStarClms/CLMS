import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { Workflow, WorkFlowRequest, WorkflowRule } from 'src/app/store/model/workflow.model';
import { WorkflowService } from '../../../services/workflow.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { selectWorkflowRuleState } from 'src/app/store/app.state';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { RuleLevelMapping } from '../../../store/model/workflow.model';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';
import { Employee } from '../../../store/model/employee.model';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-add-edit-workflow',
  templateUrl: './add-edit-workflow.component.html',
  styleUrls: ['./add-edit-workflow.component.scss']
})
export class AddEditWorkflowComponent implements OnInit {

  public headerdialogName = "Add/Update Work Flow";
  employeeSerchList:any[];
  public workFlowModuleID ;
  public employeeID=null;
  public identifier:any[] = [];
  public labelName = "Save";
  public workflowRuleObj: WorkflowRule = {} as WorkflowRule;
  public requestTypeList:Array<WorkFlowRequest> = [];
  public workflowList: Workflow[] = [];
  public requestType:string;
  public workflowReqList:WorkFlowRequest[] = [];
  public workflowOptionList: Array<{key: string; value: number}> = [];
  public workflowRuleData: Array<WorkflowRule> = [];
  public ruleLevelMappingObj: RuleLevelMapping = {}as RuleLevelMapping;
  public userRoleOptionList: Array<{key:string; value: number;}> = UI_CONSTANT.USER_ROLES;
  public employeeList: Employee[] = [];
  public isDisabled=false;
  public moduleId=1;
  constructor(
    private workflowService: WorkflowService,
    private activateRouter: ActivatedRoute,
    private _store: Store,
    private router:Router,
    private appSearchService: AppSearchCommonService,
    private authenticationService:AuthService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    console.log('dd',this.activateRouter.snapshot.params);
    this.moduleId = Number(this.activateRouter.snapshot.params.modId);
    this.authenticationService.setGlobalFilterVisibility(false);
    this.workflowRuleObj = {} as WorkflowRule;
    this._store.select(selectWorkflowRuleState).subscribe(data =>{
      if(data && data.workflows){
      // console.log(data.workflows, 'data');
      this.workflowRuleData = AppUtil.deepCopy(data.workflows);
      this.workflowService.getWorkflowList(this.moduleId).subscribe(flowList => {
        console.log('flowlist',flowList);
      if(flowList.workFlows){
        this.workflowList = AppUtil.deepCopy(flowList.workFlows);
        this.workflowList.map(y => {
          this.workflowOptionList.push({
            key: y.workFlowModuleName,
            value: y.workFlowModuleID
          });
        });
        if (Number(this.activateRouter.snapshot.params.id) != 0) {
          this.isDisabled =true;
          const ruleID = Number(this.activateRouter.snapshot.params.id);
          if(this.workflowRuleData.length>0){
            const workTemp:WorkflowRule = this.workflowRuleData.filter(x=> x.workFlowRuleID === ruleID)[0];
          console.log('workTemp',workTemp);
          if(workTemp){          
          this.workFlowModuleID = this.getWorflowModuleID(workTemp.workFlowID);
          this.requestTypeList = this.workflowList.filter(c=>c.workFlowModuleID === this.workFlowModuleID)[0].workFlows;
          console.log(this.workflowRuleObj, 'obj',this.requestTypeList);
          
          this.workflowRuleObj = AppUtil.deepCopy(workTemp);
          this.workflowRuleObj.ruleLevelMappings = (workTemp.ruleLevelMappings)?workTemp.ruleLevelMappings:[];
          this.workFlowModuleID = this.getWorflowModuleID(workTemp.workFlowID);
          this.workflowRuleObj.ruleLevelMappings.forEach(element => {
             this.employeeID = {key:element.identifier,value:element.employeeID}
          });
          if(this.workflowRuleObj.ruleLevelMappings.length === 0){
            this.workflowRuleObj.ruleLevelMappings.push(this.workflowService.prepareRuleMappingData(this.workflowRuleObj.ruleLevelMappings));
          }else{
            this.workflowRuleObj.ruleLevelMappings.map(c=>{
              c.identifierLabel= { key: c.identifier , value: c.employeeID};
            });
          }
        } 
          }
          
        } else{
          this.isDisabled = false;
          this.workFlowModuleID = this.workflowList[0].workFlowModuleID;
          this.requestTypeList = this.workflowList.filter(c=>c.workFlowModuleID === this.workFlowModuleID)[0].workFlows;
          this.workflowRuleObj.workFlowID = this.moduleId;
          this.workflowRuleObj.description = null;
          this.workflowRuleObj.maxLength = 0;
          this.workflowRuleObj.minLength = 0;
          this.workflowRuleObj.nullable = true;
          this.workflowRuleObj.numberOfLevel = 0;
          this.workflowRuleObj.ruleLevelMappings = [];
          this.workflowRuleObj.workFlowRuleID = 0;
          this.workflowRuleObj.workFlowRuleName = null;
          this.workflowRuleObj.xmlRuleLevelMapping = null;
          this.workflowRuleObj.ruleLevelMappings.push(this.workflowService.prepareRuleMappingData(this.workflowRuleObj.ruleLevelMappings));
          this.prepareRequestType();
        }
      }
    });
  } 
  else{
    this.workflowService.fetchWorkflowRule(this.moduleId,0,0,0);
  }
  });
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
}
  onClear(){
    
  }
  searchData(event) {
    this.appSearchService.getFilteredEmployee(event.query).subscribe(data => {
      if(data && data.searchData){
      this.employeeSerchList = data.searchData;
      }
    });
  }
  selectEmployee(e,i){
    //console.log(this.employeeID,e,'value--');
    //console.log(e.key)
    this.workflowRuleObj.ruleLevelMappings[i].employeeID = e.value;
    this.workflowRuleObj.ruleLevelMappings[i].identifier = e.key;
  }
  unSelectEmployee(e,i){
    //console.log(this.employeeID,e,'value--');
    this.workflowRuleObj.ruleLevelMappings[i].employeeID = null;
    this.workflowRuleObj.ruleLevelMappings[i].identifier = null;
  }
  checkIndex(i){
    if(i=== 0){
      return true;
    } else{
      const len = this.workflowRuleObj.ruleLevelMappings.length - 1;
      return (i === len)? true : false;
    }
  }
  prepareRequestType(){
    console.log(this.workflowRuleObj);
    const temReqList =  this.workflowList.filter(c=> c.workFlowModuleID === this.workFlowModuleID)[0].workFlows;
   this.requestTypeList = temReqList;
    console.log(this.requestTypeList);
  }

  CancelworkflowForm(){
    const moduleName= UI_CONSTANT.MODULE_ID.filter(x=>x.value === this.moduleId)[0].path;
    this.router.navigate(['/'+moduleName +'/workflow-detail']);
  }
  getWorflowModuleID(childId){
    
    var workflowmodid;
    for (let flowData of this.workflowList) {
      const childArr:any[] = flowData.workFlows.filter(c=> c.workFlowID === childId);
      if(childArr.length > 0){
        
        workflowmodid= flowData.workFlowModuleID;
        return workflowmodid;
      }
    }
    return workflowmodid;
  }
  addNewRuleMap(){
    this.workflowRuleObj.ruleLevelMappings.push(this.workflowService.prepareRuleMappingData(this.workflowRuleObj.ruleLevelMappings));
  }
  deleteRuleMap(){
    const indx = this.workflowRuleObj.ruleLevelMappings.length;
    this.workflowRuleObj.ruleLevelMappings.splice(indx-1,1);

  }
  saveWorkFlowruleData(frm){
    // this.workflowRuleObj.workFlowID = this.workFlowModuleID;
    //console.log(this.employeeID);
    console.log(this.workflowRuleObj,this.employeeID,'----objrule');
    if (Number(this.activateRouter.snapshot.params.id) != 0) {
       this.workflowService.updateWorkflowRule(this.workflowRuleObj,this.moduleId);
    }
    else{
    this.workflowService.saveWorkflowRule(this.workflowRuleObj,this.moduleId);
    }
  }
}
