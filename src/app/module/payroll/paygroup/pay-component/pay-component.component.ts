import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { PayComponentService } from '../../../../services/pay-component.service';
import { Store } from '@ngrx/store';
import { selectPayHeadsState, selectPayComponentState } from '../../../../store/payroll.app.state';
import { AppUtil } from '../../../../common/app-util';
import { PayComponentModel } from 'src/app/store/model/pay-component.model';
import { PayHeadsModel } from '../../../../store/model/pay-component.model';
import { combineLatest } from 'rxjs';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-payroll-pay-component',
  templateUrl: './pay-component.component.html',
  styleUrls: ['./pay-component.component.scss']
})
export class PayComponentComponent implements OnInit {

  public payHeadsList:Array<PayHeadsModel> = [];
  public rowData: Array<any> = [];
  public columnDefs: Array<any> = [];
  public payCommInfo:PayComponentModel=null;
  labelName: string;
  headerdialogName: string;

  constructor(
    private payComponentService: PayComponentService,
    private _store: Store<any>,
    private router: Router,
    private confirmationService:ConfirmationService
  ) { 
    this.payComponentService.getPayComponentsfromRemote();
    this.payComponentService.getPayheadsfromRemote();
  }

  ngOnInit(): void {
    this.columnDefs = this.payComponentService.prepareColumnDef();
    combineLatest(
      this._store.select(selectPayHeadsState),
      this._store.select(selectPayComponentState)
    ).subscribe(([payheads,paylist])=>{
      if(payheads && payheads.payheadList && paylist && paylist.payComList){
        this.payHeadsList = AppUtil.deepCopy(payheads.payheadList);
        this.rowData = AppUtil.deepCopy(paylist.payComList);
            this.rowData.map(val =>{
              val.payHeadName =  this.payHeadsList.filter(x=> x.payHeadID === val.payHeadID)[0].payHeadName;
            })
            console.log('payArr', paylist);
      }
    });
    
  }
  addnew(){
    this.router.navigate(['/payroll/add-edit-pay/'+ 0]);
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.router.navigate(['/payroll/add-edit-pay/'+params.data.payCode]);
    }

  
            if (action === UI_CONSTANT.ACTIONS.DELETE) {
        console.log(params)
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.payCode == params.data.payCode);
            temdata.splice(index,1);
            this.payComponentService.deleteCellFromRemote(params);
            this.rowData = temdata;

          },
          reject: (type) => {
            switch (type) {
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
      }
  
      if (action === UI_CONSTANT.ACTIONS.CANCEL) {
        params.api.stopEditing(true);
      }
    }
  }
  getPayHead(){

  }

  exportGridData(){
    this.payComponentService.getCSVReport(this.rowData , 'PayComponent');
  }
}
