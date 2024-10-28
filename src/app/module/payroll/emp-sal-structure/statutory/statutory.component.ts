import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { SalaryStructureService } from 'src/app/services/salary-structure.service';
import { selectBankBranchState, selectDispensaryState, selectEmployeeMasterState } from 'src/app/store/app.state';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { BankBranch, Dispensary } from 'src/app/store/model/master-data.model';
import { EmployeeStatutory } from 'src/app/store/model/salary-structure.model';

@Component({
  selector: 'app-statutory',
  templateUrl: './statutory.component.html',
  styleUrls: ['./statutory.component.scss']
})
export class StatutoryComponent implements OnInit {
   @Input() employeeID: number;

  empStatutory : EmployeeStatutory;
  dispensaryList: Array<any>=[];
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  //public empTypeList: Array<any> = [];
  public empTypeList=UI_CONSTANT.SALARY_STRUCT_EMPLOYEE_TYPE;
  datepickerConfig: Partial<BsDatepickerConfig>;

  bankDetailformode: boolean;
  public bankbranchList: Array<any> = [];
  public paymodeList = UI_CONSTANT.PAYMENT_MODE;
  
  constructor(private _store: Store<any>, private salaryStructureService : SalaryStructureService) {
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
    // this._store.select(selectEmployeeMasterState).subscribe(response => {
    //   const tempempTypeList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeType);
    //   tempempTypeList.map(y => {
    //     this.empTypeList.push({
    //       empTypeID: y.value,
    //       empTypeName: y.key
    //     });
    //   });
    // });
    this._store.select(selectDispensaryState).subscribe(res => {
      if (res && res.dispensaryList) {
        const tempdispensaryList: Dispensary[] = AppUtil.deepCopy(res.dispensaryList);
        tempdispensaryList.map(x => {
          this.dispensaryList.push({
            dispensaryID: x.dispensaryID,
            dispensaryName: x.dispensaryName
          });
        });
      }
    });
    this._store.select(selectBankBranchState).subscribe(res => {
      if (res && res.bankbranchList) {
        const tempbankbranchList: BankBranch[] = AppUtil.deepCopy(res.bankbranchList);
        tempbankbranchList.map(x => {
          this.bankbranchList.push({
            bankBranchID: x.bankBranchID,
            bankBranchName: x.bankBranchName
          });
        });
      }
      if (res && res.bankbranchList) {
        this.bankbranchList = UI_CONSTANT.PLEASE_SELECT.concat(this.bankbranchList);
      }
    });
    this.salaryStructureService.fetchStatutoryDetail(this.employeeID).subscribe(res=>{
       if(res && res.employees && res.employees.length>0){
          this.empStatutory=AppUtil.deepCopy(res.employees[0]);
          if (this.empStatutory.dateOfJoinForm5 != null  && moment(this.empStatutory.dateOfJoinForm5, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
            this.empStatutory.dateOfJoinForm5 = moment(this.empStatutory.dateOfJoinForm5, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
          }
          else this.empStatutory.dateOfJoinForm5=null;
          if (this.empStatutory.dateOfLeavingForm10 != null && moment(this.empStatutory.dateOfLeavingForm10, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
            this.empStatutory.dateOfLeavingForm10 = moment(this.empStatutory.dateOfLeavingForm10, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
          }
          else this.empStatutory.dateOfLeavingForm10=null;
          if (this.empStatutory.vpfEffectiveDate != null && moment(this.empStatutory.vpfEffectiveDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
            this.empStatutory.vpfEffectiveDate = moment(this.empStatutory.vpfEffectiveDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
          }
          else this.empStatutory.vpfEffectiveDate =null;
         this.fngetpaymentmode(this.empStatutory.paymentModeID);
       }else{
        this.empStatutory = {} as EmployeeStatutory;
       }
    });
  }
  fngetpaymentmode(params) {
    if (params == 3) {
      this.bankDetailformode = true;
    } else {
      this.bankDetailformode = false;
    }
  }
  saveStatutoryData(){
    var tempEmpStatutory: EmployeeStatutory = AppUtil.deepCopy(this.empStatutory);
    if (tempEmpStatutory.dateOfJoinForm5 != null) {
      tempEmpStatutory.dateOfJoinForm5 = moment(this.empStatutory.dateOfJoinForm5, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if (tempEmpStatutory.dateOfLeavingForm10 != null) {
      tempEmpStatutory.dateOfLeavingForm10 = moment(this.empStatutory.dateOfLeavingForm10, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if (tempEmpStatutory.vpfEffectiveDate != null) {
      tempEmpStatutory.vpfEffectiveDate = moment(this.empStatutory.vpfEffectiveDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if(tempEmpStatutory.npsPercentage==null) tempEmpStatutory.npsPercentage=0;
    this.salaryStructureService.saveStatutoryDetail(tempEmpStatutory);
  }
  closeDialog(){
    this.salaryStructureService.setStatutoryPopupVisibility(false);
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
