import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { Category } from '../../../store/model/master-data.model';
import { selectCategoryState } from '../../../store/app.state';
import { CategoryService } from '../../../services/category.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { NgForm } from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-branch',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  public columnDefs!: any[];
    // gridApi and columnApi
    private api!: GridApi;
    private columnApi!: ColumnApi;
    public rowData: Array<Category>= [];
    public categoryInfo: Category = {} as Category;
    public displayPosition: boolean;
    public labelName:string="";
    public headerdialogName:string="";
    public display = false;

    constructor(
    private _store: Store<any>,
    private categoryService: CategoryService,
    private confirmationService: ConfirmationService,
    private authenticationService:AuthService
  ){
  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.categoryService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
    this._store.select(selectCategoryState).subscribe(res=>{
      if (res && res.categoryList) {
        this.rowData = AppUtil.deepCopy(res.categoryList);
      }
    });
    this.columnDefs = this.categoryService.prepareColumnForGrid();
  }

  addNew(){
    this.labelName="Save";
    this.headerdialogName="Add Category";
    this.categoryService.setVisibility(true);
    this.categoryInfo = {} as Category;
  }

 SaveCategoryData(categoryForm:NgForm){
  console.log(this.categoryInfo);
   if(this.categoryInfo.categoryID > 0){
    this.categoryService.updateStateOfCell(this.categoryInfo);
   }
  else{
   this.categoryService.saveCategory(this.categoryInfo);
 }

 }

CancelCategoryData(categoryForm){
  console.log(this.categoryInfo);
  this.categoryService.setVisibility(false);
}

onCellClicked(params) {
  // Handle click event for action cells
   if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.categoryInfo = params.data;
      this.display = !this.display;
      if(this.categoryInfo.categoryID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Category";
      }
    }

     if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
             let tempData = AppUtil.deepCopy(this.rowData);
             const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.categoryID == params.data.categoryID);
            temdata.splice(index,1);
            this.categoryService.deleteCellFromRemote(params);
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
  }
}

keyPressNumbers(event){
  AppUtil.validateNumbers(event);
}
keyPressAlphanumeric(event) {
  AppUtil.validateAlphanumeric(event);
}
exportGridData(){
  this.categoryService.getCSVReport(this.rowData , 'Category');
}
}
