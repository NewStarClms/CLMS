import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bank } from '../store/model/master-data.model';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { Store } from '@ngrx/store';
import { saveBankAction } from '../store/actions/master.action';
import {  GridApi } from 'ag-grid-community';
import { NotificationService } from '../common/notification.service';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { CityService } from './city.service';
import { selectBankState } from '../store/app.state';
import { AppCoreCommonService } from './app.core-common.services';
import{ UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class BankService {

 
  cityDropDownOption:Array<{cityID:string,cityName:string}>;
  stateDropDownOption:Array<{stateID:string,stateName:string}>;
  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  bankStateList: BehaviorSubject<Array<Bank>>= new BehaviorSubject<Array<Bank>>([]);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  setGridApi(data) {
    this._gridApi.next(data);
 }

 getGridApi() {
   return this._gridApi.asObservable();
 }
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Bank>,
    private notificationService:NotificationService,
    private userGroupService: UserGroupService,
    private cityService: CityService,
    private appCoreCommonService:AppCoreCommonService
  ) {
    this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }
    getVisiblity(){
    return this._visiblePopup.asObservable();
    }

  public fetchBankData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_BANK;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this.bankStateList.next(response.bankes);
        this._store.dispatch(new saveBankAction(response.bankes));
      }
      return response;
    });

  }
  saveBank(bankInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_BANK;
    serviceConf.requestHeader = {};
    const payload: Bank = {
      bankID: 0,
      bankCode: bankInfo.bankCode,
      bankName: bankInfo.bankName,
      address: bankInfo.address,
      countryID: bankInfo.countryID,
      stateID: bankInfo.stateID,
      cityID: bankInfo.cityID,
      ifscCode: bankInfo.ifscCode
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchBankData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs:any[] = [
      {
        headerName: 'Name',
        field: 'bankName',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,

    },
    {
      headerName: 'Code',
      field: 'bankCode',
      filter: true,
      suppressSizeToFit:true,
      editable: true,
      sortable: true,
      width: 130,

  },
  {
  headerName: 'Address',
  field: 'address',
  filter: true,
  editable: true,
  sortable: true,
  width:170,

  },{
  headerName: 'IFSC Code',
  field: 'ifscCode',
  filter: true,
  suppressSizeToFit:true,
  editable: true,
  sortable: true,
  width:150,

  },
  {
    headerName: 'State',
    field: 'stateID',
    filter: true,
    suppressSizeToFit:true,
    editable: true,
    sortable: true,
    cellEditorParams:'state'
    },

  {
    headerName: "",
    width: 100,
    cellRenderer: "editableCellRendererComponent",
    editable: false,
    deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Bank, UI_CONSTANT.ACTIONS.DELETE),
    editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Bank, UI_CONSTANT.ACTIONS.UPDATE),
    colId: "action"
  }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_BANK+'/'+params.data.bankID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.fetchBankData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }
      else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

   }
    updateStateOfCell(params){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_BANK;
      serviceConf.requestHeader = {};
      const payload: Bank = params;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchBankData();
          this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
    }
    fetchStateBankDataByID(bankid){
      let bankObj: any= null;
      this._store.select(selectBankState).subscribe(data =>{
        let bankStateList= data.bankList;
        console.log('obj-',this.bankStateList);
        if(bankStateList){
          bankObj = bankStateList.filter(item=> item.bankID === bankid)[0];
      }
      });

      console.log('obj',bankObj);
      return (bankObj)?bankObj:false;
    }
    // getBankDropdownOptionList(action:string){
    //   let dropDownOption: Array<any> = [];
    //   let key = 'bankID';
    //   if(action === 'bank'){
    //     const stateList:Array<Bank  > = this.bankStateList.getValue();
    //     stateList.map(x => {
    //       dropDownOption.push({
    //         bankID: x.bankID,
    //         bankName: x.bankName
    //       })
    //     });
    //   }

    //   const arrayUniqueByKey = [...new Map(dropDownOption.map(item =>
    //     [item[key], item])).values()];
    //   return arrayUniqueByKey;
    // }
    getCSVReport(data, fileName){
      this.appCoreCommonService.exportExcel(data, fileName);
    }
}
