import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { EmployeeUserGroupService } from '../../../services/employee-usergroup.service';
import { selectEmployeeUserGroupState, selectUserGroupState } from 'src/app/store/app.state';
import { EmployeeUserGroup, UserGroup } from 'src/app/store/model/usermanage.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { PageInfo } from 'src/app/store/model/pageinfo.model';
import { AppUtil } from '../../../common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { employeeGeoLocation, employeeGeoLocationModel, EmployeeGeoLocationModelList } from 'src/app/store/model/employeeGeoLocation.model';
import * as moment from 'moment';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-employee-usergroup',
  templateUrl: './employee-usergroup.component.html',
  styleUrls: ['./employee-usergroup.component.scss']
})
export class EmployeeUserGroupComponent implements OnInit {

  public columnDefs!: any[];
  public rowData: Array<EmployeeUserGroup>= [];
  public userGroupInfo: UserGroup = {} as UserGroup;
  public display= false;
  public employeeUserGroupList: Array<EmployeeUserGroup>=[];
  public selectedEmployees: Array<EmployeeUserGroup>=[];
  public userGroups: Array<UserGroup>= [];
  public selectedUserGroups: Array<UserGroup>= [];
  public dropdownSettings:IDropdownSettings={};
  public userActionType:ActionType;
  public totalRecordCount: number;
  public pager: PageInfo;

  public labelName:string;
  public employeeGeoLocationdiv:boolean=false;
  public employeeUserGroupInfo:EmployeeUserGroup = {} as EmployeeUserGroup;
  public isSubmitBtnDisabled:boolean=false;
  public latituded:number;
  public longituded:number;
  public EmployeeTempId:number;
  public hdnbonusSlabCount:number=0;
  public showHideField:boolean;
  public addbtndisabled:boolean;
  public removebtndisabled:boolean;

  public employeeGeoLocationInfo:employeeGeoLocation= {} as employeeGeoLocation;
  public employeeGeoLocationModelInfo:employeeGeoLocationModel={} as employeeGeoLocationModel;
  public employeeGeoLocationList: Array<employeeGeoLocationModel> = [];
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public employeeGeoLocationModeList:  Array<EmployeeGeoLocationModelList> = [];

constructor(
  private _store: Store<EmployeeUserGroup>,
  private employeeUserGroupService: EmployeeUserGroupService,
  private authenticationService:AuthService,
  private userAttendanceDetailService:UserAttendanceDetailService
) {
  this.datepickerConfig = Object.assign({},{ 
    containerClass:'theme-default',
    dateInputFormat:'DD-MMM-YYYY',
    adaptivePosition:true,
    initCurrentTime: false });
  // this.employeeUserGroupService.fetchEmployeesUserGroupData();
}

 ngOnInit(): void {

  this.isSubmitBtnDisabled=false;
  //this.employeeGeoLocationModeList.push({latitude:0,longitude:0,locationAddress:"",starDate:"",endDate:"",geoRadius:0});
 this.employeeUserGroupInfo.employeeID;
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
  var lastDay = new Date(date.getFullYear(), date.getMonth()-0,0);
  this.employeeGeoLocationModelInfo.starDate=moment(firstDay).format('DD-MMM-YYYY');
  this.employeeGeoLocationModelInfo.endDate=moment(lastDay).format('DD-MMM-YYYY') ;
  this.employeeGeoLocationModelInfo.latitude=this.latituded;
  this.employeeGeoLocationModelInfo.longitude=this.longituded;
  this.labelName="Save";

  this.authenticationService.setGlobalFilterVisibility(true);
  this.columnDefs = this.employeeUserGroupService.prepareColumnForGrid();

  this._store.select(selectEmployeeUserGroupState).subscribe(response=>{
      if (response && response.employeeUserGroupList) {
          this.employeeUserGroupList = AppUtil.deepCopy(response.employeeUserGroupList?.data);
         
          this.rowData = AppUtil.deepCopy(response.employeeUserGroupList?.data);
          this.totalRecordCount=AppUtil.deepCopy(response.employeeUserGroupList?.totalRecords);
        
      }
    });
    this._store.select(selectUserGroupState).subscribe(response=>
      {
        if (response && response.userGroupList) {
            this.userGroups = response.userGroupList.userGroups;
        }
      });
   
    this.employeeUserGroupService.getVisiblity().subscribe(res =>{ this.display = res;});
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'userGroupID',
      textField: 'userGroupName',
     // selectAllText: 'Select All',
      //unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    }
    this.userActionType=new ActionType("0","Filter");
  }

  updateEmployeeGeoLocation()
  {
    this.employeeGeoLocationList=[];

    // this.selectedEmployees.map(emp=>{
   
      this.employeeGeoLocationModeList.map(params=>{
            this.employeeGeoLocationList.push({
              employeeGeoLocationId:0,
              employeeID:this.EmployeeTempId,
              latitude:params.latitude,
              longitude:params.longitude,
              locationAddress:params.locationAddress,
              starDate:moment(params.starDate).format('DD-MMM-YYYY'),
              endDate:moment(params.endDate).format('DD-MMM-YYYY'),
              geoRadius:params.geoRadius,
             })
        })
          this.employeeGeoLocationInfo.locations=this.employeeGeoLocationList;
          const tempemployeeGeoLocation=AppUtil.deepCopy(this.employeeGeoLocationInfo)
          tempemployeeGeoLocation.employeeID= this.EmployeeTempId;
          tempemployeeGeoLocation.locations=this.employeeGeoLocationInfo.locations;
          this.employeeUserGroupService.updateEmployeeGeoLocationss(tempemployeeGeoLocation);
          this.employeeGeoLocationdiv=false;
    //})
  }

  updateTempEmployeeGeoLocations()
  {
    this.employeeGeoLocationModeList=[];
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
      this.latituded = position.coords.latitude;
      this.longituded = position.coords.longitude;
      this.employeeGeoLocationModelInfo.latitude=this.latituded;
      this.employeeGeoLocationModelInfo.longitude=this.longituded;
      this.employeeGeoLocationModeList.push({latitude:this.latituded,longitude:this.longituded,locationAddress:"",starDate:"",endDate:"",geoRadius:0});
      this.showHideField=true;
    });

    
  } 
  }

  CancelmanualPunchMultidiv(){
    this.userAttendanceDetailService.setVisibilityManualMulti(true);
    this.employeeGeoLocationdiv=true;
  }

  addFiledData(){
    if(this.hdnbonusSlabCount >= 5){
      this.addbtndisabled=true;
      //this.notificationService.showError("You Can Add Maximum 5 LeaveEarlyDeductionPolicies", UI_CONSTANT.SEVERITY.ERROR);
    }
    else{
      this.addbtndisabled=false;
      this.hdnbonusSlabCount= this.hdnbonusSlabCount + 1;
      this.employeeGeoLocationModeList.push({latitude:this.latituded,longitude:this.longituded,locationAddress:"",starDate:"",endDate:"",geoRadius:0});
    }
  }
  removeFiledData(){
    if(this.hdnbonusSlabCount == 0){
      this.removebtndisabled=true;
      //this.notificationService.showError("This is default row it could not be deleted", UI_CONSTANT.SEVERITY.ERROR);
    }else{
      this.removebtndisabled=false;
      this.employeeGeoLocationModeList.splice(this.hdnbonusSlabCount,1);
      this.hdnbonusSlabCount= this.hdnbonusSlabCount - 1;
  
    }
  }
  showHide(event)
  {
  
   if(event===true)
   {
    this.showHideField=true;
    if(this.hdnbonusSlabCount == 1){
     this.hdnbonusSlabCount= this.hdnbonusSlabCount + 1;
     this.employeeGeoLocationModeList.push({latitude:0,longitude:0,locationAddress:"",starDate:"",endDate:"",geoRadius:0});
   }
   else{
    
     }
    }
   else{
     this.showHideField=false;
   }
 }

  cancel()
  {
    this.employeeGeoLocationdiv=false;
  }



  checkUnCheckAllClicked(chbSelectAll){
   if(chbSelectAll.checked){
    this.selectedEmployees= this.rowData;
   }
   else{
     this.selectedEmployees=[];
   }
  }

  checkUnCheckRowClicked(params){
    if(params.isSelected){
      this.selectedEmployees.push(params.data);
    }
    else{
      this.selectedEmployees=this.selectedEmployees.filter(e=>e.employeeID!=params.data.employeeID);
    }
    console.log(this.selectedEmployees)
  }
  
 
  loadFilteredEmployeeList(){
    if(this.pager)
     this.pager.pageNumber=1;
    let selectedGroupsList = this.selectedUserGroups.map(u=>u.userGroupID).join('~').toString();
    this.employeeUserGroupService.fetchEmployeesUserGroupData(this.pager,selectedGroupsList!=''?selectedGroupsList: '0')
  }
  submitRequest(){
    let selectedGroupsList = this.selectedUserGroups.map(u=>u.userGroupID).join('~').toString();
    let selectedEmployeeIDs = this.selectedEmployees.map(e=>e.employeeID).join('~').toString();
    this.employeeUserGroupService.upsertEmployeeUserGroup(selectedEmployeeIDs,selectedGroupsList,this.userActionType.actionTypeID,this.pager);
    this.userActionType.actionTypeID="0";
    
  }
   
  reset(){
    this.selectedEmployees = [];
    this.selectedUserGroups=[];
    this.userActionType.actionTypeID="0";
    this.employeeUserGroupService.fetchEmployeesUserGroupData();
  }

  onLazyLoadGridData(params){
    this.pager=params;
    let selectedGroupsList = this.selectedUserGroups.map(u=>u.userGroupID).join('~').toString();
    if(selectedGroupsList=='')
      selectedGroupsList="0";
    if(params.searchKeyword=='' || params.searchKeyword.length>=3){
      this.employeeUserGroupService.fetchEmployeesUserGroupData(params,selectedGroupsList);
    }
  }
  onCellClicked(params){
    let action=params.event.path[1].dataset.action;
    if(action == UI_CONSTANT.ACTIONS.PWDRESET)
     this.employeeUserGroupService.resetEmployeePwd(params.data.employeeCode);
     else if (action == UI_CONSTANT.ACTIONS.TOGGLEESS)
     this.employeeUserGroupService.toggleEssAccess(params.data.employeeID);
     else if(action == UI_CONSTANT.ACTIONS.EMPLOYEEGEOLOCATION){
      this.EmployeeTempId =params.data.employeeID
      this.updateTempEmployeeGeoLocations();
        this.employeeGeoLocationdiv=true;
     }
    return false;
  }
}
export class ActionType{
  constructor(actionTypeID:string, action:string) {
    this.actionTypeID=actionTypeID;
    this.action=action;
}
  actionTypeID: string;
  action: string;
}
