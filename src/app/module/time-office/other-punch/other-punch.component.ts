
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { OtherPunch } from 'src/app/store/model/other-punch.model';
import { OtherPunchService } from 'src/app/services/other-punch.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-other-punch',
  templateUrl: './other-punch.component.html',
  styleUrls: ['./other-punch.component.scss']
})
export class OtherPunchComponent implements OnInit {

  public otherPunchInfo:OtherPunch={}as OtherPunch;
  public punchTime:string;
  public latitude:string;
  public longitude:string;
  public locationAddress:string;
  public deviceID:string;
  public punchSourceID:string;
  public image1:string;
  public image2:string;
  public image1URL:string;
  public image2URL:string;
  public requestRemark:string;
  public labelName:string;
  readonly UICONSTANT = UI_CONSTANT;
  @Output() canceRequestByESSdiv = new EventEmitter<boolean>();
  public datepickerConfig: Partial<BsDatepickerConfig>;
  @Input() latituded:number;
  @Input() longituded:number;
  @Input() currentAddresss:string;
  public disabledTxt:boolean=false;
  public isDisabled: boolean = true;
  private readonly punchTimed:string;
  public expInDate:string;


  constructor(private otherPunchService:OtherPunchService) {
    this.datepickerConfig = Object.assign({}, 
      { containerClass: 'theme-default', 
      adaptivePosition:true,dateInputFormat: 'DD-MMM-YYYY' });
   }

  ngOnInit(): void {
    this.labelName='Request';
    this.otherPunchInfo.latitude=this.latituded;
    this.otherPunchInfo.longitude=this.longituded;
    this.locationAddress= this.currentAddresss
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.otherPunchInfo.punchTime = moment(moment().toDate()).format('HH:mm');
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.expInDate=moment(moment().toDate()).format('DD-MMM-YYYY');
  }
  SaveReuestEss(params)
  {
    const tempOtherPunchInfo = AppUtil.deepCopy(this.otherPunchInfo);
    tempOtherPunchInfo.otherPunchRequestID=0;
    tempOtherPunchInfo.employeeID=0;
    tempOtherPunchInfo.punchTime= tempOtherPunchInfo.punchTime;
    tempOtherPunchInfo.latitude= this.latituded;
    tempOtherPunchInfo.longitude= this.longituded;
    tempOtherPunchInfo.locationAddress='Okhla';
    tempOtherPunchInfo.deviceID=0;
    tempOtherPunchInfo.punchSourceID= 3;
    tempOtherPunchInfo.image1='3fa85f64-5717-4562-b3fc-2c963f66afa6';
    tempOtherPunchInfo.image2='3fa85f64-5717-4562-b3fc-2c963f66afa6';
    tempOtherPunchInfo.image1URL='';
    tempOtherPunchInfo.image2URL='';
    tempOtherPunchInfo.requestRemark= tempOtherPunchInfo.requestRemark;
    this.otherPunchService.saveRequesredByEss(tempOtherPunchInfo)
  }

  CancelRequestEss()
  {
  this.canceRequestByESSdiv.emit(false);
  }
  updateStateLocaly(event, field) {
    const timeTemp = moment(event).format("HH:mm");
     switch (field) {
      case UI_CONSTANT.PUNCH_TIME.PUNCHTIME:
        this.otherPunchInfo.punchTime = moment(event).format("HH:mm");
         break;
     }
   }

}
