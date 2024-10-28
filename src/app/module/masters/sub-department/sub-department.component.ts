import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { SubDepartmentService } from 'src/app/services/sub-department.service';
import { selectDepartmentState, selectEmployeeState, selectSubDepartmentState } from 'src/app/store/app.state';
import { Employee } from 'src/app/store/model/employee.model';
import { Department, SubDepartment } from 'src/app/store/model/master-data.model';

@Component({
  selector: 'app-sub-department',
  templateUrl: './sub-department.component.html',
  styleUrls: ['./sub-department.component.scss']
})
export class SubDepartmentComponent implements OnInit {

  public columnDefs!: any[];
    public rowData: Array<SubDepartment>= [];
    public subDepartmentInfo:SubDepartment = {} as SubDepartment;
    public deptList:Array<any>=[];
    public empList:Array<any>=[];
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public labelName:string="";
    public headerdialogName:string="";
    public subDepartmentSupervisorDisplay:string;
  constructor(
    private _store: Store<any>,
    private subdepartmentService:SubDepartmentService,
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
    this._store.select(selectDepartmentState).subscribe(dept=>{
      if(dept && dept.departmentList){
        const tempdeptList:Department[]=AppUtil.deepCopy(dept.departmentList);
        tempdeptList.map(x=>{
         this.deptList.push({
          departmentID:x.departmentID,
          departmentName:x.departmentName
         });
        })
      }
    });
    this._store.select(selectSubDepartmentState).subscribe(response=>
      {
        if (response && response.subdepartmentList) {
            this.rowData = response.subdepartmentList;
        }
      });
      this.columnDefs = this.subdepartmentService.prepareColumnForGrid();
      this.subdepartmentService.getVisiblity().subscribe(res =>{
        this.display = res;
      });
  }
  addNew(){
    this.labelName="Save";
   this.headerdialogName="Add Sub Department";
    this.subDepartmentInfo = {} as SubDepartment;
    this.subdepartmentService.setVisibility(true);
  }

SaveSubDepartmentData(subDepartmentForm:NgForm){
  console.log(this.subDepartmentInfo);
  if(this.subDepartmentInfo.subDepartmentID > 0){
    this.subdepartmentService.updateStateOfCell(this.subDepartmentInfo);
  }
  else{
    this.subdepartmentService.saveSubDepartment(this.subDepartmentInfo);
  }
}
CancelSubDepartmentData(){
  this.subDepartmentInfo = {} as SubDepartment;
  this.subDepartmentInfo.subDepartmentSupervisorDisplay = "";
  this.subdepartmentService.setVisibility(false);
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.subDepartmentInfo = params.data;
      this.display = !this.display;
      
      if(this.subDepartmentInfo.subDepartmentID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Sub Department";
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.subDepartmentID == params.data.subDepartmentID);
          temdata.splice(index,1);
          this.subdepartmentService.deleteCellFromRemote(params);
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
      this.subdepartmentService.updateStateOfCell(params);
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
  this.subdepartmentService.getCSVReport(this.rowData , 'Sub_Department');
}
onGetEmployeeDetail(event){
  this.subDepartmentInfo.subDepartmentSupervisorID = event.data;
  this.subDepartmentInfo.subDepartmentSupervisorDisplay = event.column;
}
}
