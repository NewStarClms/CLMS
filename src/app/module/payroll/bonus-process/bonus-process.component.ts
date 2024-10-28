import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { BonusProcessService } from 'src/app/services/bonus-process.service';
import { DownloadService } from 'src/app/services/download.service';
import { PayrollActionService } from 'src/app/services/payroll-action.service';
import { BonusProcessEmployee, BonusProcessPayload } from 'src/app/store/model/bonus-process.model';
import { GridRendererComponent } from '../../masters/masters.module';

@Component({
  selector: 'app-bonus-process',
  templateUrl: './bonus-process.component.html',
  styleUrls: ['./bonus-process.component.scss']
})
export class BonusProcessComponent implements OnInit {
  public bonusColumnDefs!: any[];
  public employeeRowData: Array<BonusProcessEmployee> = [];
  public selectedEmployees: Array<BonusProcessEmployee> = [];
  public monthList = UI_CONSTANT.MONTH_LIST;
  public yearList = UI_CONSTANT.YEAR_LIST;
  public fromMonth: any;
  public fromYear: any;
  public toMonth: any;
  public toYear:any;
  public payMonth: any;
  public payYear: any;
  public financialYearList: Array<any>=[];
  public selectedFinancialYearID;
  public processStatuses = UI_CONSTANT.BONUS_PROCESS_STATE_LIST;
  public selectedProcessStatus;
  public remark:string;
  public payWithSalary: boolean;
  public showProcessBonusGrid: boolean;
  public showUnProcessBonusGrid: boolean;
  public showProcessBonusDialog: boolean;
  public showDeleteBonusDialog: boolean; 
  public payWithSalaryOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public currentProcessStatus:string="P";

  constructor(private notificationService:NotificationService,
    private payrollActionService: PayrollActionService,
    private bonusProcessService: BonusProcessService,
    private commonService: AppCoreCommonService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.payrollActionService.getFinancialYear().subscribe(res => {
      if (res.length > 0) {
        res.map(x => {
          this.financialYearList.push({
            key: x.startYear + '-' + x.endYear,
            value: x.financialYearID
          });
          if(x.currentFinancialYear){
            this.selectedFinancialYearID=x.financialYearID;
          }
        })
      }
    });
    this.fromMonth=this.commonService.getDefaultMonthForReport();
    this.toMonth=this.commonService.getDefaultMonthForReport();
    this.fromYear=this.commonService.getDefaultYearForReport();
    this.toYear=this.commonService.getDefaultYearForReport();
  }
 
  onCellClicked(params){
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === "delete") {
         this.showDeleteBonusDialog=true;
        
      }
    }
  }
  closeDialog(){
     this.showProcessBonusDialog=false;
     this.showDeleteBonusDialog=false;
  }


  openProcessUnProcessDialog(){
    this.remark="";
    this.payYear=this.toYear;
    if(this.selectedEmployees && this.selectedEmployees.length>0){
      if(this.currentProcessStatus=="U"){
        this.showProcessBonusDialog=true;
        this.showDeleteBonusDialog=false;
      }
      else {
        this.showDeleteBonusDialog=true;
        this.showProcessBonusDialog=false;
      }
   } else{
    this.notificationService.showError("Please select employee first",UI_CONSTANT.SEVERITY.ERROR);
  }
   
  }
  prepareForProcessUnProcessBonus(){
    var employeeIDs= this.selectedEmployees?.map(u=>u.employeeID);
    if(this.currentProcessStatus=="P")
      employeeIDs=this.selectedEmployees?.map(u=>u.bonusDetailID);
    if(employeeIDs && employeeIDs.length>0){
       this.processUnProcessBonus(employeeIDs);
    }
    else{
      this.notificationService.showError("Please select employee first",UI_CONSTANT.SEVERITY.ERROR);
    }
  }

  processUnProcessBonus(employeeIDs: Array<number>){
    var fromMonthYear = '01-' + this.fromMonth + '-' + this.fromYear;
    var fromMonthYearDateString = moment(fromMonthYear, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    var toMonthYear = '01-' + this.toMonth + '-' + this.toYear;
    var toMonthYearDateString = moment(toMonthYear, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    var processBonusModel: BonusProcessPayload={} as BonusProcessPayload;
    processBonusModel.employeeIdes=employeeIDs;
    processBonusModel.financialYearID=this.selectedFinancialYearID;
    processBonusModel.fromDate=fromMonthYearDateString;
    processBonusModel.toDate=toMonthYearDateString;
    if(this.payMonth && this.payYear){
       var payMonthYear = '01-' + this.payMonth + '-' + this.payYear;
       var payMonthYearDateString = moment(payMonthYear, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
       processBonusModel.payMonthYear=payMonthYearDateString;
    }
    processBonusModel.payWithSalary=this.payWithSalary;
    processBonusModel.remark=this.remark;
    if(this.currentProcessStatus=="U") {
      this.bonusProcessService.processEmployeeBonus(processBonusModel).subscribe((res)=>{
         this.closeDialog();
         this.loadBonusData();
      });
    } else{
      this.bonusProcessService.unProcessEmployeeBonus(processBonusModel).subscribe((res)=>{
          this.closeDialog();
          this.loadBonusData();
      });
    }
  }

  loadBonusData(){
    this.selectedEmployees=[];
    var fromMonthYear = '01-' + this.fromMonth + '-' + this.fromYear;
    var fromMonthYearDateString = moment(fromMonthYear, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    var toMonthYear = '01-' + this.toMonth + '-' + this.toYear;
    var toMonthYearDateString = moment(toMonthYear, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    this.currentProcessStatus= AppUtil.deepCopy(this.selectedProcessStatus);
    if(this.selectedProcessStatus=="P"){
      this.bonusColumnDefs = this.bonusProcessService.prepareColumnForProcessEmployeeGrid();
      this.showProcessBonusGrid=true;
      this.showUnProcessBonusGrid=false;
    }
    else{
      this.bonusColumnDefs=this.bonusProcessService.prepareColumnForUnProcessEmployeeGrid();
      this.showProcessBonusGrid=false;
      this.showUnProcessBonusGrid=true;
    }  
    this.bonusProcessService.fetchEmployeeList(this.selectedFinancialYearID,
      fromMonthYearDateString,toMonthYearDateString,this.selectedProcessStatus).subscribe((res)=>{
         if(res){
            this.employeeRowData=res;
         }
      });
  }

  checkUnCheckAllClicked(chbSelectAll){
    if(chbSelectAll.checked){
     this.selectedEmployees= this.employeeRowData;
    }
    else{
      this.selectedEmployees=[];
    }
  }
 
  checkUnCheckRowClicked(params){
    if(params.isSelected){
      this.selectedEmployees.push(params.data);
    }
    else{
      this.selectedEmployees=this.selectedEmployees.filter(e=>e.employeeID!=params.data.employeeID);
    }
  }
}
