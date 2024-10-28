import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { Branch, City, Company, NatureOfWork } from '../../../store/model/master-data.model';
import { BranchService } from 'src/app/services/branch.service';
import { selectBranchState, selectCityState, selectCompanyState, selectEmployeeState, selectNatureofworkState } from 'src/app/store/app.state';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NgForm } from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { CityService } from 'src/app/services/city.service';
import { AuthService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {
public columnDefs!: any[];
    public rowData: Array<Branch>= [];
    public branchInfo: Branch = {} as Branch;
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isCityActive = true;
    public countryList:Array<{countryID:number,countryName:string}>=[];
    public stateList:Array<any>=[];
    public cityList:Array<any>=[];
    public compList:Array<any>=[];
    public  natList:Array<any>=[];
    public  branchheadList:Array<any>=[];
    public isEditable = false;
    public labelName:string="";
public headerdialogName:string="";
public branchHeadDisplayName:string;
  constructor(
    private _store: Store<any>,
    private branchService: BranchService,
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
    this._store.select(selectCompanyState).subscribe(comp=>{
      if(comp && comp.companyList){
        const tempcompList:Company[]=AppUtil.deepCopy(comp.companyList);
        tempcompList.map(comp=>{
          this.compList.push({
            companyID:comp.companyID,
            companyName:comp.companyName
          })
        })
      }
    });
    this._store.select(selectNatureofworkState).subscribe(nature=>{
      if(nature && nature.natureofworkList){
        const tempnatList:NatureOfWork[]=AppUtil.deepCopy(nature.natureofworkList);
        tempnatList.map(n=>{
          this.natList.push({
            natureID:n.natureOfWorkID,
            natureName:n.natureOfWorkName
          });
        })
      }
    })

    this._store.select(selectBranchState).subscribe(res =>{
     if(res && res.branchList)  {
       this.rowData = res.branchList;
     }
    });
    this.columnDefs=this.branchService.prepareColumnForGrid();
    this.branchService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
    
  }
SaveBranchData(branchForm:NgForm){
  console.log(this.branchInfo);
  if(this.branchInfo.branchID >0){
    this.branchService.updateStateOfCell(this.branchInfo);
  }else{
    this.branchService.saveBranch(this.branchInfo);
  }
}
CancelBranchData(){
  this.branchInfo = {} as Branch;
  this.branchHeadDisplayName = "";
  this.branchService.setVisibility(false);
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add Branch";
  this.branchInfo = {} as Branch;
  this.branchService.setVisibility(true);
}
getState(){
  return !((this.branchInfo.stateID)?true : false);
}
onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.branchInfo = params.data;
      if(this.branchInfo.branchID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Branch";
      }
      if (this.branchInfo.stateID) {
        this.fillCityDDL();
      }
      this.branchService.setVisibility(true);
      this.branchHeadDisplayName = this.branchInfo.branchHeadDisplay;
    }
    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.branchID == params.data.branchID);
          temdata.splice(index,1);
          this.branchService.deleteCellFromRemote(params);
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
      this.branchService.updateStateOfCell(params);
    }

    if (action === UI_CONSTANT.ACTIONS.CANCEL) {
      params.api.stopEditing(true);
    }
  }
}
closeModal(){
  this.closebutton.nativeElement.click();
}
fillCityDDL() {
  if (this.branchInfo.stateID) {
    this.isCityActive = false;
    return this.cityList = this.cityService.getCityDropdownOptionList(this.branchInfo.stateID, 'city');
  }
  return this.cityList;
}
keyPressNumbers(event){
  AppUtil.validateNumbers(event);
}
keyPressAlphanumeric(event) {
  AppUtil.validateAlphanumeric(event);
}

exportGridData(){
  this.branchService.getCSVReport(this.rowData , 'Branch');
}
onGetEmployeeDetail(event){
  this.branchInfo.branchHeadID=event.data;
  this.branchHeadDisplayName = event.column;
}
}
