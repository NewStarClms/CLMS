import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PayComponentService } from '../../../../services/pay-component.service';
import { RemoteService } from '../../../../common/remote.service';
import { PayComponentModel, PayHeadsModel } from '../../../../store/model/pay-component.model';
import { selectPayHeadsState } from '../../../../store/payroll.app.state';
import { AppUtil } from '../../../../common/app-util';
import { UI_CONSTANT } from '../../../../common/constants/ui-constants';
import { selectLeaveMasterState } from 'src/app/store/app.state';
import { LeaveModel } from 'src/app/store/model/master-data.model';
import { LeaveMasterService } from 'src/app/services/leave-master.service';

@Component({
  selector: 'app-add-edit-pay-component',
  templateUrl: './add-edit-pay-component.component.html',
  styleUrls: ['./add-edit-pay-component.component.scss']
})
export class AddEditPayComponentComponent implements OnInit {

  headerdialogName:string="Add Pay Component";
  labelName:string="Save";
  public payCommInfo:PayComponentModel= {} as PayComponentModel;
  public payHeadList:Array<{key:string,value:number}>=[];
  public payHeadListData: Array<PayHeadsModel> = [];
  public stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public roundingOption = UI_CONSTANT.ROUNDING_OPTION;
  public interestTypeOption = UI_CONSTANT.INTEREST_TYPE
  public isLoanPayHead = false;
  //New Changes
  public isLeaveEncash:boolean;
  public leaveTypeList:Array<any>=[];
  //End
  public payheadCurrentData: PayHeadsModel= {} as PayHeadsModel;
  constructor(
    private _store: Store<any>,
    private payComponentService: PayComponentService,
    private router: Router,
    private remoteService: RemoteService<any>,
    private activateRouter: ActivatedRoute,
    private leaveService: LeaveMasterService,
  ) {
    this.leaveService.fetchLeaveData();
   }

  ngOnInit(): void {
    const _payHeadSubscribe = this._store.select(selectPayHeadsState)
    if (Number(this.activateRouter.snapshot.params.id) != 0) {
        _payHeadSubscribe.subscribe(res=>{
          if(res && res.payheadList){
            this.payHeadListData = AppUtil.deepCopy(res.payheadList);
            res.payheadList.map(x=>{
              this.payHeadList.push({key:x.payHeadName, value: x.payHeadID});
            });
          }
        });
        this.payComponentService.getPayComponentsbyPayCode(this.activateRouter.snapshot.params.id).subscribe(res=>{
          if(res){
            this.payCommInfo = AppUtil.deepCopy(res[0]);
            this.fnupdateModel(this.payCommInfo.payHeadID);
            this.payCommInfo.taxable = 'N';
            this.setDefaultPayHeadData(this.payCommInfo.payHeadID);
            console.log('payComponentName',this.payCommInfo,this.payHeadList);
          }
        });
        this.headerdialogName="Update Pay Component";
        this.labelName="Update";
     } 
     else {
      _payHeadSubscribe.subscribe(res=>{
        if(res && res.payheadList){
          this.payHeadListData = AppUtil.deepCopy(res.payheadList);
          res.payheadList.map(x=>{
            this.payHeadList.push({key:x.payHeadName, value: x.payHeadID});
          });
          this.payCommInfo.payCode = '';
          this.payCommInfo.taxable = 'N';
          this.payCommInfo.claimFrequency="0"
          this.payCommInfo.claimRequestLimit=0
          this.payCommInfo.claimWindowPeriodFrom=0
          this.payCommInfo.claimWindowPeriodTo=0
          this.payCommInfo.payHeadID = this.payHeadList[0].value;
          this.setDefaultPayHeadData(this.payCommInfo.payHeadID);
        }
      });
    }

    //New Changes
    // this._store.select(selectLeaveMasterState).subscribe(res => {
    //   if (res && res.leavelList) {
    //     const templeaveTypeList: LeaveModel[] = AppUtil.deepCopy(res.leavelList);
    //       templeaveTypeList.map(y => {
    //           this.leaveTypeList.push({
    //             leaveID: y.leaveID,
    //             leaveName: y.leaveName + ' ( '+y.leaveCode+') '
    //           });
    //       });
    //   }
    // });
    
    //End

  }
  fnupdateOption(e){

  }
  fnupdateModel(e){
    console.log(e,'payhead');
    this.setDefaultPayHeadData(e);
    const tempPayhead = this.payHeadList.filter(x=> x.value === e)[0];
    console.log('tempPayhead',tempPayhead);
    if(this.payheadCurrentData.payHeadID===8){
      this.isLoanPayHead = true;
    }
    else{
      this.isLoanPayHead = false;
    }

    //New Changes
    if( this.payheadCurrentData.payHeadID===12){
      this.isLeaveEncash = true;
      this._store.select(selectLeaveMasterState).subscribe(res => {
        if (res && res.leavelList) {
          const templeaveTypeList: LeaveModel[] = AppUtil.deepCopy(res.leavelList);
            templeaveTypeList.map(y => {
                this.leaveTypeList.push({
                  leaveID: y.leaveID,
                  leaveName: y.leaveName + ' ( '+y.leaveCode+') '
                });
            });
        }
      });
    }
    else{
      this.isLeaveEncash=false;
      this.payCommInfo.leaveID=0
    }
//End

  }
  setDefaultPayHeadData(id){
    const payheadData: PayHeadsModel = this.payHeadListData.filter(y=> y.payHeadID === id)[0];
      //New  Changes
    if (Number(this.activateRouter.snapshot.params.id) == 0){
        this.payCommInfo.partOfGross = payheadData.partOfGross;
        this.payCommInfo.payWithSalary = payheadData.payWithSalary;
        this.payCommInfo.partOfCTC = payheadData.partOfCTC;
        this.payCommInfo.showOnSalaryRegister = payheadData.showOnSalaryRegister;
        this.payCommInfo.showOnSalarySlip = payheadData.showOnSalrySlip;
        this.payCommInfo.variableComponent = payheadData.variablePaycode;
        // this.payCommInfo.rounding = payheadData.rounding;  boolan/number 
        this.payCommInfo.payInJoiningMonth = payheadData.payInJoinningMonth;
        this.payCommInfo.payInLeavingMonth = payheadData.payInLeavingMonth;
        this.payCommInfo.arrearApplicable = payheadData.arrearApplicable;
 
       
    }
    //End
    this.payheadCurrentData = payheadData;
    console.log('payheadCurrentData',this.payheadCurrentData);
  }
  cancelEdit(){
    this.router.navigate(['/payroll/pay']);
  }
  savePayComponent(f){
    console.log(this.payCommInfo);
    if(this.payCommInfo.payCode){
      this.payComponentService.UpdatePayComponents(this.payCommInfo);
    } else{
    this.payComponentService.savePayComponents(this.payCommInfo);
    }

  }
}
