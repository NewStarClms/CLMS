import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, ColumnApi, GridApi, Module } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { Dispensary } from '../../../store/model/master-data.model';
import { DispensaryService } from '../../../services/dispensary.service';
import { selectDispensaryState } from '../../../store/app.state';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-dispensary',
  templateUrl: './dispensary.component.html',
  styleUrls: ['./dispensary.component.scss']
})
export class DispensaryComponent implements OnInit {

  public columnDefs!: any[];
    public rowData: Array<Dispensary>= [];
    public dispensaryInfo:Dispensary = {} as Dispensary;
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public labelName:string="";
public headerdialogName:string="";
  constructor(
    private _store: Store<any>,
    private dispensaryService:DispensaryService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService

  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectDispensaryState).subscribe(response=>
      {
        if (response && response.dispensaryList) {
            this.rowData = response.dispensaryList;
        }
      });
    this.columnDefs = this.dispensaryService.prepareColumnForGrid();
    this.dispensaryService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveDispensaryData(dispensaryForm:NgForm){
  console.log(this.dispensaryInfo);
 if(this.dispensaryInfo.dispensaryID >0){
  this.dispensaryService.updateStateOfCell(this.dispensaryInfo);
 }else{
  this.dispensaryService.saveDispensary(this.dispensaryInfo);
 }
}
CancelDispensaryData(){
  this.dispensaryService.setVisibility(false);
}
addNewDispensary(){
  this.labelName="Save";
   this.headerdialogName="Add Dispensary";
  this.dispensaryService.setVisibility(true);
  this.dispensaryInfo = {} as Dispensary;
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

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.dispensaryService.setVisibility(true);
      this.dispensaryInfo = params.data;
      if(this.dispensaryInfo.dispensaryID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Dispensary";
      }
    }


    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.dispensaryID == params.data.dispensaryID);
          temdata.splice(index,1);
          this.dispensaryService.deleteCellFromRemote(params);
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
      this.dispensaryService.updateStateOfCell(params);
    }

    if (action === UI_CONSTANT.ACTIONS.CANCEL) {
      params.api.stopEditing(true);
    }
  }
}
keyPressNumbers(event){
  AppUtil.validateNumbers(event);
}
keyPressAlphanumeric(event) {
  AppUtil.validateAlphanumeric(event);
}
exportGridData(){
  this.dispensaryService.getCSVReport(this.rowData, 'Dispensary');
}
}
