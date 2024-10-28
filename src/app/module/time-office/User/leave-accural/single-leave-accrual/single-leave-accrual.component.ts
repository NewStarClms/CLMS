import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { LeaveaccrualServiceService } from 'src/app/services/leaveaccrual-service.service';
import { LeaveAccrual, LeaveAccrualed, LeaveAccrualList } from 'src/app/store/model/laeveAcurral.model';
import * as moment from 'moment';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';

@Component({
  selector: 'app-single-leave-accrual',
  templateUrl: './single-leave-accrual.component.html',
  styleUrls: ['./single-leave-accrual.component.scss']
})
export class SingleLeaveAccrualComponent implements OnInit {
  @Input() employeeID:number;  
  @Output() singleLeaveAccrualdiv = new EventEmitter<boolean>();
  public yearList:Array<any>;
  public leaveaccrualYear:string;
  public monthList:Array<any>;
  public leaveaccrualmonth:string;
  public leaveaccrualInfo: LeaveAccrual = {} as LeaveAccrual;
  public accrualTypeList=UI_CONSTANT.ACCRUAL_TYPE;
  public accuralAutoManual:string;
  public leaveaccrualListcol:any[]=[];
  public leaveaccrualListUI:Array<LeaveAccrualList>=[];
  public accrualType:string;
  public leaveAccrualList:Array<LeaveAccrualed>=[];
  public leaveAccrualListed: Array<LeaveAccrualed>=[];
  public selectedleaveAccrual!: LeaveAccrualList[] | null;
  public isVisible:boolean=false;

  constructor(private leaveAccrualService:LeaveaccrualServiceService,
    private userAttendanceService:UserAttendanceDetailService, 
    private notificationService:NotificationService,) { }

  ngOnInit(): void {
    this.accuralAutoManual='Manual';
    this.isVisible=true;
    this.accrualType='M';

    // New Changes
    setTimeout(() => {
      this.accuralAutoManual='Manual';
      this.getLeaveAccrualList();
    }, 1000);
    //end

    const currentyear = new Date().getFullYear();
    this.leaveaccrualYear=currentyear.toString();
    this.leaveaccrualmonth = (new Date()).toLocaleString('default', { month: 'short' });
    this.monthList=this.userAttendanceService.fetchMonths();
    this.yearList=this.userAttendanceService.fetchYears();
  }
  SaveleaveaacrualPostData(){
  if(this.accuralAutoManual=='Manual')
  {
    if(this.selectedleaveAccrual==undefined)
    {
      this.notificationService.showError('Please Select Atleast One Leave code',UI_CONSTANT.SEVERITY.ERROR);
      return;
    }
  
      this.selectedleaveAccrual.map(item => {
        this.leaveAccrualList.push({leaveCode:item.leaveCode,leaveAccrued:item.accrualValue});
    })
      var accrDate = this.leaveaccrualYear+'-'+((new Date().getMonth())+1)+'-01T00:00:00';
      this.leaveaccrualInfo.employeeID=this.employeeID;
      this.leaveaccrualInfo.accrualDate=accrDate;
      this.leaveaccrualInfo.accrualType=this.accrualType;
      this.leaveaccrualInfo.xmlLeaveAccrual='';
      this.leaveaccrualInfo.openingBalance=0;
      this.leaveaccrualInfo.leaveAccrual=this.leaveAccrualList;
      this.leaveAccrualService.saveLeaveAccrualSingle(this.leaveaccrualInfo);
      this.Cancelleaveaccrual();
   
  }
  else{
  
    var accrDate = this.leaveaccrualYear+'-'+((new Date().getMonth())+1)+'-01T00:00:00';
    this.leaveaccrualInfo.employeeID=this.employeeID;
    this.leaveaccrualInfo.accrualDate=accrDate;
    this.leaveaccrualInfo.accrualType=this.accrualType;
    this.leaveaccrualInfo.xmlLeaveAccrual='';
    this.leaveaccrualInfo.openingBalance=0;
    this.leaveaccrualInfo.leaveAccrual=[];
    this.leaveAccrualService.saveLeaveAccrualSingle(this.leaveaccrualInfo);
    this.Cancelleaveaccrual();
  }
    }
    
  Cancelleaveaccrual(){
  this.leaveaccrualInfo = {} as LeaveAccrual;
  this.singleLeaveAccrualdiv.emit(false);
  }
    
  autoChanges(params)
  {
    this.accuralAutoManual='Auto';
    this.isVisible=false;
  }
   manualChanges(params)
   {
    this.accuralAutoManual='Manual';
      this.isVisible=true;
      this.getLeaveAccrualList();
   }

  // getdata1(){
  //  if(this.accuralAutoManual=='Auto'){
  //   this.isVisible=false;
  //  }
  //  else{
  //   this.isVisible=true;
  //   this.getLeaveAccrualList();
  //  }

  // }


  getLeaveAccrualList(){
    this.leaveaccrualListcol=[
      {field:'leaveCode',header:'LeaveCode'},
      {field:'accrualMonth',header:'AccrualMonth'},
      {field:'accrualYear',header:'AccrualYear'},
      {field:'accrualValue',header:'AccrualValue'},
      {field:'daysOnAccrual',header:'DayOnAccrual'},
      {field:'accrualType',header:'AccrualType'},
      {field:'leaveYear',header:'LeaveYear'},
      {field:'accrualOn',header:'AccrualOn'},
      {field:'actionSource',header:'ActionSource'},
    ]
    if(this.employeeID == 0){
      this.notificationService.showError('Please Select Employee',UI_CONSTANT.SEVERITY.ERROR);
    }else{
      var accrualDate = this.leaveaccrualYear+'-'+((new Date().getMonth())+1)+'-01T00:00:00';
        
      this.leaveAccrualService.fetchLeaveRequestAdminData(this.employeeID,accrualDate,this.accrualType).subscribe(res=>{
        if(res){
          this.leaveaccrualListUI=[];
          res.forEach(detail=>{
            this.leaveaccrualListUI.push(detail);
          })
        }
      })
    }
  }

  accrualTypeListed(params){
    if(params=='M'){
      setTimeout(() => {
        this.accuralAutoManual='Manual';
        this.getLeaveAccrualList();
      }, 1000);
  }
  if(params=='Q'){
    setTimeout(() => {
      this.accuralAutoManual='Manual';
      this.getLeaveAccrualList();
    }, 1000);
   }
   if(params=='Y'){
     setTimeout(() => {
       this.accuralAutoManual='Manual';
       this.getLeaveAccrualList();
     }, 1000);
   }
  }
  
}
