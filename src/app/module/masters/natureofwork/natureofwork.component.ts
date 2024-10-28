import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, ColumnApi, GridApi, Module } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { NatureOfWork } from '../../../store/model/master-data.model';
import { NatureofworkService } from '../../../services/natureofwork.service';
import { selectNatureofworkState } from '../../../store/app.state';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-natureofwork',
  templateUrl: './natureofwork.component.html',
  styleUrls: ['./natureofwork.component.scss']
})
export class NatureofworkComponent implements OnInit {

  public columnDefs!: any[];
    public rowData: Array<NatureOfWork>= [];
    public natureofworkInfo:NatureOfWork = {} as NatureOfWork;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public labelName:string="";
    public headerdialogName:string="";
    @ViewChild('closebutton') closebutton;
  constructor(
    private _store: Store<any>,
    private natureofworkervice: NatureofworkService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService

  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectNatureofworkState).subscribe(res =>{
     if(res && res.natureofworkList)  {
       this.rowData = res.natureofworkList;
     }
    });
    this.columnDefs = this.natureofworkervice.prepareColumnForGrid();
    this.natureofworkervice.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveNatureOfWorkData(natureOfWorkForm:NgForm){
  console.log(this.natureofworkInfo);
  if(this.natureofworkInfo.natureOfWorkID >0){
  this.natureofworkervice.updateStateOfCell(this.natureofworkInfo);
  }else{
  this.natureofworkervice.saveNatureOfWork(this.natureofworkInfo);
}
}
CancelNatureOfWorkData(){
  this.natureofworkervice.setVisibility(false);
}
addNew() {
  this.labelName="Save";
   this.headerdialogName="Add Nature Of work";
  this.natureofworkInfo = {} as NatureOfWork;
  this.natureofworkervice.setVisibility(true);
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.display = !this.display;
      this.natureofworkInfo = params.data;
      if(this.natureofworkInfo.natureOfWorkID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Nature Of Work";
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.natureOfWorkID == params.data.natureOfWorkID);
          temdata.splice(index,1);
          this.rowData = temdata;
          this.natureofworkervice.deleteCellFromRemote(params);
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
      this.natureofworkervice.updateStateOfCell(params);
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
  this.natureofworkervice.getCSVReport(this.rowData, 'NatureOfWorkFlow');
}
}
