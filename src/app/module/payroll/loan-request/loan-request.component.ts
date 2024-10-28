import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { PayComponentService } from 'src/app/services/pay-component.service';
import { PayHeadsModel } from 'src/app/store/model/pay-component.model';
import { LoanRequestModel } from 'src/app/store/model/payroll-action.model';
import { BonusSlab } from 'src/app/store/model/payroll-statutory.model';
import { PayrollActionService } from '../../../services/payroll-action.service';

@Component({
  selector: 'app-loan-request',
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.scss']
})
export class LoanRequestComponent implements OnInit {

  public loanTypeOption:Array<any>=[];
  public interestTypeOption=UI_CONSTANT.INTRESTTYPE;
  public month;
  public year;
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public monthList=UI_CONSTANT.MONTH_LIST;
  public yearList=UI_CONSTANT.YEAR_LIST;
  
  loanRequestObj:LoanRequestModel= {} as LoanRequestModel;
  @Output() closediv = new EventEmitter<boolean>();
  public datepickerConfig: Partial<BsDatepickerConfig>;
  @Input() employeeID: number;
  //New Changes
  @Output() closeDialog:EventEmitter<boolean>=new EventEmitter<boolean>(false);
  public allDisabledField:boolean=true;
  public loanAmountLimits:number;
  public maxEmi:string;
  public loanEligibilityDay:string;    
//End
  constructor(
    private payrollActionService:PayrollActionService,
    private payComponentService:PayComponentService,
    private notificationService:NotificationService
  ) { 
    this.datepickerConfig = Object.assign(
      {},
      {
        containerClass: 'theme-default',
        adaptivePosition: true,
        dateInputFormat: 'DD-MMM-YYYY',
      }
    );
    
  }

  ngOnInit(): void {

    var years=new Date().getFullYear();
    this.year=years.toString();
    var months=new Date().getMonth();
    this.month=this.monthList[months].value;


   setTimeout(() => {
    this.payrollActionService.getEmpMappedComponent(this.employeeID).subscribe(res=>{
      if(res){
       let temploanAmountLimits  =AppUtil.deepCopy(res);
         this.loanAmountLimits=temploanAmountLimits[0].loanAmountLimit;
         this.maxEmi=temploanAmountLimits[0].maxEMI;
         this.loanEligibilityDay=temploanAmountLimits[0].loanEligibilityDays
        console.log('loan',res);
        const tempdeptList:PayHeadsModel[]=AppUtil.deepCopy(res);
        tempdeptList.map(x=>{
         this.loanTypeOption.push({
          value:x.payCode,
          key:x.payHeadName
         });
        })
      }
    });
   }, 1000);
   
  }
  fnupdateOption(e){

  }
  saveLoanRequest(){
    if(this.loanRequestObj.loanAmount <= this.loanAmountLimits){
     this.loanRequestObj.employeeID=this.employeeID
     var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
     var monthNumber = month >9 ? month:'0'+month
     this.loanRequestObj.deductFromMonthYear=this.year+'-'+monthNumber+'-01T00:00:00';
     //this.loanRequestObj.deductFromMonthYear= AppUtil.getLongDate(this.month,this.year);
     this.loanRequestObj.requireDate=moment(this.loanRequestObj.requireDate).format('yyyy-MM-DD')+'T00:00:00';
     console.log(this.loanRequestObj);
     this.payrollActionService.saveLoanRquest(this.loanRequestObj);
    }
    else{
     this.notificationService.showError('Loan Amount should be less than loanAmountLimits', UI_CONSTANT.SEVERITY.ERROR);
    }
 
   }
  keyPressNumbers(event){
    AppUtil.validateNumbers(event);
  }
  ClosePopup(){
    this.loanRequestObj = {} as LoanRequestModel;
  this.closeDialog.emit(false);
  }

  
}
