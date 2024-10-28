import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AuthService } from 'src/app/services/authentication.service';
import { CityService } from 'src/app/services/city.service';
import { PayrollStatutoryService } from 'src/app/services/payroll-statutory.service';
import { selectCityState } from 'src/app/store/app.state';
import { PTSetting, ptSlab } from 'src/app/store/model/payroll-statutory.model';

@Component({
  selector: 'app-pt-setting',
  templateUrl: './pt-setting.component.html',
  styleUrls: ['./pt-setting.component.scss']
})
export class PtSettingComponent implements OnInit {

  public ptSettingInfo = {} as PTSetting;
  public ptmapping = {} as ptSlab;
  public columnDefs!: any[];
  public rowData: Array<ptSlab>= [];
  public displayPT:boolean;
  public countryList = UI_CONSTANT.COUNTRY;
  public stateList: Array<any>= [];
  stateOptions=UI_CONSTANT.stateOptions;
  ptslabList: Array<ptSlab> = [];
  public hdnPTSlabCount:number=0;
  public addbtndisabled:boolean;
  public removebtndisabled:boolean;
  public dialogHeaderName:string;
  public savebuttonHeaderName:string;

  constructor(private payrollStatutryService : PayrollStatutoryService,
    private authenticationService:AuthService,
    private _store:Store<any>,
    private cityService: CityService,
    private notificationService :NotificationService) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.columnDefs = this.payrollStatutryService.prepareColumnForPTSettingGrid();
    this.payrollStatutryService.fetchPTSettingData().subscribe(res=>{
      if(res && res){
        this.rowData=[];
        this.rowData=AppUtil.deepCopy(res);
        //console.log(this.rowData);
      }
    });
    this.payrollStatutryService.getptVisiblity().subscribe(res =>{
      this.displayPT = res;
    });
    this._store.select(selectCityState).subscribe(result => {
      if (result && result.cityList) {
        this.stateList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityService.getCityDropdownOptionList(this.countryList[0].countryID, 'state'));
      }
    });
   
  }
  addNew(){
    this.ptSettingInfo = {} as PTSetting;
    this.addFiledData();
    this.dialogHeaderName="Add PT Setting";
    this.savebuttonHeaderName="Add";
    this.payrollStatutryService.setptVisibility(true);
  }
  savePTSetting(){
    // console.log(this.ptSettingInfo);
    this.ptSettingInfo.ptSlab = this.ptslabList;
    console.log(this.ptSettingInfo)
    
    this.payrollStatutryService.saveptSetting(this.ptSettingInfo);
  }
  CancelPTSettingData(){
    this.ptSettingInfo = {} as PTSetting;
    this.ptmapping={} as ptSlab;
    this.ptslabList=[];
    this.payrollStatutryService.setptVisibility(false);
  }
  
  keyPressNumbers(event){
    AppUtil.validateDecimalNumbers(event);
  }
  onCellClicked(params){
    
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.dialogHeaderName="Update PT Setting";
        this.savebuttonHeaderName="Update";
        this.displayPT = true;
        this.ptSettingInfo=params.data;
        this.ptslabList = this.ptSettingInfo.ptSlab;
        console.log(this.ptSettingInfo.ptSlab)
      }
    }
  }
  addFiledData(){
    if(this.hdnPTSlabCount >= 20){
      this.addbtndisabled=true;
      this.notificationService.showError("You can add maximum 20 PT Slab", UI_CONSTANT.SEVERITY.ERROR);
    }
    else{
      this.addbtndisabled=false;
      this.hdnPTSlabCount= this.hdnPTSlabCount + 1;
      this.ptslabList.push({stateID:this.ptmapping.stateID,minimumLimit: 0,maximumLimit:0,taxAmount:0});
    }
  }
  removeFiledData(){
    if(this.hdnPTSlabCount == 0){
      this.removebtndisabled=true;
      this.notificationService.showError("This is default row it could not be deleted", UI_CONSTANT.SEVERITY.ERROR);
    }else{
      this.removebtndisabled=false;
      this.ptslabList.splice(this.hdnPTSlabCount,1);
      this.hdnPTSlabCount= this.hdnPTSlabCount - 1;
      
    }
   
  }
  getstateID(event){
    console.log(event);
    this.ptmapping.stateID=event;
  }
}
