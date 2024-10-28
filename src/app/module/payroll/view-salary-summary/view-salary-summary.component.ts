import { Component, Input, OnInit, EventEmitter, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { PayrollActionService } from 'src/app/services/payroll-action.service';
import { MonthlySalaryDetails, MonthlySalaryPaidDetails, MontylySalaryTotalDetails, MontylySalaryTotalDetails1, SalaryDetail, SalarySummaryModel } from 'src/app/store/model/payroll-action.model';

@Component({
  selector: 'app-view-salary-summary',
  templateUrl: './view-salary-summary.component.html',
  styleUrls: ['./view-salary-summary.component.scss']
})
export class ViewSalarySummaryComponent implements OnInit {

  @Input() employeeID: number;
  @Input() monthYear : string;
  @Output() close: EventEmitter<boolean> = new EventEmitter(false);
  public monthlySalaryDetails: MonthlySalaryDetails[] = [];
  public monthlySalaryPaidDetails:MonthlySalaryPaidDetails[] = [];
  public montylySalaryTotalDetails:MontylySalaryTotalDetails=null;
  public montylySalaryTotalDetails_1:MontylySalaryTotalDetails=null;
  public monthlySalaryPaidDetailsAddition: MonthlySalaryPaidDetails[];
  public monthlySalaryPaidDetailsDeduction: MonthlySalaryPaidDetails[];
  public summaryDetail: SalaryDetail = null;

  constructor(
    private payrollActionService: PayrollActionService
  ) { }

  ngOnInit(): void {
  }
  ngOnChanges(change: SimpleChanges){
    this.payrollActionService.getSalaryMonthlySummaryDetail(this.employeeID,this.monthYear).subscribe(sal=>{
      if(sal.monthlySalaryDetails.employeeID){
        this.summaryDetail = sal;
        //New Changes
        this.monthlySalaryDetails=[];
        //End
        this.monthlySalaryDetails.push(AppUtil.deepCopy(sal.monthlySalaryDetails));
        this.monthlySalaryPaidDetails= AppUtil.deepCopy(sal.monthlySalaryPaidDetails);
        this.monthlySalaryPaidDetailsAddition=this.monthlySalaryPaidDetails.filter(x=>x.payComponentType === 'A');
        this.monthlySalaryPaidDetailsDeduction=this.monthlySalaryPaidDetails.filter(x=>x.payComponentType === 'D');
        this.montylySalaryTotalDetails=AppUtil.deepCopy(sal.montylySalaryTotalDetails);
        this.montylySalaryTotalDetails_1=AppUtil.deepCopy(sal.montylySalaryTotalDetails1);
        console.log('summaryDetail',this.summaryDetail);
      }
    })
  }
  closeSalary(){
    this.close.emit(false);
  }
}
