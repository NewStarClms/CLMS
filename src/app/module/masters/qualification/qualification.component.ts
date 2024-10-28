import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { QualificationService } from '../../../services/qualification.service';
import { selectQualificationState } from '../../../store/app.state';
import { Qualification } from '../../../store/model/master-data.model';

@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.scss']
})
export class QualificationComponent implements OnInit {

  public columnDefs!: any[];
    public rowData: Array<Qualification>= [];
    public qualificationInfo : Qualification = {} as Qualification;
    @ViewChild('closebutton') closebutton;
     public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public labelName:string="";
    public headerdialogName:string="";
  constructor(
    private _store: Store<any>,
    private qualificationService:QualificationService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService

  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectQualificationState).subscribe(response=>
      {
        if (response && response.qualificationList) {
            this.rowData = response.qualificationList;
        }
      });
    this.columnDefs = this.qualificationService.prepareColumnForGrid();
    this.qualificationService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
  addNewQualification(){
    this.labelName="Save";
   this.headerdialogName="Add Qualification";
    this.qualificationService.setVisibility(true);
    this.qualificationInfo= {} as Qualification;
  }
SaveQualificationData(qualificationForm){
  if(this.qualificationInfo.qualificationID >0){
    this.qualificationService.updateStateOfCell(this.qualificationInfo);
    console.log('edit',this.qualificationInfo);
  }else{
    this.qualificationService.saveQualification(this.qualificationInfo);
    console.log('add',this.qualificationInfo);
  }
  
}
CancelQualificationData(){
  this.qualificationService.setVisibility(false);
}

onRowEditingStarted(params) {
  params.api.refreshCells({
    columns: ["action"],
    rowNodes: [params.node],
    force: true
  });
}
onRowEditingStopped(params) {
  console.log('stop=',params);
  params.api.refreshCells({
    columns: ["action"],
    rowNodes: [params.node],
    force: true
  });
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;
      console.log(params.event.path[1].dataset.action);
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.qualificationService.setVisibility(true);
        this.qualificationInfo = params.data;
        console.log(params);
        if(this.qualificationInfo.qualificationID !== 0 ){
          this.labelName="Update";
         this.headerdialogName="Update Qualification";
        }
      }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.qualificationID == params.data.qualificationID);
          temdata.splice(index,1);
          this.qualificationService.deleteCellFromRemote(params);
          this.rowData = temdata;

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
      this.qualificationService.updateStateOfCell(params);
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
  this.qualificationService.getCSVReport(this.rowData, 'Qualification');
}

}
