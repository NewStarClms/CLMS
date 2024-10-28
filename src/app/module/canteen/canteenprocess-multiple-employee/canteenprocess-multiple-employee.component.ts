import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { CanteenprocessSingle } from 'src/app/store/model/canteen.model';
import { CanteenUserService } from 'src/app/services/canteen-user.service';

@Component({
  selector: 'app-canteenprocess-multiple-employee',
  templateUrl: './canteenprocess-multiple-employee.component.html',
  styleUrls: ['./canteenprocess-multiple-employee.component.scss']
})
export class CanteenprocessMultipleEmployeeComponent implements OnInit {
  public canteenprocessmultipleInfo:CanteenprocessSingle= {} as CanteenprocessSingle;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  @Input() employeeID:number;
  @Input() FromDate:string;
  @Input() ToDate:string; 
  @Input() singlemultidiv:string;
  public singleroster:boolean;
  public multiroster:boolean;
  @Output() multipleCanteenProcessdiv = new EventEmitter<boolean>();
  constructor(private canteenUserService:CanteenUserService) {
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
    this.canteenprocessmultipleInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.canteenprocessmultipleInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY');
  }


  ngOnChanges(changes: SimpleChange) {
    this.canteenprocessmultipleInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.canteenprocessmultipleInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY') ;
    if(this.singlemultidiv=='single'){
      this.singleroster=true;
      this.multiroster=false;
   }else{
    this.singleroster=false;
    this.multiroster=true;
   }
   }

  CanteenProcessMultiple()
  {
    const tempcanteenprocessmultipleInfo = AppUtil.deepCopy(this.canteenprocessmultipleInfo);
    tempcanteenprocessmultipleInfo.employeeID = this.employeeID;
    if(this.canteenprocessmultipleInfo.fromDate != null){
      tempcanteenprocessmultipleInfo.fromDate= moment(this.canteenprocessmultipleInfo.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      tempcanteenprocessmultipleInfo.fromDate=null;
    }
    if(this.canteenprocessmultipleInfo.toDate!=null){
      tempcanteenprocessmultipleInfo.toDate= moment(this.canteenprocessmultipleInfo.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
    }else{
      tempcanteenprocessmultipleInfo.toDate = moment(moment(new Date()).format('YYYY-MM-DD')).format("YYYY-MM-DD");
    }
    this.canteenUserService.saveCanteenprocessmultiple(tempcanteenprocessmultipleInfo)
    this.cancel();

  }

  cancel()
  {
 //   this.canteenprocessmultipleInfo = {} as CanteenprocessSingle;
    this.canteenprocessmultipleInfo.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.canteenprocessmultipleInfo.toDate=moment(this.ToDate).format('DD-MMM-YYYY');
    this.multipleCanteenProcessdiv.emit(false);
  
  }

}
