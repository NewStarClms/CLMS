import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { PayrollActionService } from 'src/app/services/payroll-action.service';
import { PaidDaysRequest } from 'src/app/store/model/payroll-action.model';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SalaryDashboardService } from 'src/app/services/salary-dashboard.service';
import { SalaryProcess } from 'src/app/store/model/attendance-process.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-paid-days-request',
  templateUrl: './paid-days-request.component.html',
  styleUrls: ['./paid-days-request.component.scss']
})
export class PaidDaysRequestComponent implements OnInit {
  @Input() employeeID: number;
  public salaryproInfo={} as SalaryProcess;
  public paidmonth:string;
  public paidyear:string;
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public monthList=UI_CONSTANT.MONTH_LIST;
  public yearList=UI_CONSTANT.YEAR_LIST;
  public paidDaysInfo = {} as PaidDaysRequest;
  // @Output() closediv = new EventEmitter<boolean>();
  @Output() closediv:EventEmitter<boolean>=new EventEmitter<boolean>(false);
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public monthYears:string
  public optimisticDated:string;
  public deductFromList=UI_CONSTANT.DEDUCT_FORM_LIST;
  constructor(private payrollActionService:PayrollActionService,
    private salaryDasboardService:SalaryDashboardService) { 
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
    var years = new Date().getFullYear();
    this.paidyear=years.toString();
    var months = new  Date().getMonth();
    this.paidmonth=this.monthList[months-1].value
    
    this.getPaidDaysRequestDetail();
  }
  getPaidDaysRequestDetail(){
    const datetime = '01-'+this.paidmonth+'-'+this.paidyear//AppUtil.getLongDate(this.month,this.year)
    console.log(datetime)
    this.payrollActionService.getPaidDaysDetail(this.employeeID,datetime).subscribe(res=>{
      if(res && res.data){
        console.log("res",res.data)
        this.paidDaysInfo=res.data;
        console.log("sa",this.paidDaysInfo)
       
        
        if(res.data.monthYears!=null){
          this.paidDaysInfo.monthYear=moment(res.data.monthYears, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
        }
        else{
          this.paidDaysInfo.monthYear;
        }
        if(this.optimisticDated!=null){
          this.paidDaysInfo.optimisticDate=moment(this.optimisticDated, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
        }
      }
    })
  }
  Close(){
    this.paidDaysInfo = {} as PaidDaysRequest;
    this.closediv.emit(true);
  }
  getoverTimeMinute(event){
    this.paidDaysInfo.overTimeMinute=moment(event, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
  }
  getworkingMinute(event){
    this.paidDaysInfo.workingMinute=moment(event, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
  }
  getoverTimeArrearMinute(event){
    this.paidDaysInfo.overTimeArrearMinute=moment(event, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
  }
  getearlyMinute(event){
    this.paidDaysInfo.earlyMinute=moment(event, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
  }
  getlateMinute(event){
    this.paidDaysInfo.lateMinute=moment(event, UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
  }
  SalaryProcess(){
    var month = new Date(`${this.paidmonth} 1, ${this.paidyear}`).getMonth() + 1;
    var monthNumber = month >9 ? month:'0'+month
    this.salaryproInfo.employeeIdes = [this.employeeID];
    this.salaryproInfo.monthYear=this.paidyear + '-' + monthNumber + '-01T00:00:00';
    this.salaryproInfo.actionType = "P";
    this.salaryDasboardService.saveSalaryProcess(this.salaryproInfo);
  }
  savePaidDaysRequest(){
    if(this.monthYears!=null){
      this.paidDaysInfo.monthYear=moment(this.monthYears, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.LONG_DATE_FORMAT);
    }
    if(this.optimisticDated!=null){
      this.paidDaysInfo.optimisticDate=moment(this.optimisticDated, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.LONG_DATE_FORMAT);
    }
    console.log(this.paidDaysInfo)
    this.payrollActionService.savePaidDaysRquest(this.paidDaysInfo);
  }
  keyPressNumbers(event){
    AppUtil.validateNumbers(event);
  }
  keyPressNumbersWithDecimal(event){
    AppUtil.validateNumbersWithDecimal(event);
  }
}
