import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { ConfirmationService } from "primeng/api";
import { AppSearchCommonService } from "src/app/services/app-search.common.service";
import { AuthService } from "src/app/services/authentication.service";
import { CompanyService } from "src/app/services/company.service";
import { DepartmentService } from "src/app/services/department.service";
import { EmployeeBiometricDataService } from "src/app/services/employee-biometric-data.service";
import { MachineService } from "src/app/services/machine.service";
import { selectCompanyState, selectDepartmentState, selectEmployeeState, selectEmployeeUserGroupState } from "src/app/store/app.state";
import { EmployeeBiometricData, SearchInput } from "src/app/store/model/employee-biometric-data.model";
import { Employee } from "src/app/store/model/employee.model";
import { MachineMaster } from "src/app/store/model/machineMaster.model";
import { Company, Department } from "src/app/store/model/master-data.model";
import { EmployeeUserGroup } from "src/app/store/model/usermanage.model";

@Component({
    selector: 'app-registered-emp',
    templateUrl:'./registered-emp.component.html',
    styleUrls: ['./registered-emp.component.scss']
})

export class RegisteredEmpComponent implements OnInit {
    public empRowData: Array<Employee>= [];  
    public empColumnDefs!: any[];
    public selectedEmployees: Array<Employee>=[];
    public employeeBioData: Array<Employee>= [];
    public employeeSearchKeyword: string ="";
   
    public machineRowData: Array<MachineMaster>= [];
    public machineColumnDefs!: any[];
    public selectedMachines: Array<MachineMaster>= [];

    public machineTypeList: Array<any>=[];
    public selectedMachineType: Array<any>=[];
    public machineTypeDropdownSettings:IDropdownSettings={};
    public machineSearchKeyword: string ="";

    public machineModelList: Array<any>=[];
    public selectedMachineModel: Array<any>=[];
    public machineModelDropdownSettings:IDropdownSettings={};
   

    constructor(private employeeBiometricDataService: EmployeeBiometricDataService,
      private machineService: MachineService, 
      private router: Router,
      private confirmationService: ConfirmationService,
      private _store: Store<Company>,
      private searchEmployeeService: AppSearchCommonService,
      private authenticationService: AuthService
      )
      {
      }

    ngOnInit(): void {
      this.authenticationService.setGlobalFilterVisibility(true);

      this.empColumnDefs = this.employeeBiometricDataService.prepareRegisteredEmpColumns();
      this.machineColumnDefs= this.employeeBiometricDataService.prepareMachineColumnForGrid();
  
      this.machineService.getMachineModels().subscribe(response=>{
        if (response && response.machineModels) {
            this.machineModelList = response.machineModels;
        }
      });
      this.machineService.getMachineTypes().subscribe(response=>{
        if (response && response.machineTypes) {
            this.machineTypeList = response.machineTypes;
        }
      });
        
      this.machineModelDropdownSettings = {
        singleSelection: false,
        idField: 'machineModelID',
        textField: 'machineModelName',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
      this.machineTypeDropdownSettings = {
        singleSelection: false,
        idField: 'machineTypeID',
        textField: 'machineTypeName',
        itemsShowLimit: 3,
        allowSearchFilter: true
      }
    }
  
    checkUnCheckEmpAllClicked(chbSelectAll){
        if(chbSelectAll.checked){
         this.selectedEmployees= this.empRowData;
        }
        else{
          this.selectedEmployees=[];
        }
    }
     
    checkUnCheckEmpRowClicked(params){
        if(params.isSelected){
          this.selectedEmployees.push(params.data);
        }
        else{
          this.selectedEmployees=this.selectedEmployees.filter(e=>e.employeeID!=params.data.employeeID);
        }
    }

    checkUnCheckMachineAllClicked(chbSelectAll){
      if(chbSelectAll.checked){
       this.selectedMachines= this.machineRowData;
      }
      else{
        this.selectedMachines=[];
      }
    }
   
  checkUnCheckMachineRowClicked(params){
      if(params.isSelected){
        this.selectedMachines.push(params.data);
      }
      else{
        this.selectedMachines=this.selectedMachines.filter(e=>e.machineID!=params.data.machineID);
      }
   }

    onCellClicked(params){

    }

    filterData(){
      //let searchInput: SearchInput;
     let searchInput:SearchInput= {
       machineModelIDs: this.selectedMachineModel.map(u=>u.machineModelID).join('~').toString(),
       machineTypeIDs: this.selectedMachineType.map(u=>u.machineTypeID).join('~').toString(),
       machineSearchKeyword: this.machineSearchKeyword
     }
      this.employeeBiometricDataService.searchEmployeeMachine(searchInput).subscribe(res=>{
        if(res && res.machines){
          this.machineRowData = res.machines;
        }
        if(res && res.employees){
          this.empRowData = res.employees;
        }
      });
    }

    submitRequest(action: string){
        let selectedMachineList = this.selectedMachines.map(u=>u.machineID).join('~').toString();
        let selectedEmployeesID = this.selectedEmployees.map(e=>e.employeeID).join('~').toString();
        this.employeeBiometricDataService.mapUnmapEmployeeToMachine
        (selectedEmployeesID,selectedMachineList, action).subscribe(res =>{
          
        });
    }

    reset(){
        this.selectedEmployees = [];
        this.selectedMachines=[];
        this.selectedMachineModel=[];
        this.selectedMachineType=[];
        this.machineSearchKeyword="";
        this.employeeSearchKeyword="";
    }
}

  