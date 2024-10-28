import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveVisitorAdminAction } from '../store/actions/visitorAdmin.action';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { VisitorAdmin, VisitorInOut } from '../store/model/visitorAdmin.model';
import { AppCoreCommonService } from './app.core-common.services';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VisitorEssService {
  defaultColDef: { suppressSizeToFit: boolean; };
  colResizeDefault: string;
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _visitorDetail:BehaviorSubject<VisitorAdmin> = new BehaviorSubject<VisitorAdmin>(null);
    visitorAdminStateList: BehaviorSubject<Array<VisitorAdmin>>= new BehaviorSubject<Array<VisitorAdmin>>([]);
    constructor(
      private remoteService: RemoteService<any>,
      private _store: Store<VisitorAdmin>,
      private notificationService:NotificationService,
      private router:Router,
      private appCoreCommonService: AppCoreCommonService
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
    public fetchVisitorAdminESSData(formdatetime,todatetime,visitorstatus){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_VISITOR_ESS+'?fromDate='+formdatetime+'&toDate='+todatetime+'&status='+visitorstatus;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(result =>{
        if(result){
          console.log(result);
          this.visitorAdminStateList.next(result.visites);
          this._store.dispatch(new saveVisitorAdminAction(result.visites));
        }
        return result;
      });
    }
    public fetchVisitorRequestESSData(id):Observable<any>{
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_VISITOR_ESS+'/VisitorDetail/'+id;
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  
    }
  
    saveVisitorAdminESS(visitoradminInfo){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.FETCH_VISITOR_ESS+'/VisitRequest';
      serviceConf.requestHeader = {};
      const payload: VisitorAdmin = visitoradminInfo;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
         if(response.messageType === 0){
           this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
           this.setVisibility(false);
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
          this.setVisibility(true);
        }
        return response;
      });
  
    }
    perpareColumnForGrid() {
     const columnDefs:any[] = [
      {
        headerName: 'Image',
        field: 'profileImagePath',
        showImage:true,
        width: 720,
      },
        {
          headerName: 'Name',
          field: 'visitorName',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
        {
          headerName: 'Company',
          field: 'companyName',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
        {
          headerName: 'Check In',
          field: 'visitTime',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
        {
          headerName: 'Check Out',
          field: 'visitEndTime',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
        {
          headerName: 'Contact Number',
          field: 'contactNumber',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
        {
          headerName: 'Visit Status',
          field: 'visitStatusID',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          cellEditorParams:UI_CONSTANT.MASTER.VISITORSTATUS,
          editable: true,
          sortable: true,
          width: 720,
        },
        {
          headerName: 'Whom To Meet',
          field: 'employeeDetail',
          filter: true,
          autoHeight: true,
          suppressSizeToFit:true,
          editable: true,
          sortable: true,
          width: 720,
        },
          ]
          return columnDefs;
        }

  updateStateOfCell(visitoradminInfo){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_VISITOR_ESS+'/VisitRequest';
    serviceConf.requestHeader = {};
    const payload: VisitorAdmin = visitoradminInfo;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if(response.messageType === 0){
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        // this.fetchVisitorAdminData();
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
 
  }
