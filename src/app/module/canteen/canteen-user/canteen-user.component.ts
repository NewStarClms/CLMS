import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { AuthService } from 'src/app/services/authentication.service';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { currentUserMenuItems } from 'src/app/store/app.state';
import { AttendancesDetail } from 'src/app/store/model/userActionAttendanceDetail.model';
import { Menu, MenuRights } from 'src/app/store/model/usermanage.model';
import { CanteenUserService } from 'src/app/services/canteen-user.service';
import { canteenPunchDetails } from 'src/app/store/model/canteen.model';
import { CanteenPolicyService } from 'src/app/services/canteen-policy.service';
import { CanteenPolicyMappingComponent } from '../canteen-policy-mapping/canteen-policy-mapping.component';

@Component({
  selector: 'app-canteen-user',
  templateUrl: './canteen-user.component.html',
  styleUrls: ['./canteen-user.component.scss']
})
export class CanteenUserComponent implements OnInit {

  public datepickerConfig: Partial<BsDatepickerConfig>;
  public employeeId:number=0;
  public fromDate:string;
  public toDate:string;
  public policyattId:number=0;
  public policyshiftId:number=0;
  public policyholidayId:number=0;
  public policyleaveId:number=0;
  public leavemappingDetaildiv:boolean=false;
  public policyMethod:string="selfServiceTimeOffice";
  public showingSingleEmployeeAction: boolean = false;
  public menuItems: Array<Menu>= [];
  public menuRights: Array<MenuRights>= [];
  public currentMenuRights: Array<MenuRights>= [];
  public backgroundColor: Array<string>=UI_CONSTANT.BackgroundColors;
  public attDate;
  public message:string;
  public attendanceMenu:boolean;
  public singleCanteenProcessdiv:boolean=false;
  public multipleCanteenProcessdiv:boolean=false;
  public manaualpunchsinglediv:boolean;
  public attendanceDetails:Array<canteenPunchDetails>=[];
  public attendanceDetailsListUI : Array<canteenPunchDetails>=[];
  public attendanceDetailListCol: any[] = [];
  public rowData: Array<canteenPunchDetails>=[];
  public attendanceDetaildiv:boolean;
  public columnDefs!: any[];
  public singlemultiDiv:string;
  public menuAction: any ={
    Single: {
      ManualPunch: 433,
      PunchProcess:434
    },
    Multiple: {
      PunchProcess:435
    }
  }
  public policyCanteenId:number=0;

  constructor(
    private userAttendanceDetailService : UserAttendanceDetailService,
    private canteenPolicyService: CanteenPolicyService,
    private canteenUserService:CanteenUserService,
    private notificationService:NotificationService,
    private http:HttpClient,
    private _store: Store<any>,
    private authenticationService:AuthService,
    private coreService:AppCoreCommonService,
    private activatedRoute:ActivatedRoute,
    private router: Router
  ) {
    this.datepickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      rangeInputFormat: 'DD-MMM-YYYY',
      adaptivePosition: true,
      initCurrentTime: false
    });
    
   }

   ngOnInit(): void {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    // var firstDay = new Date(y, m, 1);
    // var lastDay = new Date(y, m - 1, 0);
    var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
    var lastDay = new Date(date.getFullYear(), date.getMonth()-0,0);
    this.attDate = [ firstDay, lastDay];
    this.message='Please Select Employee';
    this.fromDate =this.attDate[0];
    this.toDate =this.attDate[1];
    this.singlemultiDiv='single';
    this.authenticationService.setGlobalFilterVisibility(false);
    this.attendanceDetaildiv=false
    this.attendanceMenu=false;
    this._store.select(currentUserMenuItems).subscribe(response=>{
      this.currentMenuRights=[];
      if (response && response.currentMenuItemsList) {
        this.attendanceMenu=true;
       var attendanceMenuID= Number(this.activatedRoute.snapshot.params.id);
        response.currentMenuItemsList.menuItems?.forEach(root => {
           root.childs.forEach(child => {
              if(child.menuId==attendanceMenuID){
                this.menuItems=child.childs;
                child.childs.forEach(element => {
                  this.menuRights.push(...element.menuRights);
                });
              }
           });
       });
      }
    });
  }

  onChange(menuID) {
    this.currentMenuRights= this.menuRights.filter(m=>m.menuID==menuID && m.menuRightTypeID==3);
    if(this.currentMenuRights){
        this.attendanceMenu=true;
    }
    if(menuID==231){
      this.singlemultiDiv='single';
      this.attendanceMenu=true;
      this.showingSingleEmployeeAction=true;
      this.authenticationService.setGlobalFilterVisibility(false);
    }
    else{
      this.singlemultiDiv='multiple';
      this.showingSingleEmployeeAction=false;
      this.attendanceDetaildiv=false;
      this.authenticationService.setGlobalFilterVisibility(true);
      this.employeeId=0;
    }
 }


 onGetEmployeeDetail(event){
  this.employeeId = event.data;
  if(this.employeeId!=0){
    this.userAttendanceDetailService.fetchEmployeeAllPolicyData(this.employeeId).subscribe(res=>{
      if(res){
        let allpolicys=res;
        console.log(allpolicys)
        allpolicys.forEach(detail=>{
        let policyTypes= detail.key;
        let policyIds=detail.value;
        if(policyTypes=='6'){
          this.policyCanteenId=policyIds;
          console.log('leave',this.policyCanteenId);
        }
        });
      }
    });
  }
  else{
    this.notificationService.showError(this.message,UI_CONSTANT.SEVERITY.ERROR);
  }
}


menuClicked(menuRightID: number){
  if(this.showingSingleEmployeeAction && this.employeeId ==0) {
      this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
      return;
  }
  if(this.showingSingleEmployeeAction && menuRightID ===this.menuAction.Single.ManualPunch ){
    this.manaualpunchsinglediv=true;
    this.showingSingleEmployeeAction=true
    this.getCanteenDetails();
  }
  else if(this.showingSingleEmployeeAction && menuRightID ===this.menuAction.Single.PunchProcess)
  {
    this.singleCanteenProcessdiv=true;
    this.showingSingleEmployeeAction=true
  }
  else if(!this.showingSingleEmployeeAction && menuRightID ===this.menuAction.Multiple.PunchProcess)
  {
    this.multipleCanteenProcessdiv=true;
    this.showingSingleEmployeeAction=false;
  }

}

getLeavePolicyDetailSingle(){
  if(this.employeeId != 0 && this.policyleaveId!=0){
    }
    else if(this.employeeId ==0) {
    this.notificationService.showError('Please select Employee',UI_CONSTANT.SEVERITY.ERROR);
    }
    else if(this.policyleaveId == 0){
    this.notificationService.showError('Policy Not Mapped For this Employee',UI_CONSTANT.SEVERITY.ERROR);
    }
}

getCanteenDetails(){
  if(this.employeeId !=0){
  this.attendanceDetaildiv=true;
  if(this.attDate != null){
  this.fromDate = moment(this.attDate[0], UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+'T00:00';
 this.toDate = moment(this.attDate[1], UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+'T00:00';
 this.canteenUserService.fetchCanteenDetailsData(this.employeeId,this.fromDate,this.toDate).subscribe(res=>{
  if(res){
    console.log(res);
    this.attendanceDetailsListUI=[];
    this.attendanceDetails=[];
    this.attendanceDetails = AppUtil.deepCopy(res);
    this.attendanceDetails.forEach(detail=>{
      this.attendanceDetailsListUI.push(detail);
    });
    console.log(this.attendanceDetailsListUI);
  }
});
this.attendanceDetailcol();
    }
  }
  else if(this.employeeId == 0 && this.showingSingleEmployeeAction){
    this.notificationService.showError(this.message, UI_CONSTANT.SEVERITY.ERROR);
  }
}

recallCanteenManualPunch(){
  console.log('okkk');
  setTimeout( ()=>{
    this.getCanteenDetails();
    }, 1000)
}

onDateChaness(params)
{
  this.fromDate =params[0];
  this.toDate =params[1];
}
attendanceDate

attendanceDetailcol(){
  this.attendanceDetailListCol = [
    { field: 'employeeID', header: 'EmployeeID' },
    { field: 'attendanceDate', header: 'Date',icons:false},
    { field: 'punchTime', header: 'Punch Time' },
    { field: 'punchSource', header: 'Punch Source',},
    { field: 'itemName', header: 'Item Name'},
    { field: 'itemRate', header: 'Item Rate'},
    { field: 'itemQuantity', header: 'Item Quantity'},
    { field: 'employeeAmount', header: 'Employee Amount'},
    { field: 'employerAmount', header: 'Employer Amount' },
];
}

CancelCanteenProcess(event){
  this.singleCanteenProcessdiv=false;
  this.multipleCanteenProcessdiv=false;
  this.manaualpunchsinglediv=false;
}
CancelCanteen(params)
{
  this.canteenUserService.setVisibilityprocess(false);
}
public attendancemappingDetaildiv:boolean=false;
getAttendancePolicyDetail()
{
  if(this.employeeId != 0 && this.policyCanteenId!=0){
    this.attendancemappingDetaildiv=true;
    this.canteenPolicyService.fetchAttendancePolicyMasterDetails(this.policyCanteenId);
  }
  else if(this.employeeId ==0) {
  this.notificationService.showError('Please select Employee',UI_CONSTANT.SEVERITY.ERROR);
  }
  else if(this.policyCanteenId == 0){
  this.notificationService.showError('Policy Not Mapped For this Employee',UI_CONSTANT.SEVERITY.ERROR);
  }
}

downloadAttendancePolicyDetail()
{
  this.userAttendanceDetailService.fnDownloadAttendancePolicy();//.subscribe(res=>{
  //   if(res){
  //     console.log(res);
  //     window.location.href = res;
  //   }
  //  });
}

}
