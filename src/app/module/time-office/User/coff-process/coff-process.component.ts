import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { CoffProcess } from 'src/app/store/model/coffprocess.model';
import { CoffProcessService } from 'src/app/services/coff-process.service';

@Component({
  selector: 'app-coff-process',
  templateUrl: './coff-process.component.html',
  styleUrls: ['./coff-process.component.scss']
})
export class CoffProcessComponent implements OnInit {
  public coffProcessInfo : CoffProcess = {} as CoffProcess;
  public coffProcessInfos : CoffProcess = {} as CoffProcess;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public columnDefs!: any[];
  public rowData: Array<CoffProcess>= [];
  public HeaderName :string;
  @Input() employeeID:number;  
  @Output() singleLeaveAccrualdiv = new EventEmitter<boolean>();
  constructor(private coffProcessService:CoffProcessService) {
    this.datepickerConfig = Object.assign({},{ 
      containerClass:'theme-default',
      dateInputFormat:'DD-MMM-YYYY',
      adaptivePosition:true,
      initCurrentTime: false });
   }

  ngOnInit(): void {
    this.columnDefs=this.coffProcessService.coffProcessColumnForGrid();
    this.coffProcessInfo.employeeID=this.employeeID;
     
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.coffProcessInfos.fromDate=moment(firstDay).format('DD-MMM-YYYY');
    this.coffProcessInfos.toDate=moment(lastDay).format('DD-MMM-YYYY') ;
    this.coffProcessInfo.fromDate=moment(firstDay).format('DD-MMM-YYYY');
    this.coffProcessInfo.toDate=moment(lastDay).format('DD-MMM-YYYY') ;


    if(this.coffProcessInfo.employeeID==0)
    {
      this.HeaderName="Coff Process";
    }
    else{
      this.HeaderName="Coff Process";
    }
  }
  onCellClicked(params){
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      
    }
  }

  getCoffProcessData(params)
  {
    if(this.coffProcessInfos.employeeID!=0){
      const tempcoffprocessinfo = AppUtil.deepCopy(this.coffProcessInfos);
       if(this.coffProcessInfos.fromDate != null){
        tempcoffprocessinfo.fromDate= moment(this.coffProcessInfos.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
      //temprosterinfo.fromDate = moment(this.coffProcessInfos.fromDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
       }else{
        tempcoffprocessinfo.fromDate=null;
       }
       if(this.coffProcessInfos.toDate!=null){
        tempcoffprocessinfo.toDate= moment(this.coffProcessInfos.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
         //temprosterinfo.toDate = moment(this.coffProcessInfos.toDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
       }else{
        tempcoffprocessinfo.toDate=null
       }
       tempcoffprocessinfo.employeeID =this.employeeID;
       console.log(tempcoffprocessinfo); 
      //  this.coffProcessInfo.employeeID=this.employeeID;
      tempcoffprocessinfo.requestStatus='';
       tempcoffprocessinfo.expired='';
       tempcoffprocessinfo.fromDate= tempcoffprocessinfo.fromDate;
       tempcoffprocessinfo.toDate= tempcoffprocessinfo.toDate;
       tempcoffprocessinfo.laps='';
       tempcoffprocessinfo.cofGeneratedIDs='';
       tempcoffprocessinfo.remark='';
       this.coffProcessService.fetchCoffPocessData(tempcoffprocessinfo);
       //this.columnDefs=this.coffProcessService.fetchCoffPocessData();
       this.coffProcessService.fetchCoffPocessData(tempcoffprocessinfo).subscribe(res =>{
        if(res)  {
       this.rowData=res;
       }
       this.columnDefs=this.coffProcessService.coffProcessColumnForGrid();
       });
   }
  
  }
  
  saveCoffProcess(){
    
    if(this.coffProcessInfo.employeeID>0){
        const tempcoffprocessinfo = AppUtil.deepCopy(this.coffProcessInfo);
     if(this.coffProcessInfo.fromDate != null){
      tempcoffprocessinfo.fromDate= moment(this.coffProcessInfo.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");

      //temprosterinfo.fromDate = moment(this.coffProcessInfo.fromDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
     }else{
      tempcoffprocessinfo.fromDate=null;
     }
     if(this.coffProcessInfo.toDate!=null){
      tempcoffprocessinfo.toDate= moment(this.coffProcessInfo.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
      // temprosterinfo.toDate = moment(this.coffProcessInfo.toDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
     }else{
      tempcoffprocessinfo.toDate=null
     }
     tempcoffprocessinfo.employeeID =this.employeeID;
     console.log(tempcoffprocessinfo); 
    //this.coffProcessInfo.employeeID=this.employeeID;
    tempcoffprocessinfo.requestStatus='';
    tempcoffprocessinfo.expired='';
    tempcoffprocessinfo.fromDate= tempcoffprocessinfo.fromDate;
    tempcoffprocessinfo.toDate= tempcoffprocessinfo.toDate;
    tempcoffprocessinfo.laps='';
    tempcoffprocessinfo.cofGeneratedIDs='';
    tempcoffprocessinfo.remark='';
    this.coffProcessService.saveCoffProcessSingle(tempcoffprocessinfo);

    }
    else if(this.coffProcessInfo.employeeID==0)
    {
      const tempcoffprocessinfo = AppUtil.deepCopy(this.coffProcessInfo);
      if(this.coffProcessInfo.fromDate != null){
        tempcoffprocessinfo.fromDate= moment(this.coffProcessInfo.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
       // tempcoffprocessinfo.fromDate = moment(this.coffProcessInfo.fromDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
      }else{
        tempcoffprocessinfo.fromDate=null;
      }
      if(this.coffProcessInfo.toDate!=null){
        tempcoffprocessinfo.toDate= moment(this.coffProcessInfo.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD");
       // tempcoffprocessinfo.toDate = moment(this.coffProcessInfo.toDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
      }else{
        tempcoffprocessinfo.toDate=null
      }
      tempcoffprocessinfo.employeeID =0;
      console.log(tempcoffprocessinfo); 
     //this.coffProcessInfo.employeeID=this.employeeID;
     tempcoffprocessinfo.requestStatus='';
     tempcoffprocessinfo.expired='';
     tempcoffprocessinfo.fromDate= tempcoffprocessinfo.fromDate;
     tempcoffprocessinfo.toDate= tempcoffprocessinfo.toDate;
     tempcoffprocessinfo.laps='';
     tempcoffprocessinfo.cofGeneratedIDs='';
     tempcoffprocessinfo.remark='';
    this.coffProcessService.saveCoffProcessMultiple(tempcoffprocessinfo);
    }
 }

 coffPorcessCancel()
 {
  this.coffProcessInfo = {} as CoffProcess;
  this.singleLeaveAccrualdiv.emit(false);
 }

}
