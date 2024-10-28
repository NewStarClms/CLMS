import { Injectable } from '@angular/core';
import { Bank, BankBranch, Branch } from '../store/model/master-data.model';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { Store } from '@ngrx/store';
import { saveBankBranchAction } from '../store/actions/master.action';
import { ColDef } from 'ag-grid-community';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';

import { AppCoreCommonService } from './app.core-common.services';
import { BehaviorSubject } from 'rxjs';
import { selectBankBranchState } from '../store/app.state';
import { AppUtil } from '../common/app-util';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class BankbranchService {
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  dropdownlist:any[];
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  bankBranchStateList: BehaviorSubject<Array<BankBranch>> = new BehaviorSubject<Array<BankBranch>>([]);
  bankStateList: BehaviorSubject<Array<Bank>> = new BehaviorSubject<Array<Bank>>([]);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<BankBranch>,
    private notificationService:NotificationService,
    private appCoreCommonService:AppCoreCommonService,
    private userGroupService: UserGroupService
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

  public fetchBankBranchData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_BANKBRANCH;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){

        this.bankBranchStateList.next(response.bankBranches);
        this._store.dispatch(new saveBankBranchAction(response.bankBranches));
      }
      return response;
    });

  }
  saveBankBranch(bankbranchInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_BANKBRANCH;
    serviceConf.requestHeader = {};
    const payload: BankBranch = {
      bankBranchID: 0,
      bankID: bankbranchInfo.bankID,
      bankBranchCode: bankbranchInfo.bankBranchCode,
      bankBranchName: bankbranchInfo.bankBranchName,
      address: bankbranchInfo.address,
      countryID: bankbranchInfo.countryID,
      stateID: bankbranchInfo.stateID,
      cityID: bankbranchInfo.cityID,
      ifscCode: bankbranchInfo.ifscCode
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
         this.notificationService.showSuccess(response.message, 'Success')
        this.fetchBankBranchData();
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
        field: 'bankBranchName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,
        onCellValueChanged: function ($event) {
          console.log('event',$event);
        },
        valueSetter: params => {
          console.log('dds',params);
          params.data.bankBranchName = params.newValue;
          return true;
      }
    },
    {
      headerName: 'Code',
      field: 'bankBranchCode',
      filter: true,
      autoHeight: true,
      suppressSizeToFit:true,
      editable: true,
      sortable: true,
      width: 130,
      onCellValueChanged: function ($event) {
        console.log('event',$event);
      },
      valueSetter: params => {
        console.log('dds',params);
        params.data.bankBranchCode = params.newValue;
        return true;
    }
  },
  {
    headerName: 'Bank',
    field: 'bankID',
    filter: true,
    cellEditorParams:UI_CONSTANT.MASTER.BANK,
    editable: true,
    sortable: true,
    width:210,
  },
  {
  headerName: 'Address',
  field: 'address',
  filter: true,
  suppressSizeToFit:true,
  editable: true,
  sortable: true,
  width:200,
  onCellValueChanged: function ($event) {
    console.log('event',$event);
  },
  valueSetter: params => {
    console.log('dds',params);
    params.data.address = params.newValue;
    return true;
}
  },{
  headerName: 'State',
  field: 'stateID',
  filter: true,
  suppressSizeToFit:true,
  editable: true,
  sortable: true,
  width:200,
  cellEditorParams: UI_CONSTANT.MASTER.STATE,
  }
  ,{
  headerName: 'IFSC Code',
  field: 'ifscCode',
  filter: true,
  suppressSizeToFit:true,
  editable: true,
  sortable: true,
  width:190,
  },
  {
    headerName: "",
    minWidth: 0,
    cellRenderer: "editableCellRendererComponent",
    editable: false,
    deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.BankBranch, UI_CONSTANT.ACTIONS.DELETE),
    editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.BankBranch, UI_CONSTANT.ACTIONS.UPDATE),
    colId: "action"
  }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_BANKBRANCH+'/'+params.data.bankBranchID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if(response.messageType === 0){
         this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchBankBranchData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

   }
    updateStateOfCell(params){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.PUT;
      serviceConf.path = PATH.FETCH_BANKBRANCH;
      serviceConf.requestHeader = {};
      const payload: BankBranch = params;

      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
         if(response.messageType === 0){
           this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
          this.fetchBankBranchData();
          this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
    }
    getCSVReport(data, fileName){
      this.appCoreCommonService.exportExcel(data, fileName);
    }
    getBankBranchDropdownOptionList(ID: number) {
      this.dropdownlist = null;
      this._store.select(selectBankBranchState).subscribe(data => {
        if (data && data.bankbranchList) {
         // console.log(data.bankbranchList)
          const bankBranchStateList: BankBranch[] = AppUtil.deepCopy(data.bankbranchList);

          let dropDownOption: Array<any> = [];
          let key = '';

            key = 'bankID';
          const bankbranchList: Array<BankBranch> = bankBranchStateList.filter(i => i.bankID === ID);
          //console.log('>>',bankbranchList);
          bankbranchList.map(x => {
            dropDownOption.push({
              bankbranchID: x.bankBranchID,
                bankbranchName: x.bankBranchName
            })
          });

          this.dropdownlist = dropDownOption;
          //console.log('arrayUniqueByKey1BankBranch', this.dropdownlist);
        }
      });
      //console.log('arrayUniqueByKey1BankBranch', this.dropdownlist);

      return this.dropdownlist;
    }
}
