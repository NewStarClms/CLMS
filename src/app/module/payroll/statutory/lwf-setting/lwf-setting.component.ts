import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { CityService } from 'src/app/services/city.service';
import { PayrollStatutoryService } from 'src/app/services/payroll-statutory.service';
import { selectCityState } from 'src/app/store/app.state';
import { LWFSetting } from 'src/app/store/model/payroll-statutory.model';

@Component({
  selector: 'app-lwf-setting',
  templateUrl: './lwf-setting.component.html',
  styleUrls: ['./lwf-setting.component.scss']
})
export class LwfSettingComponent implements OnInit {
  public lwfSettingInfo = {} as LWFSetting;
  public columnDefs!: any[];
  public rowData: Array<LWFSetting>= [];
  public display:boolean;
  public countryList = UI_CONSTANT.COUNTRY;
  public stateList: Array<any>= [];
  public deductionruleList = UI_CONSTANT.DEDUCTIONRULE;
  stateOptions=UI_CONSTANT.stateOptions;
  public lwfRoundingsList=UI_CONSTANT.PFROUNDING;
  public lwfonarreartypetxt:boolean;
  public lwfOnArrearType:string;
  public lwfOnArrearTypeList = UI_CONSTANT.PFONARREAR;
  public dialogHeaderName:string;
  public savebuttonHeaderName:string;

  constructor(private payrollStatutryService : PayrollStatutoryService,
    private authenticationService:AuthService,
    private _store:Store<any>,
    private cityService: CityService) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.columnDefs = this.payrollStatutryService.prepareColumnForGrid();
    this.payrollStatutryService.fetchLWFSettingData().subscribe(res=>{
      if(res && res.settings){
        this.rowData=[];
        this.rowData=AppUtil.deepCopy(res.settings);
        console.log(this.rowData);
      }
    });
    this.payrollStatutryService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
    this._store.select(selectCityState).subscribe(result => {
      if (result && result.cityList) {
        this.stateList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityService.getCityDropdownOptionList(this.countryList[0].countryID, 'state'));
      }
    });
  }
  addNewlwf(){
    this.dialogHeaderName="Add LWF Setting";
    this.savebuttonHeaderName="Add";
    this.payrollStatutryService.setVisibility(true);
  }
  saveLWFSetting(){
    this.lwfSettingInfo.lwfDeductionRuleName = this.lwfSettingInfo.lwfDeductionRule;
    this.payrollStatutryService.saveLWFSetting(this.lwfSettingInfo);
  }
  keyPressNumbers(event){
    AppUtil.validateDecimalNumbers(event);
  }
  onCellClicked(params){
    console.log(params.data)
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.dialogHeaderName="Update LWF Setting";
    this.savebuttonHeaderName="Update";
        this.display = true;
        this.lwfSettingInfo = params.data;
        this.lwfSettingInfo.lwfDeductionRuleName=this.lwfSettingInfo.lwfDeductionRule
      }
    }
  }
  CancellwfSettingData(){
    this.lwfSettingInfo = {} as LWFSetting;
    this.payrollStatutryService.setVisibility(false);
  }
  // getlwfOnArrear(event){
  //   if(event===true){
  //     this.lwfonarreartypetxt=true;
  //   }
  //   else{
  //       this.lwfonarreartypetxt=false;
  //   }
  // }
}
