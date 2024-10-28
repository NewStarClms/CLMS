import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CanteenprocessSingle } from 'src/app/store/model/canteen.model';
import { CanteenUserService } from 'src/app/services/canteen-user.service';
import { AppUtil } from 'src/app/common/app-util';
import * as moment from 'moment';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';

@Component({
  selector: 'app-canteenprocess-single-employee',
  templateUrl: './canteenprocess-single-employee.component.html',
  styleUrls: ['./canteenprocess-single-employee.component.scss']
})
export class CanteenprocessSingleEmployeeComponent implements OnInit {
  public canteenprocessSingleInfo:CanteenprocessSingle= {} as CanteenprocessSingle;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  @Output() cancelCanteeProcessdiv = new EventEmitter<boolean>();
  @Input()  employeeID:number;
  @Input()  FromDate:string;
  @Input()  ToDate:string;
  @Input() singlemultidiv:string;
  public singleroster:boolean;
  public multiroster:boolean;
  @Output() singleCanteenProcessdiv = new EventEmitter<boolean>();

  constructor(private canteenUserService :CanteenUserService) {
    this.datepickerConfig = Object.assign({},{ 
      containerClass:'theme-default',
      dateInputFormat:'DD-MMM-YYYY',
      adaptivePosition:true,
      initCurrentTime: false });
   }
  ngOnInit(): void {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
    var lastDay = new Date(date.getFullYear(), date.getMonth()-0,0);
    //this.coffProcessInfos.fromDate=moment(firstDay).format('DD-MMM-YYYY');
   // this.coffProcessInfos.toDate=moment(lastDay).format('DD-MMM-YYYY') ;
    this.canteenprocessSingleInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.canteenprocessSingleInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
  }

  ngOnChanges(changes: SimpleChange) {
    this.canteenprocessSingleInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.canteenprocessSingleInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
    if(this.singlemultidiv=='single'){
      this.singleroster=true;
      this.multiroster=false;
   }else{
    this.singleroster=false;
    this.multiroster=true;
   }
   }

  
  saveCanteenProcessSingle()
  {
    const tempcanteenprocessSingleInfo = AppUtil.deepCopy(this.canteenprocessSingleInfo);
    tempcanteenprocessSingleInfo.employeeID = this.employeeID;
    if(this.canteenprocessSingleInfo.fromDate != null){
      tempcanteenprocessSingleInfo.fromDate= moment(this.canteenprocessSingleInfo.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      tempcanteenprocessSingleInfo.fromDate=null;
    }
    if(this.canteenprocessSingleInfo.toDate!=null){
      tempcanteenprocessSingleInfo.toDate= moment(this.canteenprocessSingleInfo.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      tempcanteenprocessSingleInfo.toDate = moment(moment(new Date()).format('YYYY-MM-DD')).format("YYYY-MM-DD");
    }
    this.canteenUserService.saveCanteenprocessSingle(tempcanteenprocessSingleInfo)
    this.cancel();
  }

  cancel()
  {
   // this.canteenprocessSingleInfo = {} as CanteenprocessSingle;
   this.canteenprocessSingleInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
   this.canteenprocessSingleInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
    this.singleCanteenProcessdiv.emit(false);
  }


}
