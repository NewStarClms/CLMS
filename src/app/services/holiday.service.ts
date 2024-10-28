import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveHolidayMasterAction } from '../store/actions/master.action';
import { HolidayMaster } from '../store/model/holidayMaster.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { UserGroupService } from './user-group.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  holidayMasterStateList: BehaviorSubject<Array<HolidayMaster>>= new BehaviorSubject<Array<HolidayMaster>>([]);
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
    private _store: Store<HolidayMaster>,
    private notificationService:NotificationService,
    private appCoreCommonService:AppCoreCommonService,
    private userGroupService: UserGroupService,
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

  public fetchEmployeeHolidays(employeeID, year){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_EMPLOYEE_HOLIDAY +'?employeeId='+employeeID+'&year='+year;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response =>{
      if(response){
        return response;
      }
    }));
  }

  public fetchHolidayMasterData(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_HOLIDAY_MASTER;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        console.log('holiday',response.holidays);
        response.holidays.holidayDate = 
        this.holidayMasterStateList.next(response.holidays);
        this._store.dispatch(new saveHolidayMasterAction(response.holidays));
      }
      return response;
    });

  }
  saveHolidayMaster(HolidayMasterInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_HOLIDAY_MASTER;
    serviceConf.requestHeader = {};
    const payload: HolidayMaster = {
      holidayID: 0,
      holidayName: HolidayMasterInfo.holidayName,
      holidayDate: HolidayMasterInfo.holidayDate,
      holidayType: HolidayMasterInfo.holidayType,
      description: HolidayMasterInfo.description,
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchHolidayMasterData();
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
        headerName: 'Holiday Name',
        field: 'holidayName',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
        width: 180,

    },
    {
      headerName: 'Holiday Date',
      field: 'holidayDate',
      filter: true,
      suppressSizeToFit:true,
      editable: true,
      sortable: true,
      width: 130,
      cellEditorParams: UI_CONSTANT.MASTER.HOLIDAYDATE
  },
  {
  headerName: 'Holiday Type',
  field: 'holidayType',
  filter: true,
  editable: true,
  sortable: true,
  width:170,
  cellEditorParams: UI_CONSTANT.MASTER.HOLIDAYMASTERTYPE,
  },{
  headerName: 'Description',
  field: 'description',
  filter: true,
  suppressSizeToFit:true,
  editable: true,
  sortable: true,
  width:150,

  },
 
  {
    headerName: "",
    width: 100,
    cellRenderer: "editableCellRendererComponent",
    editable: false,
    deleteAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.HolidayMaster, UI_CONSTANT.ACTIONS.DELETE),
    editAllow: this.userGroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.HolidayMaster, UI_CONSTANT.ACTIONS.UPDATE),
    colId: "action"
  }
    ]
    return columnDefs;
  }
  deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.FETCH_HOLIDAY_MASTER+params.data.holidayID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.fetchHolidayMasterData();
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
      serviceConf.path = PATH.FETCH_HOLIDAY_MASTER;
      serviceConf.requestHeader = {};
      const payload: HolidayMaster = params;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
          this.fetchHolidayMasterData();
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

    prepareDashboardGridColumns() {
      const columnDefs:any[] = [
        {
          headerName: 'Holiday Name',
          field: 'holidayName',
          filter: false,
          suppressSizeToFit:true,
          editable: false,
          sortable: false,
          width: 180,
  
      },
      {
        headerName: 'Holiday Date',
        field: 'holidayDate',
        filter: false,
        suppressSizeToFit:true,
        editable: false,
        sortable: false,
        width: 130,
        cellEditorParams: UI_CONSTANT.MASTER.HOLIDAYDATE
    },
    {
    headerName: 'Holiday Type',
    field: 'holidayType',
    filter: false,
    editable: false,
    sortable: false,
    width:170,
    cellEditorParams: UI_CONSTANT.MASTER.HOLIDAYMASTERTYPE,
    }]
    return columnDefs;
  }
}
