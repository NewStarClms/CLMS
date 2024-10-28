import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/authentication.service";
import { EmployeeBiometricDataService } from "src/app/services/employee-biometric-data.service";
import { EmployeeBiometricData } from "src/app/store/model/employee-biometric-data.model";
@Component({
    selector: 'app-unregistered-emp',
    templateUrl:'./unregistered-emp.component.html',
    styleUrls: ['./unregistered-emp.component.scss']
})

export class UnRegisteredEmpComponent implements OnInit {
    public rowData: Array<EmployeeBiometricData>= [];  
    public columnDefs!: any[];

    constructor(private employeeBiometricDataService: EmployeeBiometricDataService,
      private router: Router,
      private authenticationService: AuthService
      )
      {
      }

      ngOnInit(): void {
             this.authenticationService.setGlobalFilterVisibility(false);
            this.columnDefs = this.employeeBiometricDataService.prepareUnRegisteredEmployeeColumnForGrid();
            this.employeeBiometricDataService.fetchUnregisteredEmployee().subscribe(res=>{
               if(res != null && res.employees != null){
                 this.rowData = res.employees;
               }
            })
      }


      onCellClicked(params){
        this.employeeBiometricDataService.setEditableEmpBioData(params.data);
        this.router.navigate(['/work/add-edit-employee/'+0]);
      }
}

  