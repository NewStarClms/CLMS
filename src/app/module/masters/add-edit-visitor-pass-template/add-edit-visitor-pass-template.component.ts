import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { VisitorPassTemplateService } from 'src/app/services/visitor-pass-template.service';
import { selectTagMasterState, selectVisitorPassTemplateState } from 'src/app/store/app.state';
import { TagMaster } from 'src/app/store/model/appData.model';
import { VisitorPassTemplate } from 'src/app/store/model/master-data.model';
//new Changes
import { TemplateService } from 'src/app/services/template-service';
//end
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-add-edit-visitor-pass-template',
  templateUrl: './add-edit-visitor-pass-template.component.html',
  styleUrls: ['./add-edit-visitor-pass-template.component.scss']
})
export class AddEditVisitorPassTemplateComponent implements OnInit {
  public visitorpassTemplateInfo:VisitorPassTemplate = {} as VisitorPassTemplate;
  public requestStatusList=UI_CONSTANT.REQUEST_STATUS;
  public taglist:Array<any>=[];
  headerdialogName:string="Add Visitor Pass Template";
  labelName:string="Save";

    //New Chnages
    public tags:Array<any>;
    public tagTypeID:number=4;//This needs to be made dynamic based on module
    public moduleID=1;
    public workflowID=1;
    //End
    editorConfig = {
      allowedContent: true
    };

  constructor(
    private _store: Store<any>,
    private visitorPassTemplateService:VisitorPassTemplateService,
    private confirmationService:ConfirmationService,
    private router:Router,
  private activatedRoute:ActivatedRoute,
  private authenticationService:AuthService,
  private templateService: TemplateService,
  private clipboard: Clipboard
  ) {

  }
  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    if(Number(this.activatedRoute.snapshot.params.id) != 0){
      this.headerdialogName="Update Visitor Pass Template";
  this.labelName="Update";
      this._store.select(selectVisitorPassTemplateState).subscribe(vpt =>{
        if(vpt && vpt.visitorPassTemplateList){
          console.log(vpt.visitorPassTemplateList);
          const tempvisitorPassTemplateList: VisitorPassTemplate[] = AppUtil.deepCopy(vpt.visitorPassTemplateList);
          this.visitorpassTemplateInfo = tempvisitorPassTemplateList.filter(i => i.templateID === Number(this.activatedRoute.snapshot.params.id))[0];
        }
        });
    }
    // this._store.select(selectTagMasterState).subscribe(res =>{
    //   if(res && res.tagMasterList)  {
    //     const tempTagList: TagMaster[] = AppUtil.deepCopy(res.tagMasterList);
    //     tempTagList.map(z=>{
    //     this.taglist.push({
    //       tagName: z.tagName
    //     });
    //   })
    //   }
    //  });

    //New  Changes
    this.templateService.getTags(this.tagTypeID,this.workflowID).subscribe(res=>{
      if(res && res.tagList){
        this.tags =res.tagList;
      }
    });
    //End
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
  
  // End
  
  
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




  SaveVisitorPassTemplateData(){
    if(this.visitorpassTemplateInfo.templateID > 0){
      this.visitorPassTemplateService.updateStateOfCell(this.visitorpassTemplateInfo);
    } else{
      this.visitorPassTemplateService.saveVisitorPassTemplate(this.visitorpassTemplateInfo);
    }
  }
  CancelVisitorPassTemplateData(){
    this.router.navigate(['/master/visitor-pass-template']);
  }
}
