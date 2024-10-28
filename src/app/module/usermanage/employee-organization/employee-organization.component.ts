import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/authentication.service';
import { EmployeeOUService } from 'src/app/services/employee-ou.service';
import { selectEmployeesOUStatusState, selectEmployeeUserGroupState } from 'src/app/store/app.state';
import { EmployeeUserGroup } from 'src/app/store/model/usermanage.model';

@Component({
  selector: 'app-employee-organization',
  templateUrl: './employee-organization.component.html',
  styleUrls: ['./employee-organization.component.scss']
})
export class EmployeeOrganizationComponent implements OnInit {

  public columnDefs!: any[];
  public rowData: Array<EmployeeUserGroup>= [];
  public totalRecordCount: number;

  constructor(
    private _store: Store<EmployeeUserGroup>,
    private employeeOUService: EmployeeOUService,
    private router: Router,
    private authenticationService:AuthService
  ) {
    // this.employeeOUService.fetchEmployeesOUStatusData();
   }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(true);
    this._store.select(selectEmployeesOUStatusState).subscribe(response=>{
      if (response && response.employeesOUStatusList) {
          this.rowData = response.employeesOUStatusList?.data;
          this.totalRecordCount=response.employeesOUStatusList?.totalRecords;
      }
    });
    this.columnDefs = this.employeeOUService.prepareColumnForGrid();
  
  }
  onCellClicked(params) {
    this.employeeOUService.setCurrentEditedEmp(this.rowData.filter(e=>e.employeeID == params.data.employeeID)[0]);
    this.router.navigate(['/usermanage/edit-emp-ou/']);
  }
  onLazyLoadGridData(params){
    if(params.searchKeyword=='' || params.searchKeyword.length>=3){
      this.employeeOUService.fetchEmployeesOUStatusData(params);
    }
  }
}
