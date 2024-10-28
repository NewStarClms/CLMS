import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { SalarySlipService } from 'src/app/services/salary-slip.service';
import { User } from 'src/app/store/model/login.model';

@Component({
  selector: 'app-salary-slip',
  templateUrl: './salary-slip.component.html',
  styleUrls: ['./salary-slip.component.scss']
})
export class SalarySlipComponent implements OnInit {

  public month;
  public months;
  public year;
  public monthList=UI_CONSTANT.MONTH_LIST;
  public yearList=UI_CONSTANT.YEAR_LIST;
  public maindetailDiv:boolean;
  private _currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  userInfo:User = {} as User;
  empID: number;
  constructor(
    private salaryslipService:SalarySlipService,
    private coreService: AppCoreCommonService
  ) { 
    this._currentUserSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
        this.currentUser = this._currentUserSubject.asObservable();
  }

  ngOnInit(): void {
    const currentyear = new Date().getFullYear();
    this.year=currentyear.toString();
   // this.month = (new Date()).toLocaleString('default', { month: 'short' });
    this.month = this.coreService.getDefaultMonthForReport();
    this.months= this.month;
    this.maindetailDiv=true;
    this.currentUser.subscribe(res=>{
      if(res){
        this.userInfo = res;
        this.empID = this.userInfo.logOnUserDetail.employeeID;
      }
    });
  }

  private getUserFromLocalStorage(): User {
    try {
      return JSON.parse(localStorage.getItem(UI_CONSTANT.ConstValue.CurrentUser)!);
    } catch (error) {
      return null!;
    }
  }

  fngetData(){
    var datetime = '01-'+this.months+'-'+this.year;
    this.salaryslipService.downlodSalaryReport(datetime,this.empID);
  }
}
