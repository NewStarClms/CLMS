import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { HolidayService } from 'src/app/services/holiday.service';
import { selectHolidayMasterState } from 'src/app/store/app.state';
import { HolidayMaster } from 'src/app/store/model/holidayMaster.model';
import * as moment from 'moment';

@Component({
  selector: 'app-holiday-master',
  templateUrl: './holiday-master.component.html',
  styleUrls: ['./holiday-master.component.scss']
})
export class HolidayMasterComponent implements OnInit {

  public columnDefs!: any[];
  public rowData: Array<HolidayMaster>= [];
  public holidayMasterInfo: HolidayMaster = {} as HolidayMaster;
  public displayPosition: boolean;
  public display = false;
  public isEditable = false;
  public labelName:string="";
  public headerdialogName:string="";
  public holidayTypeList=UI_CONSTANT.HOLIDAY_TYPE;
  public isAddAllowed = true;
  public holiDate:string;
  datepickerConfig : Partial<BsDatepickerConfig>;
constructor(
  private _store: Store<any>,
  private holidayMasterService: HolidayService,
  private confirmationService:ConfirmationService,
) {
this.holidayMasterService.fetchHolidayMasterData();
this.datepickerConfig = Object.assign({},{ 
  containerClass:'theme-default',
  dateInputFormat:'DD-MMM-YYYY',
  adaptivePosition:true,
  initCurrentTime: false });
}

 ngOnInit(): void {
  
  this._store.select(selectHolidayMasterState).subscribe(res =>{
    console.log('holiday com',res);
   if(res && res.HolidayMaster)  {
     this.rowData = res.HolidayMaster;
   }
  });
  this.columnDefs = this.holidayMasterService.prepareColumnForGrid();
  this.holidayMasterService.getVisiblity().subscribe(res =>{
    this.display = res;
  });
}
SaveHolidayMasterData(){
console.log(this.holidayMasterInfo);
if(this.holiDate != null){
 
  this.holidayMasterInfo.holidayDate =  moment(this.holiDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
}
if(this.holidayMasterInfo.holidayID >0){
 this.holidayMasterService.updateStateOfCell(this.holidayMasterInfo);
 
}else{
 this.holidayMasterService.saveHolidayMaster(this.holidayMasterInfo);
 
}
}
CancelHolidayMasterData(){
this.holidayMasterService.setVisibility(false);
}
addNew(){
this.labelName="Save";
this.headerdialogName="Add HolidayMaster";
this.holiDate=null;
this.holidayMasterInfo = {} as HolidayMaster;
this.holidayMasterService.setVisibility(true);
}

onCellClicked(params) {
// Handle click event for action cells
if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
  let action = params.event.path[1].dataset.action;

  if (action === UI_CONSTANT.ACTIONS.EDIT) {
    this.holidayMasterService.setVisibility(true);
    this.holidayMasterInfo = params.data;
    if(this.holidayMasterInfo.holidayID !== 0 ){
     this.labelName="Update";
     this.headerdialogName="Update HolidayMaster";
     const d = moment(this.holidayMasterInfo.holidayDate+'Z').utc().format('DD-MMM-YYYY');
     this.holiDate = d;// moment(new Date(this.holidayMasterInfo.holidayDate)).format('DD-MM-YYYY');
    }
    
  }

  if (action === UI_CONSTANT.ACTIONS.DELETE) {
    this.confirmationService.confirm({
      message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
      header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
      icon: 'pi pi-info-circle',
      accept: () => {
        const temdata = AppUtil.deepCopy(this.rowData);
        let index = this.rowData.findIndex((item)=>item.holidayID == params.data.holidayID);
        temdata.splice(index,1);
        this.holidayMasterService.deleteCellFromRemote(params);
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

  if (action === UI_CONSTANT.ACTIONS.UPDATE) {
    params.api.stopEditing(false);
    console.log('update',params);
    this.holidayMasterService.updateStateOfCell(params);
  }

  if (action === UI_CONSTANT.ACTIONS.CANCEL) {
    params.api.stopEditing(true);
  }
}
}

keyPressAlphanumeric(event) {
AppUtil.validateAlphanumeric(event);
}


exportGridData(){
this.holidayMasterService.getCSVReport(this.rowData , 'HolidayMaster');
}
}
