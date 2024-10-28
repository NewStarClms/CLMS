import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';
import { AuthService } from 'src/app/services/authentication.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { GateService } from '../../../services/gate.service';
import { selectGateState } from '../../../store/app.state';
import { Gate } from '../../../store/model/master-data.model';

@Component({
  selector: 'app-gate',
  templateUrl: './gate.component.html',
  styleUrls: ['./gate.component.scss']
})
export class GateComponent implements OnInit {


  public columnDefs!: any[];
    public rowData: Array<Gate>= [];
    public gateInfo:Gate = {} as Gate;
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public labelName:string="";
    public headerdialogName:string="";
    employeeSerchList:any[];
    // public gatepassemployee:Array<{ key: string, value: number }>=[];
    public gatepassemployee:Array<any>=[];
  constructor(
    private _store: Store<any>,
    private gateService:GateService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService,
    private appSearchService: AppSearchCommonService

  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectGateState).subscribe(response=>
      {
        if (response && response.gateList) {
            this.rowData = response.gateList;
        }
      });
    this.columnDefs = this.gateService.perpareColumnForGrid()
    this.gateService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveGateData(gateForm:NgForm){
  console.log(this.gatepassemployee)
  if(this.gatepassemployee != undefined){
    this.gateInfo.authorizedUser = this.gatepassemployee.map(({ value }) => value).join('~');
    this.gateInfo.authorizedUserDetails = this.gatepassemployee.map(({key})=> key).join('~');
    }
    console.log(this.gateInfo.authorizedUser,this.gateInfo.authorizedUserDetails)
  if(this.gateInfo.gateID > 0){
   this.gateService.updateStateOfCell(this.gateInfo);
  } else{
    console.log(this.gateInfo);
    this.gateService.saveGate(this.gateInfo);
  }
 
}
CancelGateData(){
  this.gateService.setVisibility(false);
}
addNew(){
  this.gatepassemployee=[];
  this.labelName="Save";
   this.headerdialogName="Add Gate";
  this.gateService.setVisibility(true);
  this.gateInfo = {}  as Gate;
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      
      this.gateInfo = params.data;
      // console.log(this.gateInfo);
      
      if(this.gateInfo.gateID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Gate";
      }
      if(this.gateInfo.authorizedUser != null && this.gateInfo.authorizedUserDetails !=null){
        let gatepassemployee = this.gateInfo.authorizedUser.split('~').map(value => Number(value));
        let gatepassemployeeDetail = this.gateInfo.authorizedUserDetails.split('~').map(key => key);
       this.gatepassemployee=[]
        for(var i=0;i< gatepassemployee.length;i++){
          this.gatepassemployee.push({
            key:gatepassemployeeDetail[i],
            value:gatepassemployee[i]
          })
        }
      }else{
        this.gatepassemployee=[]
      }
      console.log(this.gatepassemployee);
      this.gateService.setVisibility(true);
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.gateID == params.data.gateID);
          temdata.splice(index,1);
          this.gateService.deleteCellFromRemote(params);
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
      this.gateService.updateStateOfCell(params);
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
  this.gateService.getCSVReport(this.rowData , 'Gate');
}

searchData(event) {
  this.appSearchService.getFilteredEmployee(event.query).subscribe(data => {
    if(data && data.searchData){
    this.employeeSerchList = data.searchData;
    
    }
  });
}
}
