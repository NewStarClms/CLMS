import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { MonthlySalaryDetails, MonthlySalaryPaidDetails, MontylySalaryTotalDetails, MontylySalaryTotalDetails1, SalaryDetail, SalarySummaryModel } from 'src/app/store/model/payroll-action.model';
import { PayrollActionService } from '../../../services/payroll-action.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';

@Component({
  selector: 'app-salary-summary',
  templateUrl: './salary-summary.component.html',
  styleUrls: ['./salary-summary.component.scss']
})
export class SalarySummaryComponent implements OnInit {

  @Input() employeeId:number;
  @Input() financialYear:number;
  @Output() close:EventEmitter<boolean> = new EventEmitter(false);
  salarySummaryDetail: Array<SalarySummaryModel> = [];
  public displaysalary=false;
  public monthYear:string=null;
  
  
  constructor(
    private payrollActionService:PayrollActionService,
    private router:Router,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.payrollActionService.getSalarySummaryDetail(this.employeeId,this.financialYear).subscribe(sal=>{
      if(sal){
        this.salarySummaryDetail=AppUtil.deepCopy(sal);
        console.log('salarySummaryDetail',this.salarySummaryDetail);
      }
    })
  }
  onCellClicked(summary, taskAction){
    const summaryInfo:SalarySummaryModel =AppUtil.deepCopy(summary);

    if(taskAction.toLowerCase()=== 'view'){
      this.monthYear = summaryInfo.monthYear;
      this.displaysalary= true;
    }
    if(taskAction.toLowerCase()=== 'delete'){
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.UNPROCESS_SALARY_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const empidArr: number[]= [];
          empidArr.push(summaryInfo.employeeID);
          this.payrollActionService.unprocessEmployeeSalaryByMonth(empidArr, summaryInfo.monthYear);
        },
        reject: (type) => {
            switch(type) {
                case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                    this.notificationService.showError('Comfirmation Rejected', null);
                break;
                case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                  this.notificationService.showWarning('Comfirmation Canceled',null);
                break;
            }
        }
    });
    }
    if(taskAction.toLowerCase()=== 'process'){
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.PROCESS_SALARY_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.PROCESS_SALARY.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const empidArr: number[]= [];
          empidArr.push(summaryInfo.employeeID);
          this.payrollActionService.processEmployeeSalaryByMonth(empidArr, summaryInfo.monthYear);
        },
        reject: (type) => {
            switch(type) {
                case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                    this.notificationService.showError('Comfirmation Rejected', null);
                break;
                case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                  this.notificationService.showWarning('Comfirmation Canceled',null);
                break;
            }
        }
    });
    }
    
  }
  closeSummary(){
    this.close.emit(true);
  }
  closeDailog(){
    this.displaysalary = false;
  }
}
