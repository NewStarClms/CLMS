import { templateSourceUrl } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { VisitorTypeService } from '../../../services/visitor-type.service';
import { selectVisitorTypeState } from '../../../store/app.state';
import { VisitorType } from '../../../store/model/master-data.model';

@Component({
  selector: 'app-visitor-type',
  templateUrl: './visitor-type.component.html',
  styleUrls: ['./visitor-type.component.scss']
})
export class VisitorTypeComponent implements OnInit {
  public columnDefs!: any[];
    public rowData: Array<VisitorType>= [];
    public visitortypeInfo:VisitorType = {} as VisitorType;
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public labelName:string="";
    public headerdialogName:string="";
    constructor(
      private _store: Store<any>,
      private visitortypeService:VisitorTypeService,
      private confirmationService:ConfirmationService,
      private authenticationService:AuthService
    ) {

    }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectVisitorTypeState).subscribe(response=>
      {
        if (response && response.visitorTypeList) {
            this.rowData = response.visitorTypeList;
        }
      });
    this.columnDefs = this.visitortypeService.perpareColumnForGrid()
    this.visitortypeService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveVisitorTypeData(visitorTypeForm:NgForm){
  if(this.visitortypeInfo.visitorTypeID > 0){
    this.visitortypeService.updateStateOfCell(this.visitortypeInfo);
  } else{
    console.log(this.visitortypeInfo);
    this.visitortypeService.saveVisitorType(this.visitortypeInfo);
    visitorTypeForm.reset();
  }
}
CancelVisitorTypeData(){
  this.visitortypeService.setVisibility(false);
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add Visitor Type";
  this.visitortypeService.setVisibility(true);
      this.visitortypeInfo = {}  as VisitorType;
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.visitortypeService.setVisibility(true);
      this.visitortypeInfo = params.data;
      if(this.visitortypeInfo.visitorTypeID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Visitor Type";
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.visitorTypeID == params.data.visitorTypeID);
          temdata.splice(index,1);
          this.visitortypeService.deleteCellFromRemote(params);
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
      this.visitortypeService.updateStateOfCell(params);
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
  this.visitortypeService.getCSVReport(this.rowData , 'VisitorType');
}
}
