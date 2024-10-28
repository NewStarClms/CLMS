import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { VisitorAreasService } from '../../../services/visitor-areas.service';
import { selectVisitorAreaState } from '../../../store/app.state';
import { VisitorAreas } from '../../../store/model/master-data.model';

@Component({
  selector: 'app-visitor-areas',
  templateUrl: './visitor-areas.component.html',
  styleUrls: ['./visitor-areas.component.scss']
})
export class VisitorAreasComponent implements OnInit {


  public columnDefs!: any[];
    public rowData: Array<VisitorAreas>= [];
    public visitorareaInfo:VisitorAreas = {} as VisitorAreas;
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public labelName:string="";
    public headerdialogName:string="";
  constructor(
    private _store: Store<any>,
    private visitorareaService:VisitorAreasService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService
  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectVisitorAreaState).subscribe(response=>
      {
        if (response && response.visitorAreasList) {
            this.rowData = response.visitorAreasList;
        }
      });
    this.columnDefs = this.visitorareaService.perpareColumnForGrid();
    this.visitorareaService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveVisitorAreaData(visitorareaForm:NgForm){
  if(this.visitorareaInfo.visitorAreaID > 0){
    this.visitorareaService.updateStateOfCell(this.visitorareaInfo);
  } else{
    this.visitorareaService.saveVisitorArea(this.visitorareaInfo);
  }
}
CancelVisitorAreaData(){
  this.visitorareaService.setVisibility(false);
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add Visit Area";
  this.visitorareaInfo = {} as VisitorAreas;
  this.visitorareaService.setVisibility(true);
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.visitorareaInfo = params.data;
      this.visitorareaService.setVisibility(true);
      if(this.visitorareaInfo.visitorAreaID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Visit Area";
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.visitorAreaID == params.data.visitorAreaID);
          temdata.splice(index,1);
          this.rowData = temdata;
          this.visitorareaService.deleteCellFromRemote(params);
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
      this.visitorareaService.updateStateOfCell(params);
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
  this.visitorareaService.getCSVReport(this.rowData , 'visitorArea');
} 
}
