import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { PayrollActionService } from 'src/app/services/payroll-action.service';
import { EmployeeVariableSalary } from 'src/app/store/model/payroll-action.model';

@Component({
  selector: 'app-variable-pay',
  templateUrl: './variable-pay.component.html',
  styleUrls: ['./variable-pay.component.scss']
})
export class VariablePayComponent implements OnInit {
  
  public monthList=UI_CONSTANT.MONTH_LIST;
  public yearList=UI_CONSTANT.YEAR_LIST;
  public month:string;
  public year:string;
  @Input() employeeID: number;
  @Output() closediv:EventEmitter<boolean>=new EventEmitter<boolean>(false);
  public employeeVariableSalary: EmployeeVariableSalary={} as EmployeeVariableSalary;


  constructor(private payrollActionService:PayrollActionService,) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    var year = new Date().getFullYear();
    this.year=year.toString();
    var month=new Date().getMonth();
    month= month>0 ? month-1 : month;
    this.month= this.monthList[month].value;
    this.getVariablePay();
  }

  getVariablePay(){
    const datetime = '01-'+this.month+'-'+this.year;
    this.payrollActionService.getEmployeeVariableSalary(this.employeeID,datetime).subscribe(res=>{
      if(res){
        this.employeeVariableSalary=res;
        if(res.monthYear!=null){
          this.employeeVariableSalary.monthYear=moment(res.monthYear, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
        }
      }
    });
  }
  updateVariableSalary(){
    if(this.employeeVariableSalary.monthYear!=null){
      this.employeeVariableSalary.monthYear=moment(this.employeeVariableSalary.monthYear, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.LONG_DATE_FORMAT);
    }
    this.payrollActionService.updateEmployeeVariableSalary(this.employeeVariableSalary);
    this.Close();
  }
  Close(){
    this.employeeVariableSalary = {} as EmployeeVariableSalary;
    this.closediv.emit(true);
  }
  keyPressNumeric(event) {
    AppUtil.validateNumbersWithDecimal(event);
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
}
