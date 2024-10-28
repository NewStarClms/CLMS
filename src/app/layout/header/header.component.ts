import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { UserGroupService } from 'src/app/services/user-group.service';
import { currentUserMenuItems, selectUserMenuItems } from 'src/app/store/app.state';
import { GlobalEmployeeFilter } from 'src/app/store/model/globalemployeefilter.model';
import { ChangePassword, User } from 'src/app/store/model/login.model';
import { Menu, UserGroup, UserGroupMenuType } from 'src/app/store/model/usermanage.model';
import { AuthService } from '../../services/authentication.service';
import { ChangePasswordServiceService } from '../../services/change-password-service.service';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import {MenuItem, PrimeIcons} from 'primeng/api';
import { EmployeeDashboardSetting, MachineJobProgress } from 'src/app/store/model/employee-dashboard-setting.model';
import { EmployeeDashboardSettingService } from 'src/app/services/employee-dashboard-setting.service';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public display:boolean=false;
  public appliedfilter:boolean=false;
  filtertypevale:string='';
  private _currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public userInfo: User = {} as User;
  public changePasswordInfo: ChangePassword = {} as ChangePassword;
  public loginUrserName:string;
  public changePassword:Boolean=false;
  public usergroupMenu: Array<UserGroupMenuType> =[];
  public isSetupAllowed = false;
  public isReportAllowed = false;
  public displayGlobalFltr: boolean = false;
  public isUploadAllowed: boolean;
  public showEmployeeDashboardSetting = false;
  public showMachineJobsStatus=false;
  public hideMachineStatus=false;
  raiseEventToLoadJobData: Subject<void> = new Subject<void>();
  public IsAccessRight:boolean;


  public requestbyessdiv:boolean=false;
  public menuItems:Menu[]=[];
  public reqMenuList:any[] = [];
  public Latitude:number;
  public Longitude:number;
  public visible:boolean=false;
  public latitude:number;
  public longitude :number;
  public address :string;
  public currentAddress :string;
  private geoCoder;
  
  constructor(
    private authenticationService: AuthService,
    private router: Router,
    private usergroupService: UserGroupService,
    private _store: Store<UserGroup>,
    private employeeService: EmployeeService,
    private changePasswordService: ChangePasswordServiceService,
    private employeeDashboardSettingService: EmployeeDashboardSettingService,
    private attendanceDetailService:UserAttendanceDetailService,
  ) { 
    this.filtertypevale=localStorage.getItem('lStorageData');
    this._currentUserSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
        this.currentUser = this._currentUserSubject.asObservable();
    this.usergroupService.fetchMenuItems();

  }

  ngOnInit(): void {

    this.authenticationService.getGlobalFilterVisibility().subscribe(res=>{
      console.log('headermenu',res)
      this.displayGlobalFltr = res;
    });

    this.currentUser.subscribe(res=>{
      if(res){
        this.userInfo = res;
        this.loginUrserName = this.userInfo.logOnUserDetail.employeeName;
      }
    });
    if(this.filtertypevale == '1'){
      this.appliedfilter=true;
    }else{
      this.appliedfilter=false;
    }
    this._store.select(selectUserMenuItems).subscribe(response=>{
      if (response && response.menuItemsList) {
          this.usergroupMenu=response.menuItemsList;
          //console.log('menuItemsList===',this.usergroupMenu)
          this.isSetupAllowed = (this.usergroupMenu.filter(c=> c.menuTypeID === 1)[0].menuItems.length>0)?true:false;
          this.isReportAllowed = (this.usergroupMenu.filter(c=> c.menuTypeID === 4)[0].menuItems.length>0)?true:false;
          this.isUploadAllowed = (this.usergroupMenu.filter(c=> c.menuTypeID === 3)[0].menuItems.length>0)?true:false;
          this.IsAccessRight = (((this.usergroupMenu.filter(c=> c.menuTypeID === 2)[0])).menuItems.find(c=> c.menuId === 111))?true:false;
      }
    });
     // New  Changes
    this._store.select(currentUserMenuItems).subscribe(response=>{
      if(response){
        // console.log(response)
        this.menuItems =response?.currentMenuItemsList.menuItems;
        const requestMenu:Menu = this.menuItems.find(x=> x.childs.find(y=>y.menuId === Number(47)));
        this.reqMenuList = requestMenu.childs.filter(z=> z.menuId === Number(47))[0].childs;
        if(this.reqMenuList.filter(x=>x.menuId==237).length>0 || this.reqMenuList.filter(x=>x.menuId==238).length>0 )
        {
          this.visible=true;
        }
        else{
          this.visible=false;
        }
    }
  });
// End    

    this.employeeService.fetchEmployeeUserDetail().subscribe(res=>{
      if(res){
        this.changePasswordService.setVisibility(res.passwordChangeRequired);
      }
    });
    
    this.changePasswordService.getVisiblity().subscribe(res =>{
      this.changePassword = res;
    });
    this.employeeDashboardSettingService.getVisiblity().subscribe(res =>{
      this.showEmployeeDashboardSetting = res;
    });
    this.employeeDashboardSettingService.getMachineJobPopupVisiblity().subscribe(res =>{
      this.showMachineJobsStatus = res;
    });
  }
  logout(){
    localStorage.clear();
    this.authenticationService.logout();
  }
  displayGlobalFilter(){
    this.display=true;
  }
  onGetFilterDetail(){
    this.filtertypevale=localStorage.getItem('lStorageData');
    console.log(this.filtertypevale)
    this.display=false;
    if(this.filtertypevale == '1'){
      this.appliedfilter=true;
    }else{
      
      this.appliedfilter=false;
    }
  }

  loadSettingsMenu(){
    this.usergroupService.updateCurrentMenu(this.usergroupMenu[0]);
  }
  private getUserFromLocalStorage(): User {
    try {
      return JSON.parse(localStorage.getItem(UI_CONSTANT.ConstValue.CurrentUser)!);
    } catch (error) {
      return null!;
    }
  }

  loadReportDashboard(){
    this.router.navigate(['/reports/report-setup']);
  }
  loadImportDashboard(){
    this.router.navigate(['/imports/import-file']);
  }
  fnChangePassword(){
    this.changePasswordService.setVisibility(true);
  }
  hidePopUp(){
    this.changePasswordInfo = {} as ChangePassword;
    this.changePasswordService.setVisibility(false);
  
  }

  fnEmployeeDashboardSetting(){
     this.employeeDashboardSettingService.setVisibility(true);
  }
  hideEmployeeDashboardSettingPopUp(){
    this.showEmployeeDashboardSetting=false;
    this.employeeDashboardSettingService.setVisibility(false);
  }

  openJobProgressDialog(){
    this.hideMachineStatus=false;
    this.raiseEventToLoadJobData.next();
  }
  closeMachineJobsStatusDialog(){
    this.hideMachineStatus=true;
  }
  PostPunch(){
    // this.employeeService.currentAddress().subscribe((res)=>{
    //   console.log('currentAddress',res);
    
    // })
    this.requestbyessdiv=true;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.Latitude=this.latitude;
        this.Longitude=this.longitude;
        this.currentAddress ="No Record Found";
    //    this.getAddress(this.latitude, this.longitude);
        this.requestbyessdiv=true;
      });
    } 
  }

  // getAddress(latitude, longitude) {
  //   this.geoCoder = new google.maps.Geocoder;
  //   this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
  //     if (status === 'OK') {
  //       if (results[0]) {
  //           this.currentAddress ="No Record Found";
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }
  //    });
  // }


  cancelRequestedByEss()
  {
    this.attendanceDetailService.setRequestByEssPopupVisibility(false);
    this.requestbyessdiv=false;
  }
}
