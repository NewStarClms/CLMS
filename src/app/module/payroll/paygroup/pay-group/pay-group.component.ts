import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PayComponentService } from 'src/app/services/pay-component.service';
import { PayGroupModel } from 'src/app/store/model/pay-component.model';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { RemoteService } from '../../../../common/remote.service';
import { PayGroupService } from '../../../../services/pay-group.service';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AppCoreCommonService } from '../../../../services/app.core-common.services';
import { AppUtil } from '../../../../common/app-util';
import { PATH } from '../../../../common/constants/service-path.constants';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-pay-group',
  templateUrl: './pay-group.component.html',
  styleUrls: ['./pay-group.component.scss']
})
export class PayGroupComponent implements OnInit {

  public payGroupList:Array<PayGroupModel> = [];
  public rowData: Array<any> = [];
  public columnDefs: Array<any> = [];
  public payGroupInfo:PayGroupModel = {} as PayGroupModel;
  headerdialogName= 'Add/Update Pay Group';
  display = false;
  labelName = 'Save';
  public policyID:number;
  public OUMAPING_PATH_PAYGROUP= UI_CONSTANT.OU_POLICY_PAYGROUP;
  public displayPolicy=false;

  constructor(
    private payGroupService: PayGroupService,
    private _store: Store<any>,
    private router: Router,
    private appCoreCommonService: AppCoreCommonService,
    private confirmationService: ConfirmationService
  ) { 
  }

  ngOnInit(): void {
    this.payGroupService.setVisibility(false);
    this.payGroupService.setPolicyVisibility(false);
    this.columnDefs = this.payGroupService.prepareColumnDef();
    this.payGroupService.getVisiblity().subscribe(res => {
      this.display = res;
    })
    this.payGroupService.getPayGroupList().subscribe(res=>{
      console.log('res',res);
      if(res && res.policyes){
        this.rowData = AppUtil.deepCopy(res.policyes);
      }
    });  

  }
  addnew(){
    this.policyID = 0;
    this.router.navigate(['/payroll/add-edit-pay-group/'+0]);
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.policyID = params.data.policyID; 
        this.router.navigate(['/payroll/add-edit-pay-group/'+params.data.policyID]);
      }
      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.policyID == params.data.policyID);
            temdata.splice(index,1);
            this.payGroupService.deletePayGroup(params.data.policyID);
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
      if (action === UI_CONSTANT.ACTIONS.MAPOU) {
        this.policyID = params.data.policyID;  
        this.display = true;
      }
      
    }
  }

  SavePayGroupData(f){
    console.log(this.payGroupInfo,'-info');
    this.payGroupInfo.policyTypeID = 0;
    this.payGroupInfo.policyID = 0;
    this.payGroupService.SavePayGroupData(this.payGroupInfo);
  }
  cancelRequest(){
    this.payGroupService.setVisibility(false);
  }
 
  keyPressAlphanumeric(e){
    this.appCoreCommonService.keyPressAlphanumeric(e);
  } 
  closePopup(){
    this.displayPolicy=false;
  }
  closeDailog(){
    this.payGroupService.setVisibility(false);
  }

  exportGridData() {
    this.payGroupService.getCSVReport(this.rowData , 'PayGroup');
 }


 refreshPages(){
  console.log('okkk');
  setTimeout( ()=>{
    this.payGroupService.getPayGroupList().subscribe(res=>{
      console.log('res',res);
      if(res && res.policyes){
        this.rowData = AppUtil.deepCopy(res.policyes);
      }
    });  
    }, 1000)
}
}
