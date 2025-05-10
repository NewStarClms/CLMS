import { Component, OnInit, Input } from '@angular/core';
import { PayGroupService } from '../../../../services/pay-group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { IListBoxItem } from 'src/app/module/report/dual-list-box';
import { selectPayComponentState, selectPayHeadsState } from 'src/app/store/payroll.app.state';
import { PayComponentModel, PayGroupModel, PayComponentMapModel, PayHeadsModel } from '../../../../store/model/pay-component.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { selectLeaveMasterState } from 'src/app/store/app.state';
import { LeaveModel } from 'src/app/store/model/master-data.model';



@Component({
  selector: 'app-update-pay-component',
  templateUrl: './update-pay-component.component.html',
  styleUrls: ['./update-pay-component.component.scss']
})
export class UpdatePayComponentComponent implements OnInit {
  headerdialogName: string = 'Add Pay Group';
  labelName: string = 'Add';
  public selectedMenu:number;
  public payheadCurrentData: PayHeadsModel;
  public payComponentMapInfo: Array<PayComponentMapModel>= [];
  public stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public payComponentList: Array<PayComponentModel> = [];
  public availableItems: Array<{ value: string, text: string }> = [];
  public salSlipTemplateList: Array<{ key: string, value: string }> = [];
  public settelSlipTemplateList: Array<{ key: string, value: string }> = [];
  public mappedPayHead:Array<{key:string, value:number}> = [];
  public roundingOption = UI_CONSTANT.ROUNDING_OPTION;
  public interestTypeOption = UI_CONSTANT.INTEREST_TYPE
  public isLoanPayHead = false;
  public display = false;
  public selectPayHeadInfo:PayComponentMapModel = {} as PayComponentMapModel;
  container: CdkDragDrop<IListBoxItem[]> = null;
  public selectedComponent: Array<string> = [];
  public payHeadList:Array<{key:string,value:number}>=[];
  public payHeadListData: Array<PayHeadsModel> = [];
  @Input() policyID:number;
    //New Changes
    public leaveTypeList:Array<any>=[];
    public isLeaveEncash=false;
    //End
  constructor(
    private payGroupService: PayGroupService,
    private activateRouter: ActivatedRoute,
    private _store: Store<any>,
    private router: Router
  ) { }
  ngOnInit(): void {
    const _payHeadSubscribe = this._store.select(selectPayHeadsState)
      _payHeadSubscribe.subscribe(res=>{
        if(res && res.payheadList){
          this.payHeadListData = AppUtil.deepCopy(res.payheadList);
          res.payheadList.map(x=>{
            this.payHeadList.push({key:x.payHeadName, value: x.payHeadID});
          });
        }
      });
    this.payGroupService.getPayComponentMappingInfo(this.policyID).subscribe(res=>{
      if(res && res.components){
        this.payComponentMapInfo = AppUtil.deepCopy(res.components);
        this.payComponentMapInfo.forEach(x=>{
          this.mappedPayHead.push({
            key: x.payComponentName,
            value: x.payComponentID
          });
        });
        this.selectPayHeadInfo = this.payComponentMapInfo[0];
        this.setDefaultPayHeadData(this.selectPayHeadInfo.payHeadID);
      }
    });

      //New Changes
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
      
      //End
  }

  fnupdateOption(e){

  }
  openForm(){
    this.display = true;

  }
  fnupdateModel(e){
    console.log(e,'payhead');
    this.setDefaultPayHeadData(e);
    const tempPayhead = this.payHeadList.filter(x=> x.value === e)[0];
    console.log('tempPayhead',tempPayhead);
    if( this.payheadCurrentData.payHeadID=== 8){
      this.isLoanPayHead = true;
    } else{
    this.isLoanPayHead = false;
    }
     //New Changes
     if( this.payheadCurrentData.payHeadID===12){
      this.isLeaveEncash = true;
    }
   else{
    this.isLeaveEncash=false;
   }
//End
  }
  setDefaultPayHeadData(id){
    const payheadData: PayHeadsModel = this.payHeadListData.filter(y=> y.payHeadID === id)[0];
    this.selectPayHeadInfo.arrearAplicable = payheadData.partOfGross;
    this.selectPayHeadInfo.payWithSalary = payheadData.payWithSalary;
    this.selectPayHeadInfo.partOfCTC = payheadData.partOfCTC;
    this.selectPayHeadInfo.showOnSalaryRegister = payheadData.showOnSalaryRegister;
    this.selectPayHeadInfo.showOnSalarySlip = payheadData.showOnSalrySlip;
    this.selectPayHeadInfo.variableComponent = payheadData.variablePaycode;
    // this.selectPayHeadInfo.rounding = payheadData.rounding;  boolan/number 
    this.selectPayHeadInfo.payInJoiningMonth = payheadData.payInJoinningMonth;
    this.selectPayHeadInfo.payInLeavingMonth = payheadData.payInLeavingMonth;
    this.selectPayHeadInfo.arrearAplicable = payheadData.arrearApplicable;
    this.payheadCurrentData = payheadData;
    console.log('payheadCurrentData',this.payheadCurrentData);
  }
  getPayComponentDetail(id){
    this.selectPayHeadInfo = this.payComponentMapInfo.filter(x=> x.payComponentID === id)[0];
    console.log('this.selectPayHeadInfo',this.selectPayHeadInfo);
    if(id===6){
      this.isLoanPayHead = true;
   } else{
     this.isLoanPayHead = false;
   }
  }
  savePayComponent(f){
    console.log(this.selectPayHeadInfo);
      this.payGroupService.updatePayComponentMappingInfo(this.selectPayHeadInfo);
  }
  updateFormulaCode(e){
    this.selectPayHeadInfo.formula = e;
    this.display = false;
    console.log('code',e);
  }
}
