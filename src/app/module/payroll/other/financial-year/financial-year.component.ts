import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColumnApi, GridApi } from 'ag-grid-community';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { FinancialyYearService } from 'src/app/services/financialy-year.service';
import { selectFinancialyYearState } from 'src/app/store/payroll.app.state';
import { FinancialyYear } from 'src/app/store/model/financialy-year.model';

@Component({
  selector: 'app-financial-year',
  templateUrl: './financial-year.component.html',
  styleUrls: ['./financial-year.component.scss']
})
export class FinancialYearComponent implements OnInit {

  public columnDefs!: any[];
  private api!: GridApi;
  private columnApi!: ColumnApi;
  public rowData:  Array<FinancialyYear>= [];
  public displayPosition: boolean;
  public labelName:string="";
  public headerdialogName:string="";
  public display = false;
  public stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public FinancialyYearInfo: FinancialyYear = {} as FinancialyYear;
  public start: string;
  public end:string;


  constructor(
    private _store: Store<any>,
    private financialyYearService:FinancialyYearService,
    private confirmationService: ConfirmationService
    ) {
      this.datepickerConfig = Object.assign({},{ 
        containerClass:'theme-default',
        dateInputFormat:'DD-MMM-YYYY',
        adaptivePosition:true,
        initCurrentTime: false });
     }

  ngOnInit(): void {
    this.financialyYearService.getVisiblity().subscribe(res =>{
      this.display = res;
      });
      this._store.select(selectFinancialyYearState).subscribe(res=>{
        if (res) {
          this.rowData = AppUtil.deepCopy(res.FinancialyYearList);
          console.log(this.rowData);
        }
      });
      this.columnDefs = this.financialyYearService.prepareColumnForGrid();
  }

  onCellClicked(params) {

    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
     let action = params.event.path[1].dataset.action;
     if (action === UI_CONSTANT.ACTIONS.EDIT) {
       this.FinancialyYearInfo = params.data;
       this.display = !this.display;
       if(this.FinancialyYearInfo.financialYearID !== 0 ){
       this.labelName="Update";
       this.headerdialogName="Update Financialy Year";
       const d = moment(this.FinancialyYearInfo.startDate+'Z').utc().format('DD-MMM-YYYY');
       this.start = d;
       const d1 = moment(this.FinancialyYearInfo.endDate+'Z').utc().format('DD-MMM-YYYY');
       this.end = d1;
       }
     }
 
    if (action === UI_CONSTANT.ACTIONS.DELETE) {
       this.confirmationService.confirm({
         message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
         header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
         icon: 'pi pi-info-circle',
         accept: () => {
           let tempData = AppUtil.deepCopy(this.rowData);
           const temdata = AppUtil.deepCopy(this.rowData);
           let index = this.rowData.findIndex((item)=>item.financialYearID == params.data.financialYearID);
           temdata.splice(index,1);
           this.financialyYearService.deleteCellFromRemote(params);
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
   }
 }

 addNew(){
   this.labelName="Save";
   this.headerdialogName="Add Financialy Year";
   this.financialyYearService.setVisibility(true);
   this.display=true;
   this.start=null;
   this.end=null;
   this.FinancialyYearInfo = {} as FinancialyYear;
 }

 SaveFinancialyYear(financialyYear:NgForm)
 {
   console.log(this.FinancialyYearInfo);
   if(this.start != null){
     this.FinancialyYearInfo.startDate =  moment(this.start, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
   }
   if(this.end != null){
     this.FinancialyYearInfo.endDate =  moment(this.end, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
   }

   if(this.FinancialyYearInfo.financialYearID > 0){
     this.financialyYearService.UpdateFinancialyYear(this.FinancialyYearInfo);
     this.financialyYearService.setVisibility(false);
   }
  else{
   this.financialyYearService.saveFinancialyYear(this.FinancialyYearInfo);
   this.financialyYearService.setVisibility(false);
 }

 }

 Cancel(){
   console.log(this.FinancialyYearInfo);
   this.financialyYearService.setVisibility(false);
 }

 exportGridData() {
  this.financialyYearService.getCSVReport(this.rowData , 'FinancialYear');
}

}
