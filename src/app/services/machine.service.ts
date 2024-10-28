import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { EditableCellRendererComponent } from '../module/masters/renderer/editable-cell-renderer.component';
import { MachineMaster } from '../store/model/machineMaster.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';


@Injectable({
  providedIn: 'root'
})
export class MachineService {

  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent
  };
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;

  private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
  machineList: BehaviorSubject<Array<MachineMaster>>= new BehaviorSubject<Array<MachineMaster>>([]);
  machine: BehaviorSubject<MachineMaster>= new BehaviorSubject<MachineMaster>(null);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  machineModels: BehaviorSubject<Array<any>>= new BehaviorSubject<Array<any>>([]);
  machineTypes: BehaviorSubject<Array<any>>= new BehaviorSubject<Array<any>>([]);
  machineConnTypes: BehaviorSubject<Array<any>>= new BehaviorSubject<Array<any>>([]);
  networkModeTypes: BehaviorSubject<Array<any>>= new BehaviorSubject<Array<any>>([]);

  setGridApi(data) {
    this._gridApi.next(data);
 }

 getGridApi() {
   return this._gridApi.asObservable();
 }
 setVisibility(val){
  this._visiblePopup.next(val);
  }

  getVisiblity(){
  return this._visiblePopup.asObservable();
  }
  constructor(
    private router: Router,
    private remoteService: RemoteService<any>,
    private notificationService:NotificationService,
    private appCoreCommonService:AppCoreCommonService) {  }

  public getAll(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.requestHeader = {};
    serviceConf.path = PATH.MACHINE_GETALL;
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
        this.machineList.next(response);
        return response;
    }));
  }
  public getByID(machineID: number){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.requestHeader = {};
    serviceConf.path = PATH.MACHINE_GETBYID+machineID;

    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
        this.machine.next(response);
        return response;
    }));

  }

  public createMachine(machine: MachineMaster){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.MACHINE_CREATE;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = machine;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response.messageType === 0){
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.setVisibility(false);
        this.router.navigate(['/machine']);
      }
      else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
  public updateMachine(machine: MachineMaster){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH.MACHINE_UPDATE;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = machine;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response.messageType === 0){
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.setVisibility(false);
        this.router.navigate(['/machine']);
      }
      else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
  public deleteMachine(machineID: number){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.MACHINE_DELETE+machineID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response.messageType === 0){
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.setVisibility(false);
      }
      else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }

  public getMachineModels(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.requestHeader = {};
    serviceConf.path = PATH.GET_MACHINE_MODEL;
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
        this.machineModels.next(response);
        return response;
    }));

  }
  public getMachineTypes(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.requestHeader = {};
    serviceConf.path = PATH.GET_MACHINE_TYPE;
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
        this.machineTypes.next(response);
        return response;
    }));

  }
  public getMachineConnType(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.requestHeader = {};
    serviceConf.path = PATH.GET_MACHINE_CONNTYPE;
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
        this.machineConnTypes.next(response);
        return response;
    }));

  }

  public getNetworkModes(){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.requestHeader = {};
    serviceConf.path = PATH.GET_NETWORKMODE_TYPES;
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
        this.networkModeTypes.next(response);
        return response;
    }));
  }

  getCSVReport(data, fileName){
    this.appCoreCommonService.exportExcel(data, fileName);
  }

  prepareColumnForGrid() {
    const columnDefs:any[] = [
    {
        headerName: 'Machine Code',
        field: 'machineCode',
        filter: true,
        editable: false,
        sortable: true,
        suppressSizeToFit:true,
    },
    {
        headerName: 'Machine Name',
        field: 'machineName',
        filter: true,
        suppressSizeToFit:true,
        editable: false,
        sortable: true,

    },
    {
        headerName: 'IP Address',
        field: 'ipAddress',
        filter: true,
        editable: false,
        sortable: true,
        suppressSizeToFit:true,
    },
    {
        headerName: 'Subnet Mask',
        field: 'subnetmask',
        filter: true,
        suppressSizeToFit:true,
        editable: false,
        sortable: true,
    },
   {
        headerName: 'Gateway',
        field: 'gateway',
        filter: true,
        suppressSizeToFit:true,
        editable: false,
        sortable: true,
    },
    {
        headerName: 'Port',
        field: 'port',
        filter: true,
        suppressSizeToFit:true,
        editable: false,
        sortable: true,
    },
    {
        headerName: 'MacAddress',
        field: 'macAddress',
        filter: true,
        suppressSizeToFit:true,
        editable: true,
        sortable: true,
    },
    {
        headerName: "Action",
        width: 100,
        cellRenderer: "editableCellRendererComponent",
        editable: false,
        colId: "action",
        editAllow: true,
        deleteAllow: true
    }]
    return columnDefs;
  }
}
