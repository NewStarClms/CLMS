import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { UserGroupService } from 'src/app/services/user-group.service';
import { selectAppDataState, selectUserGroupState, selectUserGroupTypeState } from 'src/app/store/app.state';
import { DashboardSetting, UserDashboardSetting, UserGroup, UserGroupType } from 'src/app/store/model/usermanage.model';

@Component({
  selector: 'app-usergroup',
  templateUrl: './usergroup.component.html',
  styleUrls: ['./usergroup.component.scss']
})
export class UsergroupComponent implements OnInit {
  public columnDefs!: any[];
  // gridApi and columnApi
  private api!: GridApi;
  private columnApi!: ColumnApi;
  public rowData: Array<UserGroup>= [];
  public userGroupInfo: UserGroup = {} as UserGroup;
  public userdashboardSettingInfo:UserDashboardSetting = {} as UserDashboardSetting;
  public dashboardSettingInfo:Array<DashboardSetting> =[];
  public isCityActive = true;
  public isEditable = false;
  public display = false;
  public dashboardSettingDisplay=false;
  public userGroupTypeList:Array<any>=[];
  public labelName:string="";
  public active:boolean=true;
public headerdialogName:string="";
public dashboardSettingListCol:any[]=[];
  public dasboardSettingList : Array<DashboardSetting>=[];
public masterSelected:boolean;
constructor(
  private _store: Store<any>,
  private userGroupService: UserGroupService,
  private confirmationService:ConfirmationService,
  private router: Router,
  private authenticationService:AuthService
) {
  this.masterSelected = false;
  // this.userGroupService.fetchUserGroupData();
}
 ngOnInit(): void {
 
  this.authenticationService.setGlobalFilterVisibility(true);
  this._store.select(selectUserGroupState).subscribe(response=>
    {
      if (response && response.userGroupList) {
          this.rowData = response.userGroupList.userGroups;
          // console.log('userGroup',response.userGroupList.userGroups);
      } else{
      this.userGroupService.fetchUserGroupData();

      }
    });
  this.columnDefs = this.userGroupService.prepareColumnForGrid();
  this.userGroupService.getVisiblity().subscribe(res =>{
    this.display = res;
  });
  this.userGroupService.getDashboardSettingVisiblity().subscribe(res =>{
    this.dashboardSettingDisplay = res;
  });
    this._store.select(selectUserGroupTypeState).subscribe(res => {
      if (res && res.userGroupTypeList) {
        const tempuserGroupTypeList: UserGroupType[] = AppUtil.deepCopy(res.userGroupTypeList);
        this.userGroupTypeList = tempuserGroupTypeList
      } else{
        this.userGroupService.fetchUserGroupTypeData();
      }
    });
    // console.log('userGroupType',this.userGroupTypeList);
   
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add User Group";
  this.userGroupInfo = {} as UserGroup;
  this.userGroupService.setVisibility(true);
}
SaveUserGroupData(){
  if(this.userGroupInfo.userGroupID > 0){
    this.userGroupService.updateStateOfCell(this.userGroupInfo);
  } else{
    console.log(this.userGroupInfo);
    this.userGroupService.saveUserGroup(this.userGroupInfo);
  }
  this.CancelUserGroupData();
}
CancelUserGroupData(){
  this.userGroupInfo = {} as UserGroup;
this.userGroupService.setVisibility(false);
}
onCellClicked(params) {
// Handle click event for action cells
if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
  let action = params.event.path[1].dataset.action;

  if (action === UI_CONSTANT.ACTIONS.EDIT) {
    this.userGroupService.setVisibility(true);
    this.userGroupInfo = params.data;
    if(this.userGroupInfo.userGroupID !== 0 ){
      this.labelName="Update";
     this.headerdialogName="Update User Group";
    }
  }

  if (action === UI_CONSTANT.ACTIONS.DELETE) {
    this.confirmationService.confirm({
      message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
      header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
      icon: 'pi pi-info-circle',
      accept: () => {
        const temdata = AppUtil.deepCopy(this.rowData);
        let index = this.rowData.findIndex((item)=>item.userGroupID == params.userGroupID);
        temdata.splice(index,1);
        this.userGroupService.deleteCellFromRemote(params);
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

  if (action === UI_CONSTANT.ACTIONS.MAPACCESSRIGHT) {
    this.router.navigate(['/usermanage/mapaccessright/' + params.data.userGroupID]);
  }
  if (action === UI_CONSTANT.ACTIONS.DASBOARDSETTING) {
    this.bindDatainTable(params.data.userGroupID);
    
    this.userdashboardSettingInfo.userGroupID=params.data.userGroupID
    this.userGroupService.setDashboardSettingVisibility(true);
  }
}
}
keyPressNumbers(event){
  AppUtil.validateNumbers(event);
}
keyPressAlphanumeric(event) {
AppUtil.validateAlphanumeric(event);
}
exportGridData(){
this.userGroupService.getCSVReport(this.rowData , 'AutoCode');
}
SaveDashboardSettingData(){
  console.log('final',this.userdashboardSettingInfo);
  this.userGroupService.saveUserDashboardSetting(this.userdashboardSettingInfo);
}
CancelDashboardSettingData(){
  this.userGroupService.setDashboardSettingVisibility(false);
}
bindDatainTable(groupId){
  
  this.userdashboardSettingInfo.userGroupID=groupId;
  this.dashboardSettingListCol = [
    { field: 'settingName', header: 'Setting Name'},
    { field: 'active', header: 'Visible',icon:true}
];
this.userGroupService.fetchuserDashboardSetting(groupId).subscribe(res=>{
  if(res && res){
    this.dashboardSettingInfo = AppUtil.deepCopy(res);
    this.dasboardSettingList=this.dashboardSettingInfo;
    this.masterSelected = false;
this.getCheckedItemList();
  }
});
}
isAllSelected() {
  this.masterSelected = this.dasboardSettingList.every(function(rowData:any) {
      return rowData.active == true;
    })
  this.getCheckedItemList();
}

// Get List of Checked Items
getCheckedItemList(){
  
  this.dashboardSettingInfo = [];
  for (var i = 0; i < this.dasboardSettingList.length; i++) {
    if(this.dasboardSettingList[i].active)
    this.dashboardSettingInfo.push(this.dasboardSettingList[i]);
  }
  this.userdashboardSettingInfo.dashBoardSettings = this.dashboardSettingInfo;
  // console.log(this.userdashboardSettingInfo.dashBoardSettings)
}
}
