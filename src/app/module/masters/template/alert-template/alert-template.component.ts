import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtil } from 'src/app/common/app-util';
import { TemplateService } from 'src/app/services/template-service';
import { WorkflowService } from 'src/app/services/workflow.service';
import { AlertTemplate } from 'src/app/store/model/alert-template.model';
import { Workflow, WorkFlowRequest } from 'src/app/store/model/workflow.model';

@Component({
  selector: 'app-alert-template',
  templateUrl: './alert-template.component.html',
  styleUrls: ['./alert-template.component.scss']
})
export class AlertTemplateComponent implements OnInit {
  workflowOptionList:Array<{key:string; value:number}> = [];
  requestTypeList: Array<WorkFlowRequest> = [];
  selectedWorkflowID: number;
  selectedWorkflowModuleID: number;
  rowData: Array<AlertTemplate> = [];
  columnDefs: Array<any> = [];
  public workflowList:Array<Workflow> = []; 
  moduleID=1;//TODO: This needs to be set by parent based on which module this control is used
 
  constructor(private workflowService: WorkflowService,
              private templateService: TemplateService,
              private router: Router) { }

  ngOnInit(): void {
    this.getAlertTemplates();
    this.workflowService.getWorkflowList(this.moduleID).subscribe(flowList => {
      if(flowList.workFlows){
        this.workflowList = AppUtil.deepCopy(flowList.workFlows);
        this.workflowList.map(y => {
          this.workflowOptionList.push({
            key: y.workFlowModuleName,
            value: y.workFlowModuleID
          });
          this.templateService.getSelectedWorkflowModuleID().subscribe(id=>{
            if(id && id>0){
              this.selectedWorkflowModuleID=id;
              this.prepareRequestType(id);
            }
          });
          this.templateService.getCurrentTemplate().subscribe(tmp=>{
            if(tmp && tmp.workFlowID>0){
              this.selectedWorkflowID=tmp.workFlowID;
              this.getAlertTemplates();
            }
          });
        });
      }
    });
    this.columnDefs=this.templateService.prepareColumnForGrid();
  }
  getAlertTemplates(){
    this.templateService.getAlertTemplateList(this.moduleID,this.selectedWorkflowID).subscribe(res => {
       if(res){
         this.rowData=res;
       }
    });
  }
  getRequesTypeList(e){
    this.prepareRequestType(e);
  }
  prepareRequestType(workFlowModuleID){
    this.requestTypeList = [];
    this.requestTypeList = this.workflowList.filter(c=>c.workFlowModuleID === workFlowModuleID)[0].workFlows;
  }
  onCellClicked(params) {
    this.templateService.setCurrentTemplate(params.data);
    this.templateService.setSelectedWorkflowModuleID(this.selectedWorkflowModuleID);
    this.router.navigate(['/master/alert-template/edit']);
  }
}
