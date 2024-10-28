import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
import { Employee } from 'src/app/store/model/employee.model';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { DepartmentService } from '../../../services/department.service';
import { selectDepartmentState, selectEmployeeState } from '../../../store/app.state';
import { Department } from '../../../store/model/master-data.model';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})

export class DepartmentComponent implements OnInit {

  public columnDefs!: any[];
    public rowData: Array<Department>= [];
    public departmentInfo:Department = {} as Department;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
  public empList:Array<any>=[];
    @ViewChild('closebutton') closebutton;
    public labelName:string="";
    public headerdialogName:string="";
  constructor(
    private _store: Store<any>,
    private departmentService:DepartmentService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService

  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectEmployeeState).subscribe(res=>{
      if(res && res.employeeList){
        this.empList= UI_CONSTANT.DEFAULT_SELECT.concat(this.empList);
        const tempbranchheadList:Employee[]=AppUtil.deepCopy(res.employeeList);
        tempbranchheadList.map(emp=>{
             this.empList.push({
               id:emp.employeeID,
               name:emp.employeeName
             })
        })
      }
    });
    this._store.select(selectDepartmentState).subscribe(response=>
      {
        if (response && response.departmentList) {
            this.rowData = response.departmentList;
        }
      });
    this.columnDefs = this.departmentService.prepareColumnForGrid()
    this.departmentService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add Department";
  this.departmentInfo = {} as Department;
  this.departmentService.setVisibility(true);
}

SaveDepartmentData(departmentForm:NgForm){
  console.log(this.departmentInfo);
  if(this.departmentInfo.departmentID >0){
    this.departmentService.updateStateOfCell(this.departmentInfo);
  }else{
    this.departmentService.saveDepartment(this.departmentInfo);
  }
}
CancelDepartmentData(){
  this.departmentInfo = {} as Department;
  this.departmentInfo.headOfDepartmentDisplay ="";
  this.departmentService.setVisibility(false);
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.display = !this.display;
      this.departmentInfo = params.data;
      if(this.departmentInfo.departmentID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Department";
      }
     
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.departmentID == params.data.departmentID);
          temdata.splice(index,1);
          this.departmentService.deleteCellFromRemote(params);
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
      this.departmentService.updateStateOfCell(params);
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
  this.departmentService.getCSVReport(this.rowData , 'Department');
}
onGetEmployeeDetail(event){
  this.departmentInfo.headOfDepartmentID=event.data;
  this.departmentInfo.headOfDepartmentDisplay = event.column;
}
}
