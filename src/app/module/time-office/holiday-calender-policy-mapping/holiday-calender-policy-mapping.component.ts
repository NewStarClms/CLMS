import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { HolidayCalenderPolicyService } from 'src/app/services/holiday-calender-policy.service';
import { selectBranchState, selectEmployeeMasterState } from 'src/app/store/app.state';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { HolidayCalenderPolicy, HolidayCalenderPolicyMapping, holidaysModel } from 'src/app/store/model/holidaycalenderpolicy.model';
import { Branch } from 'src/app/store/model/master-data.model';

@Component({
  selector: 'app-holiday-calender-policy-mapping',
  templateUrl: './holiday-calender-policy-mapping.component.html',
  styleUrls: ['./holiday-calender-policy-mapping.component.scss']
})
export class HolidayCalenderPolicyMappingComponent implements OnInit {
  selectedCities: string[] = [];
  public holidayCalenderPolicyInfo = {} as HolidayCalenderPolicy;
  public holidayCalenderPolicyMappingInfo = {} as HolidayCalenderPolicyMapping;
  public holidays:Array<holidaysModel>=[];
  public holidayListInfo: holidaysModel = {} as holidaysModel;
  public holidaysListUI : Array<holidaysModel>=[];
  stateOptions=UI_CONSTANT.stateOptions;
  public holidayListCol: any[] = [];
  loading: boolean = true;
  @Input() policyholidayID:number;
  public allDisabledField:boolean=false;
  public  policyholidayid:number;
  public LocationDataList:Array<any>=[];

  constructor(private activatedRoute:ActivatedRoute,
              private holidaycalenderpolicyService:HolidayCalenderPolicyService,
              private _store: Store<any>,
    ) { }

  ngOnInit(): void {
      // New Changes

  this.LocationDataList = [];
  this._store.select(selectEmployeeMasterState).subscribe(response=>
    {
      if (response && response.employeeMasterList) {
        const tempempStatusList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeStatus);
        this.LocationDataList=tempempStatusList;
    }
  });
  this._store.select(selectEmployeeMasterState).subscribe(response=>
    { 
      if (response && response.employeeMasterList) {
        const tempempTypeList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeType);
        this.LocationDataList=tempempTypeList;
      }
    });
  
      this._store.select(selectBranchState).subscribe(res => {
        if (res && res.branchList) {
          const tempbranchList:Branch[] = AppUtil.deepCopy(res.branchList);
          tempbranchList.map(x => {
            this.LocationDataList.push({
              value: x.branchID,
              key: x.branchName
            });
           console.log(this.LocationDataList);
          });
         
        }
     
      });
     
 // End

    console.log(this.policyholidayID);
    if(this.policyholidayID==0 || this.policyholidayID==undefined){
      this.policyholidayid= this.activatedRoute.snapshot.params.id;
     this.allDisabledField=false;
    }else{
      this.policyholidayid = this.policyholidayID;
      this.allDisabledField=true;
    }
    this.holidayCalenderPolicyMappingInfo.calendarYear = (new Date()).getFullYear()
    if(this.policyholidayid != 0){
      this.holidaycalenderpolicyService.fetchHolidayCalenderPolicyDetail(this.policyholidayid).subscribe(res =>{
       if(res){
        this.holidayCalenderPolicyInfo=res;
        this.holidayCalenderPolicyMappingInfo.policyID=this.holidayCalenderPolicyInfo.policyID
       }
    });
    }
  
    this.holidayListCol = [
      { field: 'holidayName', header: 'Holiday Name',text:true },
      {field: 'holidayDate', header: 'Date',date:true },
      { field: 'holidayType', header: 'Holiday Type',type:true },
      { field: 'selected', header: 'Selected',checkbox:true },
  ];
  this.getHolidayData();
  }
  keyPressNumeric(event) {
    AppUtil.validateNumbers(event);
  }
  getHolidayData(){
    let policyID = this.policyholidayid;
    let calenderYear = this.holidayCalenderPolicyMappingInfo.calendarYear;
    this.holidaycalenderpolicyService.fetchHolidayCalenderPolicyMapping(policyID,calenderYear).subscribe(res =>{
      if(res && res.holidayCalendarMapping){
        this.holidayCalenderPolicyMappingInfo = res.holidayCalendarMapping
        this.holidays = AppUtil.deepCopy(res.holidayCalendarMapping.holidays);
        
      //  console.log(this.holidays);
      //     this.holidays.forEach(holiday=>{
      //       this.holidaysListUI.push(holiday);
      //     });

          this.holidaysListUI=this.holidays;

          //console.log(this.holidaysListUI);
      }
    });
  }

  saveHolidayCalenderMappingPolicy(){
      this.holidayCalenderPolicyMappingInfo.holidays = this.holidays;
      console.log(this.holidayCalenderPolicyMappingInfo);
      this.holidaycalenderpolicyService.saveHolidayCalenderMappingPolicy(this.holidayCalenderPolicyMappingInfo);
    }
  }
