import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, ColumnApi, GridApi, Module } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { Grade } from '../../../store/model/master-data.model';
import { GradeService } from '../../../services/grade.service';
import { selectGradeState } from '../../../store/app.state';
import { NgForm } from '@angular/forms';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {

  public columnDefs!: any[];
    public rowData: Array<Grade>= [];
    public gradeInfo:Grade = {} as Grade;
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
  public display = false;
  public isEditable = false;
  public labelName:string="";
  public headerdialogName:string="";
  constructor(
    private _store: Store<any>,
    private gradeService:GradeService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService
  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectGradeState).subscribe(response=>
      {
        if (response && response.gradeList) {
            this.rowData = response.gradeList;
        }
      });
    this.columnDefs = this.gradeService.prepareColumnForGrid()
    this.gradeService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveGradeData(gradeForm:NgForm){
  console.log(this.gradeInfo);
  if(this.gradeInfo.gradeID >0){
    this.gradeService.updateStateOfCell(this.gradeInfo);
  }else{
    this.gradeService.saveGrade(this.gradeInfo);
  }
}
CancelGradeData(){
  this.gradeService.setVisibility(false);
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add Grade";
  this.gradeInfo = {} as Grade;
  this.gradeService.setVisibility(true);
}
onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.display = !this.display;
      this.gradeInfo = params.data;
      if(this.gradeInfo.gradeID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Grade";
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.gradeID == params.data.gradeID);
          temdata.splice(index,1);
          this.rowData = temdata;
          this.gradeService.deleteCellFromRemote(params);

        },
        reject: (type) => {
            switch(type) {
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
      console.log('update',params);
      this.gradeService.updateStateOfCell(params);
    }

    if (action === UI_CONSTANT.ACTIONS.CANCEL) {
      params.api.stopEditing(true);
    }
  }
}
keyPressAlphanumeric(event) {
  AppUtil.validateAlphanumeric(event);
}
exportGridData(){
  this.gradeService.getCSVReport(this.rowData , 'Grade');
}
}
