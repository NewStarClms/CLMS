import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';
import { SalaryStructureService } from 'src/app/services/salary-structure.service';
import { PayrollEmployee } from 'src/app/store/model/salary-structure.model';

@Component({
  selector: 'app-emp-sal-structure',
  templateUrl: './emp-sal-structure.component.html',
  styleUrls: ['./emp-sal-structure.component.scss']
})
export class EmpSalStructureComponent implements OnInit {
  public assignStatusList=UI_CONSTANT.SALARY_STRUCT_ASSIGN_STATUS;
  public selectedAssignStatus:any;
  public approvalStatusList=UI_CONSTANT.SALARY_STRUCT_APPROVAL_STATUS;
  public selectedApprovalStatus:any;
  public currentStatutoryEmployeeID: number=0;
  public currentSalaryEmployeeID: number=0;
  loading = false;
  showStatutoryPopup: boolean= false;
  showSalaryPopup: boolean= false;
  searchedEmployeeList:any[];
  selectedSearchedEmployee:{key:string, value:string};
  payrollModuleID:any=3;
  
  rowData: Array<PayrollEmployee>=[];
  columnDefs: any;
  headerText="Fill in Statutory Details";
  employeeName: string ="";

  constructor(private appSearchService: AppSearchCommonService, 
    private salaryStructureService: SalaryStructureService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.columnDefs=this.salaryStructureService.prepareColumnForGrid();
    this.salaryStructureService.getStatutoryPopupVisibility().subscribe(res =>{
      this.showStatutoryPopup = res;
    });
    this.salaryStructureService.getSalaryPopupVisibility().subscribe(res =>{
      this.showSalaryPopup = res;
    });
    this.loadPayrollEmployeeList();
  }

  loadAutoComplete(event) {
    this.appSearchService.getFilteredEmployee(event.query,this.selectedAssignStatus, this.payrollModuleID).subscribe(data => {
      if(data && data.searchData){
        this.searchedEmployeeList = data.searchData;
      }
    });
  }
  loadSelectedSearchedEmpDetail() {
    this.loading = true;
    setTimeout(() => this.loading = false, 1000);
    if(this.selectedSearchedEmployee){
      this.currentStatutoryEmployeeID=Number(this.selectedSearchedEmployee.value);
      this.employeeName= this.selectedSearchedEmployee.key.split('|')[0].split('-')[0];
      this.salaryStructureService.fetchStatutoryDetail(this.currentStatutoryEmployeeID).subscribe((res)=>{
        if(res && res.employees && res.employees.length>0){
          if(res.employees[0].employeeStatutoryID>0){
            this.openSalaryStructurePopup(res.employees[0].employeeID,this.employeeName, res.employees[0].employeeCode);
          }
          else this.openStatutoryPopup(this.currentStatutoryEmployeeID,this.employeeName,"");
         } else this.openStatutoryPopup(this.currentStatutoryEmployeeID,this.employeeName,"");
         this.changeDetectorRef.detectChanges();
      });
    }
  }

  loadPayrollEmployeeList(){
    this.selectedApprovalStatus="1";//TODO: remove it when approval functionality is implemented 
    this.salaryStructureService.fetchPayrollEmployeeList(this.selectedAssignStatus, this.selectedApprovalStatus).subscribe(data => {
      if(data && data.employees){
        this.rowData = data.employees;
      }
    });
  }

  onCellClicked(params){
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      if (action === "fillstatutory") {
        this.openStatutoryPopup(params.data.employeeID,params.data.employeeName, params.data.employeeCode)
      }
      else if(action==="salarystructure"){
        this.openSalaryStructurePopup(params.data.employeeID,params.data.employeeName, params.data.employeeCode)
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  openSalaryStructurePopup(employeeID, employeeName, empCode){
    this.salaryStructureService.setStatutoryPopupVisibility(false);
    this.salaryStructureService.setSalaryPopupVisibility(true);
    this.currentSalaryEmployeeID=employeeID;
   // this.headerText = employeeName+" Salary Structure:";
    this.headerText=`${employeeName}'s (${empCode}) Salary Structure:`;
    this.changeDetectorRef.detectChanges();
  }

  openStatutoryPopup(employeeID, employeeName, empCode){
    this.salaryStructureService.setSalaryPopupVisibility(false);
    this.salaryStructureService.setStatutoryPopupVisibility(true);
    this.currentStatutoryEmployeeID=employeeID;
    //this.headerText =employeeName+"'s Statutory Details:";
    this.headerText=`${employeeName}'s (${empCode}) Statutory Details:`;
  }
  closePopUp(event){
    this.salaryStructureService.setStatutoryPopupVisibility(event);
    this.salaryStructureService.setSalaryPopupVisibility(event);
  }
}
