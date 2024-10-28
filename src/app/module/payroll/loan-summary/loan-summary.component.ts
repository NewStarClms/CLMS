import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { NotificationService } from 'src/app/common/notification.service';
import { LoanEmiDetails, LoanSummaryModel } from 'src/app/store/model/payroll-action.model';
import { PayrollActionService } from '../../../services/payroll-action.service';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.scss']
})
export class LoanSummaryComponent implements OnInit {

  @Input() employeeId:number;
  @Output() close:EventEmitter<boolean> = new EventEmitter(false);
  loanSummaryDetail: Array<LoanSummaryModel>=[];
  loanDetails:LoanSummaryModel=null;
  loanEmiDetails:Array<LoanEmiDetails>=[];
  displayEmi: boolean;
  editEMI: boolean=false;
  expandRowNumber: number=0;
  adjustmentType: number=1;
  adjustedAmount: number;
  adjustedEMI: number;
  adjustmentRemark: string="";
  editableEMI: LoanEmiDetails;
  constructor(
    private payrollActionService: PayrollActionService,
    private notificationService: NotificationService

  ) { }

  ngOnInit(): void {
    this.payrollActionService.getLoanSummaryDetail(this.employeeId).subscribe(sal=>{
      if(sal.length>0){
        this.loanSummaryDetail=AppUtil.deepCopy(sal);
        console.log('salarySummaryDetail',this.loanSummaryDetail);
      }
    })
  }
  onCellClicked(loanDetail){
    this.displayEmi = true;
    this.loanDetails= AppUtil.deepCopy(loanDetail);
    this.loanEmiDetails = this.loanDetails.loanEmiDetails;
    this.editEMI=false;
    this.expandRowNumber=-1;
    this.adjustmentType=1;
    this.adjustedEMI=0;
    this.adjustmentRemark="";
    this.adjustedEMI=0;
  }
  closeSummary(){
    this.close.emit(true);
  }

  closeDailog(){
    this.displayEmi = false;
    // this.close.emit(true);
  }

  openAdjustEMI(index, emi){
    this.editEMI=!this.editEMI;
    this.expandRowNumber=index;
    this.editableEMI=emi;
    emi.outstandingEMI=this.loanEmiDetails.filter(em=>em.processed===0).length;
  }

  submitEMIAdjustment(emi){
    if(this.adjustmentType===1 && this.adjustedAmount <=0){
      this.notificationService.showWarning("Adjustment amount is required","Amount Required")
    }
    else if(this.adjustmentType===3 && (this.adjustedAmount <=0 || this.adjustedEMI <=0)){
      this.notificationService.showWarning("Adjustment amount & number of EMI both are required","Required")
    }
    else{
      let payload={
        employeeID: emi.employeeID,
        loanDisbursalID: emi.loanDisbursalID,
        //"monthYear": "2023-12-08T16:59:44.471Z",
        monthYear: emi.monthYear,
        adjustmentAmount: this.adjustedAmount,
        adjustmentType: this.adjustmentType,
        remarks: this.adjustmentRemark,
        numberOfEMI: this.adjustedEMI
      }
      this.payrollActionService.saveLoanEMIAdjustment(payload).subscribe(res=>{
        if(res){
          this.notificationService.showSuccess(res.message,res.message);
        }
      })
    }
  }

}
