import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Bank } from '../../../store/model/master-data.model';
import { BankService } from 'src/app/services/bank.service';
import { selectBankState, selectCityState } from 'src/app/store/app.state';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { CityService } from 'src/app/services/city.service';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {
  public columnDefs!: any[];
    public rowData: Array<Bank>= [];
    public bankInfo: Bank = {} as Bank;
    public isAddAllowed = true;
    public isCityActive = true;
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public countryList:Array<{countryID:number,countryName:string}>=[];
    public stateList:Array<any>=[];
    public cityList:Array<any>=[];
    public labelName:string="";
    public headerdialogName:string="";
  constructor(
    private _store: Store<any>,
    private bankService: BankService,
    private confirmationService:ConfirmationService,
    private cityService:CityService,
    private authenticationService:AuthService

  ) {}

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
       this.rowData = res.bankList;
     }
    });
    this.columnDefs = this.bankService.prepareColumnForGrid();
    this.bankService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveBankData(bankForm:NgForm){
  console.log(this.bankInfo);
  if(this.bankInfo.bankID >0){
    this.bankService.updateStateOfCell(this.bankInfo);
  }else{
    this.bankService.saveBank(this.bankInfo);
  }
}
CancelBankData(){
  this.bankService.setVisibility(false);
}
addNew(){
  this.labelName="Save";
  this.headerdialogName="Add Bank";
  this.bankInfo = {} as Bank;
  this.bankService.setVisibility(true);
}
getState(){
  return !((this.bankInfo.stateID)?true : false);
}
onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.bankService.setVisibility(true);
      this.bankInfo = params.data;
      if(this.bankInfo.bankID !== 0 ){
       this.labelName="Update";
       this.headerdialogName="Update Bank";
      }
      if (this.bankInfo.stateID) {
        console.log(this.bankInfo.stateID,this.bankInfo.cityID);
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
          let index = this.rowData.findIndex((item)=>item.bankID == params.data.bankID);
          temdata.splice(index,1);
          this.bankService.deleteCellFromRemote(params);
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
      this.bankService.updateStateOfCell(params);
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
  if (this.bankInfo.stateID) {
    this.isCityActive = false;
    return this.cityList = this.cityService.getCityDropdownOptionList(this.bankInfo.stateID, 'city');
  }
  return this.cityList;
}

exportGridData(){
  this.bankService.getCSVReport(this.rowData , 'Bank');
}
}
