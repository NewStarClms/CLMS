import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { DesignationService } from '../../../services/designation.service';
import { selectDesignationState } from '../../../store/app.state';
import {  Designation } from '../../../store/model/master-data.model';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit {

  public columnDefs!: any[];
    // gridApi and columnApi
    private api!: GridApi;
    private columnApi!: ColumnApi;
    public rowData: Array<Designation>= [];
    public designationInfo: Designation = {} as Designation;
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public labelName:string="";
public headerdialogName:string="";
  constructor(
    private _store: Store<any>,
    private designationService:DesignationService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService

  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectDesignationState).subscribe(response=>
      {
        if (response && response.designationList) {
            this.rowData = response.designationList;
        }
      });
    this.columnDefs = this.designationService.perpareColumnForGrid();
    this.designationService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }

  onGridReady(params:any): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add Designation";
  this.designationInfo = {} as Designation;
  this.designationService.setVisibility(true);
}

SaveDesignationData(designationForm:NgForm){
  console.log(this.designationInfo);
  if(this.designationInfo.designationID > 0){
    this.designationService.updateStateOfCell(this.designationInfo);
  }else{
    this.designationService.saveDesignation(this.designationInfo);
  }
}

CancelDesignationData(){
  this.designationService.setVisibility(false);
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.designationInfo = params.data;
      this.display = !this.display;
      if(this.designationInfo.designationID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Designation";
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.designationID == params.data.designationID);
          temdata.splice(index,1);
          this.designationService.deleteCellFromRemote(params);
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
      this.designationService.updateStateOfCell(params);
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
  this.designationService.getCSVReport(this.rowData , 'Designation');
}
}
