import { Component, OnInit } from '@angular/core';
import { PayrollActionService } from '../../../services/payroll-action.service';
import { map } from 'rxjs/operators';
import { EmployeeYearlyStatistics, SalarySummaryModel } from 'src/app/store/model/payroll-action.model';
import { AppUtil } from '../../../common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AuthService } from 'src/app/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { currentUserMenuItems } from 'src/app/store/app.state';
import { Menu, MenuRights } from 'src/app/store/model/usermanage.model';

@Component({
  selector: 'app-action-payroll',
  templateUrl: './action-payroll.component.html',
  styleUrls: ['./action-payroll.component.scss']
})
export class ActionPayrollComponent implements OnInit {
  // public single: boolean;
  // public multiple: boolean;
  // public actiontype: any;
  public employeeId: number=0;
  public policyType: number;
  public financialYearList: Array<any> = [];
  public fYear: number = null;
  public rowData: Array<any> = [];
  public columnDefs: Array<any> = [];
  public employeeYearData: Array<EmployeeYearlyStatistics> = [];
  public salarySummaryDetail: Array<SalarySummaryModel> = [];
  showStaticsData: boolean;
  showSummary: boolean;
  showloanSummary: boolean;
  showBonusSummary: boolean;
  public isrequestLoan= false;
  public displayRequestFrm= false;
  public requestFrmDiv:boolean=false;
  paidDaysrequestFrmDiv: boolean;
  displayPaidDaysRequestFrm: boolean;
  isrequestPaidDays: boolean;
  encashPaymentrequestFrmDiv: boolean;
  isrequestEncashPayment: boolean;
  displayEncashPaymentRequestFrm: boolean;
  variablePayFrmDiv: boolean;
  displayVariablePayFrmDiv: boolean;
  isVariablePayment: boolean;
  showBonusProcess: boolean;
  public menuItems: Array<Menu>= [];
  public menuRights: Array<MenuRights>= [];
  public currentMenuRights: Array<MenuRights>= [];
  public showingSingleEmployeeAction: boolean=false;
  public backgroundColor: Array<string> = UI_CONSTANT.BackgroundColors;
  public showAttendanceMenu: boolean=false;
  public showEmployeeDepDesiName:string;
  public menuAction: any ={
    Single: {
      LoanEntry: 220,
      PaidDays: 224,
      VariableSalary: 225
    },
    Multiple: {
      EncashPayment: 226,
      Bonus: 229
    }
  }

  constructor(
    private payrollActionService: PayrollActionService,
    private notificationService:NotificationService,
    private authenticationService:AuthService,
    private _store: Store<any>,
    private activatedRoute:ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.payrollActionService.getFinancialYear().subscribe(res => {
      if (res.length > 0) {
        res.map(x => {
          this.financialYearList.push({
            key: x.startYear + '-' + x.endYear,
            value: x.financialYearID
          });
          if(x.currentFinancialYear){
            this.fYear=x.financialYearID;
          }
        })
      }
    });
    this._store.select(currentUserMenuItems).subscribe(response=>{
      this.menuRights=[];
      if (response && response.currentMenuItemsList) {
       var attendanceMenuID= Number(this.activatedRoute.snapshot.params.id);
        response.currentMenuItemsList.menuItems?.forEach(root => {
           root.childs.forEach(child => {
              if(child.menuId==attendanceMenuID){
                this.menuItems=child.childs;
                child.childs.forEach(element => {
                  this.menuRights.push(...element.menuRights);
                });
              }
                
           });
         
       });
      }
    });
  }

  onChange(menuID) {
    //this.actiontype = e.target.value;
    this.showAttendanceMenu=true;
    this.showingSingleEmployeeAction= menuID==223? true: false;
    this.currentMenuRights= this.menuRights.filter(m=>m.menuID==menuID && m.menuRightTypeID==3);
    if (this.showingSingleEmployeeAction) {
      this.authenticationService.setGlobalFilterVisibility(false);
    }
    else {
      this.showStaticsData = false;
      this.showloanSummary = false;
      this.showSummary = false;
      this.authenticationService.setGlobalFilterVisibility(true);
    }
  }
  
  menuClicked(menuRightID: number){
    if(this.showingSingleEmployeeAction && this.employeeId ==0) {
       this.notificationService.showError('Please Select Employee', UI_CONSTANT.SEVERITY.ERROR);
        return;
    }
    if(menuRightID ===this.menuAction.Single.LoanEntry){
      this.showBonusProcess=false;
      this.displayRequestFrm = true;
      this.isrequestLoan = true;
      this.requestFrmDiv=true;
    }
    else  if(menuRightID ===this.menuAction.Single.PaidDays){
      this.showBonusProcess=false;
      this.paidDaysrequestFrmDiv = true;
      this.isrequestPaidDays = true;
      this.displayPaidDaysRequestFrm=true;
    }
    else  if(menuRightID ===this.menuAction.Single.VariableSalary){
      this.displayVariablePayFrmDiv=true;
      this.variablePayFrmDiv=true;
      this.isVariablePayment = true;
    }
    else  if(menuRightID ===this.menuAction.Multiple.EncashPayment){
      this.showBonusProcess=false;
      this.encashPaymentrequestFrmDiv = true;
      this.isrequestEncashPayment = true;
      this.displayEncashPaymentRequestFrm=true;
      
    }
    else  if(menuRightID ===this.menuAction.Multiple.Bonus){
      this.showBonusProcess=true;
    }
  }

  getRequestDetail() {
    this.showStaticsData = true;
    this.payrollActionService.getEmployeeYearStatics(this.employeeId, this.fYear).subscribe(empData => {
      if (empData) {
        this.employeeYearData = AppUtil.deepCopy(empData);
      }
    });
  }
  getSummaryDetail(taskAction) {
    this.showStaticsData = false;
    if (taskAction.toLowerCase() === 'salary') {
      this.showSummary = true;
      this.showloanSummary = false;
    } else if (taskAction.toLowerCase() === 'loan') {
      this.showloanSummary = true;
      this.showSummary = false;
    } else if (taskAction.toLowerCase() === 'bonus') {
      this.showBonusSummary = true;
    }
  }
  getLoanSummary() {
    this.showStaticsData = false;
    this.showSummary = true;
  }
  onCellClicked(params) {
  }
  onGetEmployeeDetail(event) {
    this.employeeId = event.data;
    this.showEmployeeDepDesiName=event.column;
    this.policyType = 2;
    if (this.employeeId != 0) {
    }
    else {
      console.log('error');
    }
  }
  // requestLoan(){
  //   this.showBonusProcess=false;
  //   if(this.employeeId!=0){
  //     this.displayRequestFrm = true;
  //   this.isrequestLoan = true;
  //   this.requestFrmDiv=true;
  //   }else{
  //     this.notificationService.showError('Please Select Employee', UI_CONSTANT.SEVERITY.ERROR);
  //   }
  // }
  // requestPaidDays(){
  //   this.showBonusProcess=false;
  //   if(this.employeeId!=0){
  //     this.paidDaysrequestFrmDiv = true;
  //   this.isrequestPaidDays = true;
  //   this.displayPaidDaysRequestFrm=true;
  //   }else{
  //     this.notificationService.showError('Please Select Employee', UI_CONSTANT.SEVERITY.ERROR);
  //   }
  // }
  // requestEncashPayment(){
  //   this.showBonusProcess=false;
  //     this.encashPaymentrequestFrmDiv = true;
  //   this.isrequestEncashPayment = true;
  //   this.displayEncashPaymentRequestFrm=true;
    
  // }
  // requestBonusProcess(){
  //   this.showBonusProcess=true;
  // }
  updateModel(e) {

  }
  // openVariablePayForm(){
  //   if(this.employeeId!=0){
  //      this.displayVariablePayFrmDiv=true;
  //       this.variablePayFrmDiv=true;
  //       this.isVariablePayment = true;
  //   }
  //   else{
  //     this.notificationService.showError('Please Select Employee', UI_CONSTANT.SEVERITY.ERROR);
  //   }
  // }
  closeSummary() {
    this.showStaticsData = true;
    this.showSummary = false;
    this.showloanSummary = false;
    this.getRequestDetail();
  }
  closeDailog(){
    this.displayRequestFrm = false;
    this.requestFrmDiv=false;
    this.paidDaysrequestFrmDiv=false;
    this.displayPaidDaysRequestFrm=false;
    this.displayVariablePayFrmDiv=false;
    this.variablePayFrmDiv=false;
    this.encashPaymentrequestFrmDiv = false;
    this.displayEncashPaymentRequestFrm=false;
  }
  closePopup(event){
    this.paidDaysrequestFrmDiv=event;
    this.displayPaidDaysRequestFrm=event;
    this.encashPaymentrequestFrmDiv = event;
    this.displayEncashPaymentRequestFrm=event;
    this.displayVariablePayFrmDiv=event;
    this.variablePayFrmDiv=event;
  }
}
