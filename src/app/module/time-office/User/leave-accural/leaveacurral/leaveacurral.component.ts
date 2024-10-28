import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AuthService } from 'src/app/services/authentication.service';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { LeaveAccrualList } from 'src/app/store/model/laeveAcurral.model';
import { LeaveBalance } from 'src/app/store/model/LeaveRequest.model';
import * as moment from 'moment';
import { LeaveaccrualServiceService } from 'src/app/services/leaveaccrual-service.service';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { Store } from '@ngrx/store';
import { currentUserMenuItems } from 'src/app/store/app.state';
import { ActivatedRoute } from '@angular/router';
import { Menu, MenuRights } from 'src/app/store/model/usermanage.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-leaveacurral',
  templateUrl: './leaveacurral.component.html',
  styleUrls: ['./leaveacurral.component.scss']
})
export class LeaveacurralComponent implements OnInit {
 // single:boolean=true;
  //multiple:boolean;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public employeeId:number=0;
  public fromDate:string;
  public toDate:string;
  public laeveaccrualListCol: any[] = [];
  public laeveaccrualListUI : Array<LeaveAccrualList>=[];
  public laevebalanceListCol: any[] = [];
  public laevebalanceListUI : Array<LeaveBalance>=[];
 // public actiontype:string;
  public leavebalancediv:boolean;
  public manaualpunchsinglediv:boolean=false;
  public attendanceMenu:boolean;
  //public singlemultiDiv:string;
  public message:string;
  public leaveaccrualType:string;
  public leaveaccrualsinglediv:boolean;
  public laeveaccrualmultidiv:boolean;
  public leaveaccrualYear:string;
  public yearList:Array<any>;
  public laevecarryforwordmultidiv: any;
  public laeveEncashmultidiv: any;
  //New Changes
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
  public showEmployeeDepDesiName:string;
  public menuAction: any ={
    Single: {
      Accural: 205,
      CarryForward: 206,
      COFProcess: 207,
      Encashment: 208,
      OpaningBalance: 209
    },
    Multiple: {
      Accural: 401,
      CarryForward: 402,
      COFProcess: 403,
      Encashment: 404,
      OpaningBalance: 405
    }
  }
  public coffProcessDiv:boolean=false;
  public coffProcessMultiDiv:boolean;
  //  End
  

  constructor(
   private notificationService:NotificationService,
   private leaveRequestService:LeaveRequestService,
   private authenticationService:AuthService,
   private userAttendanceService:UserAttendanceDetailService,
   private activatedRoute:ActivatedRoute,
   private _store: Store<any>,
   ) {
    this.datepickerConfig = Object.assign({},{containerClass:'theme-default', 
    adaptivePosition:true,
    dateInputFormat:'DD-MMM-YYYY'});
   }

  ngOnInit(): void {
    var year = new Date().getFullYear();
    this.leaveaccrualYear=year.toString();
    this.authenticationService.setGlobalFilterVisibility(false);
    this.message='Please Select Employee';
    //this.singlemultiDiv='single';
    this.leavebalancediv=false;
    this.attendanceMenu=false;
    this.yearList= this.userAttendanceService.fetchYears();
    this._store.select(currentUserMenuItems).subscribe(response=>{
      this.menuRights=[];
      if (response && response.currentMenuItemsList) {
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
   // this.actiontype = e.target.value;
   //this.actiontype= menuID==221? "Single": "Multiple";
    // console.log(this.actiontype)
    this.laeveEncashmultidiv=false;
    this.laevecarryforwordmultidiv=false;
    this.coffProcessDiv=false;
    this.coffProcessMultiDiv=false;

    this.currentMenuRights= this.menuRights.filter(m=>m.menuID==menuID && m.menuRightTypeID==3);
    if(this.currentMenuRights){
      this.attendanceMenu=true;
    }
    if(menuID==221){
      // this.single=true;
      // this.multiple=false;
      //this.singlemultiDiv=e.target.value;
      this.showingSingleEmployeeAction=true;
      this.authenticationService.setGlobalFilterVisibility(false);
      
    }
    else{
      // this.single=false;
      // this.multiple=true;
      //this.attendanceMenu=true;
      this.showingSingleEmployeeAction=false;
      //this.singlemultiDiv=e.target.value;
      this.leavebalancediv=false;
      this.authenticationService.setGlobalFilterVisibility(true);
      this.employeeId=0;
    }
   
 }
 onGetEmployeeDetail(event){
  this.employeeId = event.data;
  this.showEmployeeDepDesiName=event.column;
  if(this.employeeId!=0){
    this.userAttendanceService.fetchEmployeeAllPolicyData(this.employeeId).subscribe(res=>{
      if(res){
        let allpolicys=res;
        console.log(allpolicys)
        allpolicys.forEach(detail=>{
        let policyTypes= detail.key;
        let policyIds=detail.value;
        if(policyTypes=='2'){
          this.policyleaveId=policyIds;
          console.log('leave',this.policyleaveId);
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
  if(this.showingSingleEmployeeAction && menuRightID ===this.menuAction.Single.Accural ){
    this.leaveaccrualsinglediv=true;
  }
  else if(!this.showingSingleEmployeeAction && menuRightID ===this.menuAction.Multiple.Accural ){
    this.laeveaccrualmultidiv=true;
  }
  else if(!this.showingSingleEmployeeAction && menuRightID ===this.menuAction.Multiple.CarryForward ){
    this.laevecarryforwordmultidiv=true;
    this.laeveEncashmultidiv=false;
    this.coffProcessMultiDiv=false;
  }
  else if(!this.showingSingleEmployeeAction && menuRightID ===this.menuAction.Multiple.Encashment ){
    this.laeveEncashmultidiv=true;
    this.laevecarryforwordmultidiv=false;
    this.coffProcessMultiDiv=false;
    
  }
  else if(this.showingSingleEmployeeAction && menuRightID ===this.menuAction.Single.COFProcess){
    this.coffProcessDiv=true;
    this.coffProcessMultiDiv=false;
    this.showingSingleEmployeeAction=false;
    this.leavebalancediv=false;
  }
  else if(!this.showingSingleEmployeeAction && menuRightID ===this.menuAction.Multiple.COFProcess){
    this.coffProcessDiv=false;
    this.coffProcessMultiDiv=true;
    this.showingSingleEmployeeAction=false;
    this.laevecarryforwordmultidiv=false;
    this.laeveEncashmultidiv=false;
  }

}
getLeaveCurrentBalance(){
  if(this.employeeId == 0){
    this.notificationService.showError('Please Select Employee',UI_CONSTANT.SEVERITY.ERROR);
  }
  else{
    this.leavebalancediv=true;
    console.log(this.employeeId,this.leaveaccrualYear);
    this.laevebalanceListCol = [
      // { field: 'leaveID', header: 'LaeveID'},
      { field: 'leaveCode', header: 'LeaveCode'},
      { field: 'leaveName', header: 'LeaveName' },
      { field: 'accrualLeave', header: 'AccrualLeave',},
      { field: 'consumeLeave', header: 'ConsumeLeave'},
       { field: 'deductLeave', header: 'DeductLeave'},
       { field: 'balanceLeave', header: 'BalanceLeave'},
  ];
  this.leaveRequestService.fetchLeaveBalanceData(this.employeeId,this.leaveaccrualYear).subscribe(res=>{
    if(res){
      console.log('leave',res)
      this.laevebalanceListUI=[];
      res.forEach(detail=>{
        this.laevebalanceListUI.push(detail);
      })
    }
  });
  }
 
}
// showleaveAccrualsingle(){
//   if(this.employeeId == 0){
//     this.notificationService.showError('Please Select Employee',UI_CONSTANT.SEVERITY.ERROR);
//   }else{
//     this.leaveaccrualsinglediv=true;

//   }
// }
// showleaveAccrualmultiple(){
//   this.laeveaccrualmultidiv=true;
// }

CancelsingleLeaveAccrual(event){
  this.leaveaccrualsinglediv=event;
}
CancelmultipleLeaveAccrualdiv(event){
  this.laeveaccrualmultidiv=event;
}
// showCarryForwordsingle(){

// }
// showCOFProcesssingle(){

// }
// showEncashmentsignle(){

// }
// showCarryForwordmultiple(){
//   this.laevecarryforwordmultidiv=true;
// }
// showCOFProcessmultiple(){

// }
// showEncashmentmultiple(){
  
//   this.laeveEncashmultidiv=true;
// }

getLeavePolicyDetailSingle(){
  if(this.employeeId != 0 && this.policyleaveId!=0){
    this.leavemappingDetaildiv=true;
    }
    else if(this.employeeId ==0) {
    this.notificationService.showError('Please select Employee',UI_CONSTANT.SEVERITY.ERROR);
    }
    else if(this.policyleaveId == 0){
    this.notificationService.showError('Policy Not Mapped For this Employee',UI_CONSTANT.SEVERITY.ERROR);
    }
}
downloadLeavePolicyDetailMultiple(){
    this.userAttendanceService.fnDownloadLeavePolicy();//.subscribe(res=>{
    //   if(res){
    //     console.log(res);
    //     window.location.href = res;
    //   }
    //  });
}

CancelCoffProcess(event)
{
  this.coffProcessMultiDiv=event;
  this.coffProcessDiv=event;
  this.showingSingleEmployeeAction=true;
  if(this.employeeId ==0)
  {
    this.showingSingleEmployeeAction=false;
  }

}

CancelmultipleLeavediv(event)
{
 this.laeveEncashmultidiv=false;
}
CancelmultipleLeaveCarrydiv(event)
{
  this.laevecarryforwordmultidiv=false;
}

}
