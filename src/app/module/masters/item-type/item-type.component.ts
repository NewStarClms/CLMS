import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { ItemTypeService } from '../../../services/item-type.service';
import { selectItemTypeState } from '../../../store/app.state';
import { ItemTypes } from '../../../store/model/master-data.model';

@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.scss']
})
export class ItemTypeComponent implements OnInit {


  public columnDefs!: any[];
    public rowData: Array<ItemTypes>= [];
    public itemTypeInfo:ItemTypes = {} as ItemTypes;
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public labelName:string="";
    public headerdialogName:string="";
    constructor(
      private _store: Store<any>,
      private itemTypeService:ItemTypeService,
      private confirmationService:ConfirmationService,
      private authenticationService:AuthService

    ) {

    }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectItemTypeState).subscribe(response=>
      {
        if (response && response.itemTypesList) {
            this.rowData = response.itemTypesList;
        }
      });
    this.columnDefs = this.itemTypeService.perpareColumnForGrid()
    this.itemTypeService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveItemTypeData(itemTypeForm:NgForm){
  if(this.itemTypeInfo.itemTypeID > 0){
    this.itemTypeService.updateStateOfCell(this.itemTypeInfo);
  } else{
    console.log(this.itemTypeInfo);
    this.itemTypeService.saveItemType(this.itemTypeInfo);
  }
}
CancelItemTypeData(){
  this.itemTypeService.setVisibility(false);
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add Item Type";
  this.itemTypeService.setVisibility(true);
      this.itemTypeInfo = {}  as ItemTypes;
}
onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.itemTypeService.setVisibility(true);
      this.itemTypeInfo = params.data;
      if(this.itemTypeInfo.itemTypeID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Item Type";
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.itemTypeID == params.data.itemTypeID);
          temdata.splice(index,1);
          this.rowData = temdata;
          this.itemTypeService.deleteCellFromRemote(params);

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
      this.itemTypeService.updateStateOfCell(params);
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
  this.itemTypeService.getCSVReport(this.rowData , 'Item_Type');
}
}
