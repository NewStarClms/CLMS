import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ConfirmationService } from 'primeng/api';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { CanteenPolicyService } from 'src/app/services/canteen-policy.service';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { CanteenManualPunchSingle, CanteenPolicyModel, mapping } from 'src/app/store/model/canteen.model';
import { CanteenUserService } from 'src/app/services/canteen-user.service';
import { AppUtil } from 'src/app/common/app-util';
import * as moment from 'moment';

@Component({
  selector: 'app-canteen-manual-punch',
  templateUrl: './canteen-manual-punch.component.html',
  styleUrls: ['./canteen-manual-punch.component.scss']
})
export class CanteenManualPunchComponent implements OnInit {
  public canteenManualPunchInfo:CanteenManualPunchSingle = {} as CanteenManualPunchSingle;
  public punchdate:string;
  public punchtime:string;
  public inOutList=UI_CONSTANT.INOUTLIST;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  @Input() employeeID:number;  
  @Output() canteenManualPunchdiv = new EventEmitter<boolean>();
  public itemMasterList:Array<any>=[];
  @Input() policyCanteenID:number;
  @Input() policyCanteenid:number;
  @Input() FromDate:string;
  @Input() ToDate:string;
  public attDate;
  public canteenPolicyModelInfo:CanteenPolicyModel= {} as CanteenPolicyModel;
  public selectedItemMaster: Array<mapping>=[];
  public canteenrowData: Array<mapping>= [];
  public QuaDisable:boolean=false;
  @Output() recallCanteenManualPunchDetail = new EventEmitter<any>();

  constructor(
    private attendanceDetailService:UserAttendanceDetailService,
    private confirmationService:ConfirmationService,
    private canteenUserService:CanteenUserService,
    private canteenPolicyService: CanteenPolicyService,
    private activatedRoute:ActivatedRoute,
    private _store:Store<any>
  ) { 
      this.datepickerConfig = Object.assign({},{ 
      containerClass:'theme-default',
      dateInputFormat:'DD-MMM-YYYY',
      adaptivePosition:true,
      initCurrentTime: false });
  }

  ngOnInit(): void {


    var date = new Date(), 
    y = date.getFullYear(), 
    m = date.getMonth();
    var firstDay = new Date(date.getFullYear(), date.getMonth(),1);
    var lastDay = new Date(date.getFullYear(), date.getMonth()+1,0);
    this.attDate = [ firstDay, lastDay];
    

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
  this.punchdate=moment(this.FromDate).format('DD-MMM-YYYY');



    console.log(this.policyCanteenID);
    if(this.policyCanteenID==0 || this.policyCanteenID==undefined){
      this.policyCanteenid= this.activatedRoute.snapshot.params.id;
    }else{
      this.policyCanteenid = this.policyCanteenID;
    }
    this.canteenManualPunchInfo.employeeID =0;
    this.canteenPolicyService.fetchAttendancePolicyMasterDetails(this.policyCanteenid).subscribe(res=>{
      if(res && res.mappings){
        this.canteenPolicyModelInfo= AppUtil.deepCopy(res);
        this.canteenrowData= AppUtil.deepCopy(res.mappings);
        this.itemMasterList =this.canteenrowData.filter((val) =>val.selected==true);
      }
    });
    this.itemMasterList.map(x=>{
      this.itemMasterList.push({
        itemID:x.itemID,
        itemName:x.itemName
      })
    })

  let PolicyBasedOn=this.canteenPolicyModelInfo.policyBasedOn;
  let tempPolicyBasedOn=PolicyBasedOn.trim().toString();
   if(tempPolicyBasedOn=='I'){
    this.QuaDisable =true;
    }else{
    this.QuaDisable=false;
    }
  //  this._store.select(selectItemMasterState).subscribe(res=>{
  //   if(res && res.ItemMasterList)
  //   {
  //     const tempItemMasterList:ItemMaster[]=AppUtil.deepCopy(res.ItemMasterList);
  //     tempItemMasterList.map(x=>{
  //       this.itemMasterList.push({
  //         itemID:x.itemID,
  //         itemName:x.itemName
  //       })
  //     })
  //   }
  //  })

  //  this.canteenPolicyService.fetchAttendancePolicyMasterDetail(params).subscribe(res=>{
  //   if(res)
  //   {
  //     const tempItemMasterList:ItemMaster[]=AppUtil.deepCopy(res);
  //     tempItemMasterList.map(x=>{
  //       this.itemMasterList.push({
  //         itemID:x.itemID,
  //         itemName:x.itemName
  //       })
  //     })
  //   }
  //  })

   

  }

public cancelManualPunch:boolean;


  SaveManualPunchSingleData()
  {

    const tempmanualPunchInfo = AppUtil.deepCopy(this.canteenManualPunchInfo);
        tempmanualPunchInfo.employeeID = this.employeeID;
        tempmanualPunchInfo.punchTime= moment(this.punchdate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+' '+moment(this.punchtime).format('HH:mm');
   //   tempmanualPunchInfo.employeeID =  tempmanualPunchInfo.employeeID;
        tempmanualPunchInfo.punchTime= tempmanualPunchInfo.punchTime;
        tempmanualPunchInfo.inOut="I"
        tempmanualPunchInfo.reason= tempmanualPunchInfo.reason;
        tempmanualPunchInfo.systemIP='00.00.00.00';
        tempmanualPunchInfo.itemQuantity= tempmanualPunchInfo.itemQuantity;
        tempmanualPunchInfo.itemID=tempmanualPunchInfo.itemID;
     this.canteenUserService.saveCanteenManualPunchSingle(tempmanualPunchInfo);
     this.recallCanteenManualPunchDetail.emit();
     this.cancel();
  }
  cancel()
  {
    this.canteenManualPunchInfo = {} as CanteenManualPunchSingle;
    this.canteenManualPunchdiv.emit(false);
  }
}
