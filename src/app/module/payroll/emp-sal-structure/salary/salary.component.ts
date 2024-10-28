import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { PayGroupService } from 'src/app/services/pay-group.service';
import { SalaryStructureService } from 'src/app/services/salary-structure.service';
import { EmployeeSalaryStructure } from 'src/app/store/model/salary-structure.model';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {
  @Input() employeeID: number;
  empSalary : EmployeeSalaryStructure;
  paygroups:Array<any>=[];
  datepickerConfig: Partial<BsDatepickerConfig>;
 
 
  constructor(private payGroupService: PayGroupService,
    private salaryStructureService : SalaryStructureService) {
      this.datepickerConfig = Object.assign({}, {
        containerClass: 'theme-default',
        dateInputFormat: 'DD-MMM-YYYY',
        adaptivePosition: true,
        initCurrentTime: false
      });
     }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges){
    this.empSalary={} as EmployeeSalaryStructure;
    this.payGroupService.getPayGroupList().subscribe(res=>{
      if(res && res.policyes){
        this.paygroups = AppUtil.deepCopy(res.policyes);
      }
    });    
    this.fetchSalaryStructure(0);
  }

  saveSalaryStructure(){
    var tempEmpSalary: EmployeeSalaryStructure = AppUtil.deepCopy(this.empSalary);
    if (tempEmpSalary.salaryRevisionDate != null) {
      tempEmpSalary.salaryRevisionDate = moment(this.empSalary.salaryRevisionDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if (tempEmpSalary.arrearEffectiveDate != null) {
      tempEmpSalary.arrearEffectiveDate = moment(this.empSalary.arrearEffectiveDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if (tempEmpSalary.requestDate != null) {
      tempEmpSalary.requestDate = moment(this.empSalary.requestDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if (tempEmpSalary.approvedDate != null) {
      tempEmpSalary.approvedDate = moment(this.empSalary.approvedDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    tempEmpSalary.payComponents = [...tempEmpSalary.grossBenefitComponents,...tempEmpSalary.recurringDeductionComponents]
    
    this.salaryStructureService.saveSalaryStructure(tempEmpSalary);
  }

  closeDialog(){
    this.salaryStructureService.setSalaryPopupVisibility(false);
  }

  loadPayStructure(event){
    this.fetchSalaryStructure(event.value)
  }

  fetchSalaryStructure(policyID){
    this.salaryStructureService.fetchSalaryStructure(this.employeeID,policyID).subscribe(res=>{
      if(res && res.employees && res.employees.length>0){
        this.empSalary=AppUtil.deepCopy(res.employees[0]);
        if (this.empSalary.salaryRevisionDate != null  && moment(this.empSalary.salaryRevisionDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
          this.empSalary.salaryRevisionDate = moment(this.empSalary.salaryRevisionDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
        }
        else this.empSalary.salaryRevisionDate=null;
        if (this.empSalary.arrearEffectiveDate != null && moment(this.empSalary.arrearEffectiveDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
          this.empSalary.arrearEffectiveDate = moment(this.empSalary.arrearEffectiveDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
        }
        else this.empSalary.arrearEffectiveDate=null;
        if (this.empSalary.requestDate != null && moment(this.empSalary.requestDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
          this.empSalary.requestDate = moment(this.empSalary.requestDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
        }
        else this.empSalary.requestDate =null;
        if (this.empSalary.approvedDate != null && moment(this.empSalary.approvedDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
          this.empSalary.approvedDate = moment(this.empSalary.approvedDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
        }
        else this.empSalary.approvedDate =null;
      }
    // New Changes Date - 02/05/2024
     let tempAmount= this.empSalary.grossBenefitComponents.map(item => Number(item.amount)).reduce((prev, next) => prev + next);
     let totalDeduction = Number(this.empSalary.employeePF) + Number(this.empSalary.employeeESI) + Number(this.empSalary.employeeLWF);
     this.empSalary.grossSalary=tempAmount;
     this.empSalary.netInHandSalary=Number(this.empSalary.grossSalary) - Number(totalDeduction);
     // End
    });
  }

  calculateGrossSalary(event){
    if(this.empSalary.grossBenefitComponents){
      this.empSalary.grossSalary=this.empSalary.grossBenefitComponents.map(item => Number(item.amount)).reduce((prev, next) => prev + next);
      // New Changes Date - 02/05/2024
      let totalDeduction = Number(this.empSalary.employeePF) + Number(this.empSalary.employeeESI) + Number(this.empSalary.employeeLWF);
      this.empSalary.netInHandSalary=this.empSalary.grossSalary - totalDeduction;
     // End
    }
  }

  calculateNetInHandSalary(event){
     // New Changes Date - 02/05/2024
    // if(this.empSalary.grossBenefitComponents){
    //   let grossSalary=this.empSalary.grossBenefitComponents.map(item => Number(item.amount)).reduce((prev, next) => prev + next);
    //   let totalDeduction = Number(this.empSalary.employeePF) + Number(this.empSalary.employeeESI) + Number(this.empSalary.employeeLWF);
    //   if(this.empSalary.recurringDeductionComponents){
    //     totalDeduction = totalDeduction + this.empSalary.recurringDeductionComponents.map(item => Number(item.amount)).reduce((prev, next) => prev + next);
    //   }
    //   this.empSalary.netInHandSalary = grossSalary - totalDeduction;
    // }
  //End
      // New Changes Date - 02/05/2024
      let grossSalary=this.empSalary.grossSalary;
      let totalDeduction = Number(this.empSalary.employeePF) + Number(this.empSalary.employeeESI) + Number(this.empSalary.employeeLWF);
      if(this.empSalary.recurringDeductionComponents){
        totalDeduction = totalDeduction + this.empSalary.recurringDeductionComponents.map(item => Number(item.amount)).reduce((prev, next) => prev + next);
      }
      if(totalDeduction>0)
      {
        this.empSalary.netInHandSalary = grossSalary - totalDeduction;
      }
      else{
        this.empSalary.netInHandSalary=grossSalary;
      }
      //End 
  }
  
  keyPressNumbers(event) {
    AppUtil.validateNumbers(event);
  }
  keyPressNumeric(event) {
    AppUtil.validateNumbers(event);
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
}
