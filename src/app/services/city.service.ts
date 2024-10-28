import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { AppUtil } from '../common/app-util';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { saveCityAction } from '../store/actions/master.action';
import { selectCityState } from '../store/app.state';
import { City } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private gridApi;
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  cityStateList: BehaviorSubject<Array<City>> = new BehaviorSubject<Array<City>>([]);
  dropdownlist:any[];
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<City>,
    private notificationService: NotificationService,
    private appCoreCommonService: AppCoreCommonService,
    private userGroupService:UserGroupService
  ) {
    this._store.select(selectCityState).subscribe(res => {
     // console.log('citylist', res.cityList);
    });
    this._isEditable.next(false);
    this._isEditable.asObservable();
  }
  setVisibility(val){
    this._visiblePopup.next(val);
    }

    getVisiblity(){
    return this._visiblePopup.asObservable();
    }

  public fetchCityData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_CITY;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        this.cityStateList.next(response.cities);
        this._store.dispatch(new saveCityAction(response.cities));

      }
      return response;
    });

  }
  saveCity(cityInfo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_CITY;
    serviceConf.requestHeader = {};
    const payload: City = {
      cityID: 0,
      stateID: cityInfo.stateID,
      stateName: cityInfo.stateName,
      cityName: cityInfo.cityName,
      countryID: cityInfo.countryID,
      countryName: cityInfo.countryName,
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, 'Success')
        this.fetchCityData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });

  }
  prepareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: 'Country Name',
        field: 'countryName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 190,
        onCellValueChanged: function ($event) {
          //console.log('event', $event);
        },
        valueSetter: params => {
         // console.log('dds', params);
          params.data.countryName = params.newValue;
          return true;
        }
      },
      {
        headerName: 'State Name',
        field: 'stateName',
        filter: true,
        autoHeight: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 212,
        onCellValueChanged: function ($event) {
          //console.log('event', $event);
        },
        valueSetter: params => {
          //console.log('dds', params);
          params.data.stateName = params.newValue;
          return true;
        }
      },
      {
        headerName: 'City Name',
        field: 'cityName',
        filter: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: true,
        width: 300,
        onCellValueChanged: function ($event) {
          //console.log('event', $event);
        },
        valueSetter: params => {
          //console.log('dds', params);
          params.data.cityName = params.newValue;
          return true;
        }
      },
      {
        headerName: "",
        minWidth: 315,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Category, UI_CONSTANT.ACTIONS.DELETE),
        editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Category, UI_CONSTANT.ACTIONS.UPDATE),
        colId: "action"
      }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_CITY + '/' + params.data.cityID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchCityData();
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR)
      }
      return response;
    });

  }
  updateStateOfCell(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.FETCH_CITY;
    serviceConf.requestHeader = {};
    const payload: City = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchCityData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }

  fetchStateCityDataByID(cityid, stateid) {
    let cityObj: any = null;
    this._store.select(selectCityState).subscribe(data => {
      let cityStateList = data.cityList;
    //  console.log('obj-', this.cityStateList);
      if (cityStateList) {
        cityObj = cityStateList.filter(item => item.cityID === cityid && item.stateID === stateid)[0];
      }
    });

    //console.log('obj', cityObj);
    return (cityObj) ? cityObj : false;
  }
  getCityDropdownOptionList(ID: number, action: string) {
    //console.log('city44444444444', this.cityStateList.getValue());
    this.dropdownlist = null;
    this._store.select(selectCityState).subscribe(data => {
      if (data && data.cityList) {
        const cityStateList: City[] = AppUtil.deepCopy(data.cityList);
      //  console.log('city', cityStateList);
        let dropDownOption: Array<any> = [];
        let key = '';
        if (action === 'country') {
          const stateList: Array<City> = cityStateList.filter(i => i.countryID === ID);
          stateList.map(x => {
            dropDownOption.push({
              stateID: x.stateID,
              stateName: x.stateName
            })
          });
        }
        if (action === 'state') {
          key = 'stateID';
          const stateList: Array<City> = cityStateList.filter(i => i.countryID === ID);
          stateList.map(x => {
            dropDownOption.push({
              stateID: x.stateID,
              stateName: x.stateName
            })
          });
        }
        if (action === 'city') {
          key = 'cityID';
          const stateList: Array<City> = cityStateList.filter(i => i.stateID === ID);
          stateList.map(x => {
            dropDownOption.push({
              cityID: x.cityID,
              cityName: x.cityName
            })
          });
        }

        this.dropdownlist = [...new Map(dropDownOption.map(item =>
          [item[key], item])).values()];
       // console.log('arrayUniqueByKey1', this.dropdownlist);
      }
    });
    //console.log('arrayUniqueByKey', this.dropdownlist);

    return this.dropdownlist;
  }
  getCSVReport(data, fileName) {
    this.appCoreCommonService.exportExcel(data, fileName);
  }

}
