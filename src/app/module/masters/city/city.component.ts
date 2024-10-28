import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { CityService } from 'src/app/services/city.service';
import { selectCityState } from 'src/app/store/app.state';
import { City } from 'src/app/store/model/master-data.model';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})

export class CityComponent implements OnInit {

  public columnDefs!: any[];
    public rowData: Array<City>= [];
    public cityInfo:City ={} as City;
    public displayPosition: boolean;
  public display = false;
  public isEditable = false;
  public countryList:Array<{countryID:number,countryName:string}>=[];
    public stateList:Array<any>=[];
    public labelName:string="";
    public headerdialogName:string="";
  constructor(
    private _store: Store<any>,
    private cityService:CityService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService

  ) {

  }

   ngOnInit(): void {
    this.countryList = UI_CONSTANT.COUNTRY;
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectCityState).subscribe(result => {
      if (result && result.cityList) {
        this.rowData = result.cityList;
        this.stateList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityService.getCityDropdownOptionList(this.countryList[0].countryID, 'state'));
      }
    });
    this._store.select(selectCityState).subscribe(response=>
      {
        if (response && response.cityList) {
            const tempcityList:City[]=AppUtil.deepCopy(response.cityList);
            tempcityList.map(y=>{
              this.stateList.push({
                stateID:y.stateID,
                stateName:y.stateName
              });
              this.stateList = this.stateList.filter((thing, index) => {
                const _thing = JSON.stringify(thing);
                return index === this.stateList.findIndex(obj => {
                  return JSON.stringify(obj) === _thing;
                });
              });
            })
          }
      });

    this.columnDefs = this.cityService.prepareColumnForGrid();
    this.cityService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveCityData(cityForm:NgForm){
  console.log(this.cityInfo);
  if(this.cityInfo.cityID >0){
    this.cityService.updateStateOfCell(this.cityInfo);
  }else{
    this.cityService.saveCity(this.cityInfo);
  }
}
CancelCityData(){
  this.cityService.setVisibility(false);
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add City";
  this.cityInfo = {} as City;
  this.cityService.setVisibility(true);
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.display = !this.display;
      this.cityInfo = params.data;
      if(this.cityInfo.cityID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update City";
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.cityID == params.data.cityID);
          temdata.splice(index,1);
          this.cityService.deleteCellFromRemote(params);
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
      this.cityService.updateStateOfCell(params);
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
  this.cityService.getCSVReport(this.rowData , 'City');
}
}
