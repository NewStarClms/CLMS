import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { selectEmployeeState } from 'src/app/store/app.state';
import { Employee } from 'src/app/store/model/employee.model';
import { AppSearchCommonService } from '../../../services/app-search.common.service';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  public columnDefs!: any[];
  // gridApi and columnApi
  public rowData: Array<Employee> = [];
  public employeeInfo: Employee = {} as Employee;
  public display = false;
  results: Employee[];
  employeeSerchList: Employee[];
  searchedEmployee:string;
  private employeeList: Array<Employee> =[];
  public totalRecordCount: number;

  constructor(
    private _store: Store<any>,
    private employeeService: EmployeeService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private searchemployeeService:AppSearchCommonService,
    private authenticationService:AuthService
  ) {
     this.employeeService.fetchEmployeeData();
   }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(true);
  }
  addNewEmployee() {
    this.employeeInfo = {} as Employee;
    this.router.navigate(['/work/add-edit-employee/' + 0]);
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.router.navigate(['/work/add-edit-employee/' + params.data.employeeID]);
      }

      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item) => item.employeeID == params.data.employeeID);
            temdata.splice(index, 1);
            this.rowData = temdata;
            this.employeeService.deleteCellFromRemote(params);
          },
          reject: (type) => {
            switch (type) {
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
        console.log('update', params);
        this.employeeService.updateStateOfCell(params);
      }

      if (action === UI_CONSTANT.ACTIONS.CANCEL) {
        params.api.stopEditing(true);
      }
    }
  }
  exportGridData() {
    this.employeeService.getCSVReport(this.rowData, 'Employee');
  }
  loadList(){
    this.employeeService.fetchEmployeeData().subscribe(res=>{
      if(res){
        this.rowData = res.data;
        this.totalRecordCount=res.totalRecords;
      }
    });
    this.columnDefs = this.employeeService.prepareColumnForGrid()
  }

  search(event) {
    this.searchemployeeService.getFilteredEmployee(event.query).subscribe(data => {
      if(data && data.searchData){
      this.employeeSerchList = data.searchData;
      }
    });
  }

  onGetEmployeeDetail(params){
    this.router.navigate(['/work/add-edit-employee/' + params.data]);
  }

  onLazyLoadGridData(params)
  {
      this.employeeService.fetchEmployeeData(params).subscribe(res => {
        if(res){
          this.rowData = res.data;
          this.totalRecordCount=res.totalRecords;
        }
      });
  }
}
