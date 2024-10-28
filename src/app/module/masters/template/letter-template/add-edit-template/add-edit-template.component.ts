import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateService } from 'src/app/services/template-service';
import { WorkflowService } from 'src/app/services/workflow.service';
import { LetterTemplate } from 'src/app/store/model/alert-template.model';
import {Clipboard} from '@angular/cdk/clipboard';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-add-edit-template',
  templateUrl: './add-edit-template.component.html',
  styleUrls: ['./add-edit-template.component.scss']
})
export class AddEditTemplateComponent implements OnInit {
  public currentTemplate: LetterTemplate;
  public tags:Array<any>;
  public ttypes:Array<any>;
  public tagTypeID:number=3;//This needs to be made dynamic based on module
  public moduleID:number=1;
  public pageTitle:string|"";
  public buttonText:string|"";
  public isNew:boolean|true;
  editorConfig = {
    allowedContent: true
  };

  constructor(private workflowService: WorkflowService,
    private templateService: TemplateService,
    private router: Router,
    private clipboard: Clipboard) { }

  ngOnInit(): void {
    this.templateService.getCurrentLetterTemplate().subscribe(tmp=>{
      this.currentTemplate =tmp;
      if(tmp && tmp.templateID > 0){
      this.pageTitle="Update Template";
      this.buttonText="Update";
      this.isNew=false;
      }
      else{
          this.pageTitle="Add Template";
          this.buttonText="Submit";
          this.isNew=true;
      }
    });
    this.templateService.getTemplateType(this.moduleID).subscribe(ttype=>{
      this.ttypes =ttype.tagList;
    });
    this.fetchTags();
  }
  fetchTags(){
    this.templateService.getTags(this.tagTypeID,this.moduleID).subscribe(res=>{
      if(res && res.tagList){
        this.tags =res.tagList;
      }
    });
  }

  goBack(){
    this.templateService.setCurrentLetterTemplate(null);
    this.router.navigate(['/master/letter-template/']);
  }

  submitRequest(letterForm:NgForm){
     if(this.currentTemplate){
        this.templateService.saveLetterTemplate(this.currentTemplate,this.moduleID).subscribe(res=>{
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
