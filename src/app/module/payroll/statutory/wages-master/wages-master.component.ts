import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { CityService } from 'src/app/services/city.service';
import { PayrollStatutoryService } from 'src/app/services/payroll-statutory.service';
import { selectCityState } from 'src/app/store/app.state';
import { MinimumWagesSetting, MinimumWagesSettingMapping } from 'src/app/store/model/payroll-statutory.model';

@Component({
  selector: 'app-wages-master',
  templateUrl: './wages-master.component.html',
  styleUrls: ['./wages-master.component.scss']
})
export class WagesMasterComponent implements OnInit {

  public wagesSettingInfo = {} as MinimumWagesSetting;
  public wagesmapping = {} as MinimumWagesSettingMapping;
  public columnDefs!: any[];
  public rowData: Array<MinimumWagesSetting>= [];
  public displaywagesMaster:boolean;
  public countryList = UI_CONSTANT.COUNTRY;
  public stateList: Array<any>= [];
  stateOptions=UI_CONSTANT.stateOptions;
 public minimumWagesdiv:boolean;
  constructor(private payrollStatutryService : PayrollStatutoryService,
    private authenticationService:AuthService,
    private _store:Store<any>,
    private cityService: CityService) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.columnDefs = this.payrollStatutryService.prepareColumnForMinimumWagesGrid();
    this.payrollStatutryService.fetchminwagesSettingData().subscribe(res=>{
      if(res && res){
        this.rowData=[];
        this.rowData=AppUtil.deepCopy(res);
        //console.log(this.rowData);
      }
    });
    this.payrollStatutryService.getwagesmasterVisiblity().subscribe(res =>{
      this.displaywagesMaster = false;
    });
    this._store.select(selectCityState).subscribe(result => {
      if (result && result.cityList) {
        this.stateList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityService.getCityDropdownOptionList(this.countryList[0].countryID, 'state'));
      }
    });
  }
  addNew(){
    this.wagesSettingInfo={} as MinimumWagesSetting;
    this.minimumWagesdiv=false;
    this.wagesSettingInfo.minimumWagesMapping = [{stateID: this.wagesSettingInfo.stateID,employeeSkillTypeID: 1,employeeSkillTypeName: "Unskilled",minimumWagesAmount: 0},
    {stateID: this.wagesSettingInfo.stateID,employeeSkillTypeID: 2,employeeSkillTypeName: "Skilled",minimumWagesAmount: 0},
    {stateID: this.wagesSettingInfo.stateID,employeeSkillTypeID: 3,employeeSkillTypeName: "Semi-skilled",minimumWagesAmount: 0},
    {stateID: this.wagesSettingInfo.stateID,employeeSkillTypeID: 4,employeeSkillTypeName: "Highly Skilled",minimumWagesAmount: 0}]
    this.displaywagesMaster = true;
    console.log(this.wagesSettingInfo.minimumWagesMapping);
  }
  savewagesSetting(){
   console.log(this.wagesSettingInfo)
    this.payrollStatutryService.saveminwagesSetting(this.wagesSettingInfo);
  }
  keyPressNumbers(event){
    AppUtil.validateDecimalNumbers(event);
  }
  onCellClicked(params){
    
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.displaywagesMaster = true;
        this.wagesSettingInfo=params.data;
        this.getstateID(this.wagesSettingInfo.stateID);
        console.log(this.wagesSettingInfo.minimumWagesMapping)
      }
    }
  }
  CancelwagesSettingData(){
    this.wagesSettingInfo = {} as MinimumWagesSetting;
    this.wagesmapping={} as MinimumWagesSettingMapping;
    this.payrollStatutryService.setwagesmasterVisiblity(false);
  }
  getstateID(event){
    this.minimumWagesdiv=true;
    this.wagesSettingInfo.stateID=event;
  }
}
