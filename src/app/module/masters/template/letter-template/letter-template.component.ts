import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { TemplateService } from 'src/app/services/template-service';
import { LetterTemplate } from 'src/app/store/model/alert-template.model';

@Component({
  selector: 'app-letter-template',
  templateUrl: './letter-template.component.html',
  styleUrls: ['./letter-template.component.scss']
})
export class LetterTemplateComponent implements OnInit {
  rowData: Array<LetterTemplate> = [];
  public LetterTemplateInfo:  LetterTemplate= {} as LetterTemplate;
  columnDefs: Array<any> = [];
  ttypes: Array<any> = [];
  public templateTypeID:number;
  moduleID=3;//TODO: This needs to be set by parent based on which module this control is used

  constructor(private templateService: TemplateService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit(): void {
    this.templateService.getLetterTemplateList(this.moduleID,0).subscribe(res => {
      if(res){
        this.rowData=res;
      }
     });
     this.templateService.getTemplateType(this.moduleID).subscribe(ttype=>{
      this.ttypes =ttype.tagList;
    });
     this.columnDefs=this.templateService.prepareColumnForLetterGrid();
  }
  // filter(){
  //   this.templateService.getLetterTemplateList(this.moduleID, this.templateTypeID).subscribe(res => {
  //     if(res){
  //       console.log('template',res);
  //       this.rowData=res;
  //     }
  //   });
  // }
  filter(){
    this.templateService.getLetterTemplateList(this.moduleID, this.LetterTemplateInfo.templateTypeID).subscribe(res => {
      if(res){
        this.rowData =res.filter((item)=>item.templateTypeID == this.LetterTemplateInfo.templateTypeID);
      }
    });

  }
  addNew(){
    this.templateService.setCurrentLetterTemplate({});
    this.router.navigate(['/master/letter-template/add/']);
  }

  onCellClicked(params) {
    
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.templateService.setCurrentLetterTemplate(params.data);
        this.router.navigate(['/master/letter-template/edit/']);
      }
      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item) => item.templateID == params.data.templateID);
            temdata.splice(index, 1);
            this.templateService.deleteLetterTemplateList(params);
            this.rowData = temdata;
          },
          reject: (type) => {
            switch (type) {
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                break;
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                break;
            }
          }
        });
      }
    }
  }

}
