import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateService } from 'src/app/services/template-service';
import { WorkflowService } from 'src/app/services/workflow.service';
import { AlertTemplate } from 'src/app/store/model/alert-template.model';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-edit-alert-template',
  templateUrl: './edit-alert-template.component.html',
  styleUrls: ['./edit-alert-template.component.scss']
})
export class EditAlertTemplateComponent implements OnInit {
  public currentTemplate: AlertTemplate;
  public tags:Array<any>;
  public tagTypeID:number=2;//This needs to be made dynamic based on module
  public moduleID=1;
  editorConfig = {
    allowedContent: true
  };

  constructor(private workflowService: WorkflowService,
    private templateService: TemplateService,
    private router: Router,
    private clipboard: Clipboard) { }

  ngOnInit(): void {
    this.templateService.getCurrentTemplate().subscribe(tmp=>{
      this.currentTemplate =tmp;
      this.fetchTags(this.currentTemplate.workFlowID);
    });
  }

  fetchTags(workflowID){
    this.templateService.getTags(this.tagTypeID,workflowID).subscribe(res=>{
      if(res && res.tagList){
        this.tags =res.tagList;
      }
    });
  }

  goBack(){
    this.router.navigate(['/master/alert-template/']);
  }

  submitRequest(){
     if(this.currentTemplate && this.currentTemplate.alertID){
        this.templateService.saveAlertTemplate(this.currentTemplate,this.moduleID).subscribe(res=>{
          this.goBack();
        });;
        
     }
  }

  copy(event){
    this.clipboard.copy(event.target.id);
    event.target.innerHtml="Copied";
    event.target.innerText="Copied";
    setTimeout(function(){
      event.target.innerHtml=event.target.id;
      event.target.innerText=event.target.id;
    },500);
  }
  
  allowDrop(ev): void {
    ev.preventDefault();
  }
  
  drag(ev): void {
    ev.dataTransfer.setData('dragElement', ev.target.id);
  }
  
  drop(ev): void {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('dragElement');
    
    const startPos = ev.target.selectionStart;
    const endPos = ev.target.selectionEnd;
  
    ev.target.value = ev.target.value.substring(0, startPos)
      + data
      + ev.target.value.substring(endPos, ev.target.value.length);
  }
}
