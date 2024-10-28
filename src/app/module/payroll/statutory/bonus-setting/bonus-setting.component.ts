import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AuthService } from 'src/app/services/authentication.service';
import { BonusSettingService } from 'src/app/services/bonus-setting.service';
import { BonusSetting, BonusSlab } from 'src/app/store/model/payroll-statutory.model';

@Component({
  selector: 'app-bonus-setting',
  templateUrl: './bonus-setting.component.html',
  styleUrls: ['./bonus-setting.component.scss']
})
export class BonusSettingComponent implements OnInit {

  public bonusSettingInfo = {} as BonusSetting;
  public bonusSlabInfo = {} as BonusSlab;
  public columnDefs!: any[];
  public bonusOnWhichList=UI_CONSTANT.BONUSONWHICH;
  public rowData: Array<BonusSlab>= [];
  public displayBonus:boolean;
  stateOptions=UI_CONSTANT.stateOptions;
  bonusslabList: Array<BonusSlab> = [];
  public hdnbonusSlabCount:number=0;
  public addbtndisabled:boolean;
  public removebtndisabled:boolean;
  public amountCalculatiOnList=UI_CONSTANT.AMOUNT_CALCULATION_ON
  
  constructor(private bonusSettingService : BonusSettingService,
    private authenticationService:AuthService,
    private _store:Store<any>,
    private confirmationService:ConfirmationService,
    private notificationService :NotificationService) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.columnDefs = this.bonusSettingService.prepareColumnForGrid();
    this.bonusSettingService.fetchBonusSettingData().subscribe(res=>{
      if(res && res){
        this.rowData=[];
        this.rowData=AppUtil.deepCopy(res.settings);
      }
    });
    this.bonusSettingService.getVisiblity().subscribe(res =>{
      this.displayBonus = res;
    });
    
  }
  addNew(){
    this.bonusSettingInfo = {} as BonusSetting;
    this.addFiledData();
    this.bonusSettingService.setVisibility(true);
  }
  saveBonusSetting(){
    this.bonusSettingInfo.bonusSlab = this.bonusslabList;
    console.log(this.bonusSettingInfo)
    if(this.bonusSettingInfo.bonusSettingID > 0){
      this.bonusSettingService.updateStateOfCell(this.bonusSettingInfo);
    }
    else{
      this.bonusSettingService.savebonusSetting(this.bonusSettingInfo);
    }
  }
  CancelBonusSettingData(){
    this.bonusSettingInfo = {} as BonusSetting;
    this.bonusSlabInfo={} as BonusSlab;
    this.bonusslabList=[];
    this.bonusSettingService.setVisibility(false);
  }
  
  keyPressNumbers(event){
    AppUtil.validateDecimalNumbers(event);
  }
  onCellClicked(params){
    
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.displayBonus = true;
        this.bonusSettingInfo=params.data;
        this.bonusslabList = this.bonusSettingInfo.bonusSlab;
        this.bonusslabList.forEach(item=>{
          this.getamountcalculation(item,item.amountCalculatiOn);
        });
      }
      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.bonusSettingID == params.data.bonusSettingID);
            temdata.splice(index,1);
            this.bonusSettingService.deleteCellFromRemote(params);
            this.rowData = temdata;
  
          },
          reject: (type) => {
              switch(type) {
                  case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                      // this.notificationService.showError('Comfirmation Rejected', null);
                  break;
                  case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                    // this.notificationService.showWarning('Comfirmation Canceled');
                  break;
              }
          }
      });
      }
    }
  }
  addFiledData(){
    if(this.hdnbonusSlabCount >= 20){
      this.addbtndisabled=true;
      this.notificationService.showError("You can add maximum 20 PT Slab", UI_CONSTANT.SEVERITY.ERROR);
    }
    else{
      this.addbtndisabled=false;
      this.hdnbonusSlabCount= this.hdnbonusSlabCount + 1;
      this.bonusslabList.push({bonusSettingID:0,ceilingFrom: 0,ceilingTo:0,amountCalculatiOn:"",fixedAmount:0});
    }
  }
  removeFiledData(){
    if(this.hdnbonusSlabCount == 0){
      this.removebtndisabled=true;
      this.notificationService.showError("This is default row it could not be deleted", UI_CONSTANT.SEVERITY.ERROR);
    }else{
      this.removebtndisabled=false;
      this.bonusslabList.splice(this.hdnbonusSlabCount,1);
      this.hdnbonusSlabCount= this.hdnbonusSlabCount - 1;
      
    }
   
  }
  getamountcalculation(i:any,evenet){
   
    if(evenet == 'F'){
      document.getElementById('fixedamountxt'+i).style.display="block";
    }else{
      document.getElementById('fixedamountxt'+i).style.display="none";
    }
  }
}
