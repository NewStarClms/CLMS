import { Component, OnInit } from '@angular/core';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { SettlementReason } from 'src/app/store/model/settlement-reason.model';
import { SettlementReasonService } from 'src/app/services/settlement-reason.service';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/services/authentication.service';
import { selectSettlementReaasonState } from 'src/app/store/payroll.app.state';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-settelment-reason',
  templateUrl: './settelment-reason.component.html',
  styleUrls: ['./settelment-reason.component.scss']
})
export class SettelmentReasonComponent implements OnInit {

  public columnDefs!: any[];
  
  public rowData: Array<SettlementReason>= [];
  public SettlementReasonInfo: SettlementReason = {} as SettlementReason;
  public displayPosition: boolean;
  public labelName:string="Save";
  public headerdialogName:string="Add Settlement Reason";
  public display = false;


  constructor( 
    private _store: Store<any>,
    private settlementReasonService: SettlementReasonService,
    private confirmationService: ConfirmationService,
    private authenticationService:AuthService) { }

  ngOnInit(): void {

    this.authenticationService.setGlobalFilterVisibility(false);
      this.settlementReasonService.getVisiblity().subscribe(res =>{
        this.display = res;
      });
      this._store.select(selectSettlementReaasonState).subscribe(res=>{
        if (res && res.SettlementReasonList) {
          this.rowData = AppUtil.deepCopy(res.SettlementReasonList.settings);
          console.log(this.rowData);
        }
      });
      this.columnDefs = this.settlementReasonService.prepareColumnForGrid();

  }

  onCellClicked(params) {
    // Handle click event for action cells
     if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.SettlementReasonInfo = params.data;
        this.display = !this.display;
        if(this.SettlementReasonInfo.settlementReasonID !== 0 ){
          this.labelName="Update";
         this.headerdialogName="Update Settlement Reason";
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
              let index = this.rowData.findIndex((item)=>item.settlementReasonID == params.data.settlementReasonID);
              temdata.splice(index,1);
              this.settlementReasonService.deleteCellFromRemote(params);
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
    this.headerdialogName="Add Settlement Reason";
    this.settlementReasonService.setVisibility(true);
    this.SettlementReasonInfo = {} as SettlementReason;
  }

  SaveSettlementData(SettlementForm:NgForm)
  {
    console.log(this.SettlementReasonInfo);
    if(this.SettlementReasonInfo.settlementReasonID > 0){
     this.settlementReasonService.UpdateSettlementReason(this.SettlementReasonInfo);
     this.settlementReasonService.setVisibility(false);
    }
   else{
    this.settlementReasonService.saveSettlementReason(this.SettlementReasonInfo);
    this.settlementReasonService.setVisibility(false);
  }

  }

  CancelSettlementData(SettlementForm){
    console.log(this.SettlementReasonInfo);
    this.settlementReasonService.setVisibility(false);
  }

  exportGridData() {
    this.settlementReasonService.getCSVReport(this.rowData , 'SettlementReason');
 }
 
}
