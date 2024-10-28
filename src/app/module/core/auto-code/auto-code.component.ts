import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { AutoCodeService } from 'src/app/services/auto-code.service';
import { selectAutoCodeState, selectAutoCodeOrgState } from 'src/app/store/app.state';
import { AutoCode, codeSeriesMaps } from 'src/app/store/model/autocode.model';

@Component({
  selector: 'app-auto-code',
  templateUrl: './auto-code.component.html',
  styleUrls: ['./auto-code.component.scss'],
  styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `]
})
export class AutoCodeComponent implements OnInit {
  public gridRowData: Array<AutoCode> = [];
  public autocodeInfo: AutoCode = {} as AutoCode;
  public codeSeriesMapsInfo: codeSeriesMaps = {} as codeSeriesMaps;
  public isCityActive = true;
  public isEditable = false;
  public display = false;
  public orgUnitList :Array<any>;
  public autocodeList: Array<codeSeriesMaps> = [];
  public columnDefs: Array<any>;
  public cols: Array<any>;
  public clonedProducts: { [s: string]: codeSeriesMaps; } = {};
  constructor(
    private _store: Store<any>,
    private autocodeService: AutoCodeService,
    private confirmationService: ConfirmationService,
private authenticationService:AuthService
  ) { 
    

  }
  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.cols = [
      {
        headerName: 'Name',
        field: 'name',

      },
      {
        headerName: 'Prefix',
        field: 'prefix',
        // width: 130,

      },
      {
        headerName: 'Suffix',
        field: 'suffix',
        // width: 130,

      },
      {
        headerName: 'Start No',
        field: 'startNo',
        // width: 130,

      },
      {
        headerName: 'Padding',
        field: 'padding',
        // width: 130,

      },
      {
        headerName: 'Last Gen. Code',
        field: 'lastGeneratedCode',
        // width: 130,

      }];

    this._store.select(selectAutoCodeState).subscribe(res => {
      if (res && res.autocodeList) {
        this.gridRowData = res.autocodeList;
        // console.log('ss',res.autocodeList);
        this.autocodeInfo= AppUtil.deepCopy(res.autocodeList)[0];
        // console.log('kkkk',this.autocodeInfo);
      }
    });
    this._store.select(selectAutoCodeOrgState).subscribe(data => {
      if(data && data.orgList){
        console.log('org',data);
        this.orgUnitList = data.orgList;
      }
    });
    this.columnDefs = this.autocodeService.prepareColumnForGrid();
    this.autocodeService.getVisiblity().subscribe(res => {
      this.display = res;
    });
  }

  public validateFields(autocodeData:Array<codeSeriesMaps>): boolean{
    let isvalid:boolean = false;
    autocodeData.forEach(item =>{
      if(!item.startNo || !item.padding){
        isvalid =  true;
      }else{
        isvalid = false;
      }
    });
    return isvalid;
  }
  SaveAutoCodeData() {
    console.log(this.autocodeList);
    let tempAutocodeList: AutoCode = AppUtil.deepCopy(this.autocodeInfo);
    console.log('tempAutocodeList',tempAutocodeList);
    // tempAutocodeList.organizationName = this.gridRowData.filter(item=> item.organizationID === tempAutocodeList.organizationID)[0].organizationName;
    tempAutocodeList.codeSeriesMaps = this.autocodeList;
    console.log('temp',tempAutocodeList);
    this.autocodeService.updateStateOfCell(tempAutocodeList);
  }
  CancelAutoCodeData() {
    this.autocodeService.setVisibility(false);
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.autocodeService.setVisibility(true);
        this.autocodeInfo = params.data;
        this.prepareAutocodeDataByOU(this.autocodeInfo.organizationID,this.autocodeInfo.autoCodeSeriesTypeID)
      }

      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.gridRowData);
            let index = this.gridRowData.findIndex((item) => item.autoCodeSeriesTypeID == params.data.autoCodeSeriesTypeID);
            temdata.splice(index, 1);
            this.autocodeService.deleteCellFromRemote(params);
            this.gridRowData = temdata;

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

      // if (action === UI_CONSTANT.ACTIONS.UPDATE) {
      //   params.api.stopEditing(false);
      //   console.log('update',params);
      //   this.autocodeService.updateStateOfCell(params);
      // }

      // if (action === UI_CONSTANT.ACTIONS.CANCEL) {
      //   params.api.stopEditing(true);
      // }
    }
  }
  keyPressNumbers(event) {
    AppUtil.validateNumbers(event);
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
  exportGridData() {
    this.autocodeService.getCSVReport(this.gridRowData, 'AutoCode');
  }
  prepareAutocodeDataByOU(params,autocodeTypeId) {
    params = Number(params);
    this.autocodeList = [];
    const codeSeriesMap = this.autocodeService.fetchCodeSeriesMapData(params,autocodeTypeId);
    codeSeriesMap.subscribe(data => {
      if(data && data.autoCodeSeries){
        console.log(data.autoCodeSeries);
        this.autocodeList = AppUtil.deepCopy(data.autoCodeSeries);
      }
    });
}
}
