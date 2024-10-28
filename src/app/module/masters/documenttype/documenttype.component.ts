import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { DocumenttypeService } from 'src/app/services/documenttype.service';
import { selectDocumentCategoryState, selectDocumentTypeState } from 'src/app/store/app.state';
import { documentCategory, DocumentTypes } from 'src/app/store/model/master-data.model';

@Component({
  selector: 'app-documenttype',
  templateUrl: './documenttype.component.html',
  styleUrls: ['./documenttype.component.scss']
})
export class DocumenttypeComponent implements OnInit {

  public columnDefs!: any[];
    public rowData: Array<DocumentTypes>= [];
    public documentTypeInfo:DocumentTypes = {} as DocumentTypes;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public docCatList:Array<any>=[];
    public labelName:string="";
public headerdialogName:string="";
  constructor(
    private _store: Store<any>,
    private documentTypeService:DocumenttypeService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService

  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectDocumentTypeState).subscribe(response=>
      {
        if (response && response.documentTypeList) {
            this.rowData = response.documentTypeList;
        }
      });
    this.columnDefs = this.documentTypeService.prepareColumnForGrid();
    this.documentTypeService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
    this._store.select(selectDocumentCategoryState).subscribe(res => {
      if (res && res.documentCategoryList) {
        const tempuserdocCatList: documentCategory[] = AppUtil.deepCopy(res.documentCategoryList);
        this.docCatList = tempuserdocCatList
      }
    });
  }
  SaveDocumentTypeData(){
  console.log(this.documentTypeInfo);
 if(this.documentTypeInfo.documentTypeID >0){
  this.documentTypeService.updateStateOfCell(this.documentTypeInfo);
 }else{
  this.documentTypeService.saveDocumentType(this.documentTypeInfo);
 }
}
CancelDocumentTypeData(){
  this.documentTypeService.setVisibility(false);
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add Document Type";
  this.documentTypeService.setVisibility(true);
  this.documentTypeInfo = {} as DocumentTypes;
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.documentTypeService.setVisibility(true);
      this.documentTypeInfo = params.data;
      if(this.documentTypeInfo.documentTypeID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Document Type";
      }
    }


    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.documentTypeID == params.data.documentTypeID);
          temdata.splice(index,1);
          this.documentTypeService.deleteCellFromRemote(params);
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
      this.documentTypeService.updateStateOfCell(params);
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
  this.documentTypeService.getCSVReport(this.rowData, 'Document Type');
}
}


