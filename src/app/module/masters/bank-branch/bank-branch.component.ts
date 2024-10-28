import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { Bank, BankBranch, City } from '../../../store/model/master-data.model';
import { BankbranchService } from 'src/app/services/bankbranch.service';
import { selectBankBranchState, selectBankState, selectCityState } from 'src/app/store/app.state';
import { NgForm } from '@angular/forms';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { CityService } from 'src/app/services/city.service';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-bank-branch',
  templateUrl: './bank-branch.component.html',
  styleUrls: ['./bank-branch.component.scss']
})
export class BankBranchComponent implements OnInit {

  public columnDefs!: any[];
  
    public rowData: Array<BankBranch>= [];
    public bankBranchInfo: BankBranch = {} as BankBranch;
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public countryList:Array<{countryID:number,countryName:string}>=[];
    public stateList:Array<any>=[];
    public cityList:Array<any>=[];
    public bankList:Array<any>=[];
    public isCityActive = true;
    public labelName:string="";
    public headerdialogName:string="";
    constructor(
      private _store: Store<any>,
      private bankbranchService:BankbranchService,
      private confirmationService:ConfirmationService,
      private cityService:CityService,
      private authenticationService:AuthService

    ) {

    }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.countryList = UI_CONSTANT.COUNTRY;
    this._store.select(selectCityState).subscribe(result => {
      if (result && result.cityList) {
        this.stateList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityService.getCityDropdownOptionList(this.countryList[0].countryID, 'state'));
        this.cityList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityList);
      }
    });
    this._store.select(selectBankState).subscribe(res =>{
      if(res && res.bankList)  {
        const tempbanList:Bank[]=AppUtil.deepCopy(res.bankList);
        tempbanList.map(bank=>{
          this.bankList.push({
            bankID:bank.bankID,
            bankName:bank.bankName
          })
        })
      }
     });
    this._store.select(selectBankBranchState).subscribe(res =>{
     if(res && res.bankbranchList)  {
       this.rowData = res.bankbranchList;
     }
     console.log('List',this.rowData);
    });
    this.columnDefs = this.bankbranchService.prepareColumnForGrid();
    this.bankbranchService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveBankBranchData(bankbranchForm:NgForm){
  console.log(this.bankBranchInfo);
  if(this.bankBranchInfo.bankBranchID >0 ){
    this.bankbranchService.updateStateOfCell(this.bankBranchInfo);
  }
  else{
    this.bankbranchService.saveBankBranch(this.bankBranchInfo);
  }
}
CancelBankBranchData(){
  this.bankbranchService.setVisibility(false);
}
addNewBankBranch(){
  this.labelName="Save";
   this.headerdialogName="Add Bank Branch";
  this.bankbranchService.setVisibility(true);
  this.bankBranchInfo = {} as BankBranch;
}
onRowEditingStarted(params) {
  params.api.refreshCells({
    columns: ["action"],
    rowNodes: [params.node],
    force: true
  });
}
onRowEditingStopped(params) {
  console.log('stop=',params);
  params.api.refreshCells({
    columns: ["action"],
    rowNodes: [params.node],
    force: true
  });
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.bankbranchService.setVisibility(true);
      this.bankBranchInfo = params.data;
      if(this.bankBranchInfo.bankBranchID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Bank Branch";
      }
      if (this.bankBranchInfo.stateID) {
        console.log('dddddddd',this.bankBranchInfo,this.bankBranchInfo.stateID,this.bankBranchInfo.cityID);
        this.fillCityDDL();
      }
    }


    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.bankBranchID == params.data.bankBranchID);
          temdata.splice(index,1);
          this.bankbranchService.deleteCellFromRemote(params);
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
      this.bankbranchService.updateStateOfCell(params);
    }

    if (action === UI_CONSTANT.ACTIONS.CANCEL) {
      params.api.stopEditing(true);
    }
  }
}

keyPressAlphanumeric(event) {
  AppUtil.validateAlphanumeric(event);
}
fillCityDDL() {
  if (this.bankBranchInfo.stateID) {
    this.isCityActive = false;
    return this.cityList = this.cityService.getCityDropdownOptionList(this.bankBranchInfo.stateID, 'city');
  }
  return this.cityList;
}
exportGridData(){
  this.bankbranchService.getCSVReport(this.rowData, 'BankBranch');
}
}
