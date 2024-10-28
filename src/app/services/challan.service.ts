import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';

@Injectable({
  providedIn: 'root',
})
export class ChallanService {
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visiblePFPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleESIPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleLWFPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visiblePTPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _visibleDownloadPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    userGroupService: any;
  constructor(
    private remoteService: RemoteService<any>,
    private notificationService: NotificationService
  ) {}

  setGridVisibility(val) {
    this._visiblePopup.next(val);
  }
  getGridVisiblity() {
    return this._visiblePopup.asObservable();
  }
  setPFDialogVisibility(val) {
    this._visiblePFPopup.next(val);
  }
  getPFDialogVisiblity() {
    return this._visiblePFPopup.asObservable();
  }
  setESIDialogVisibility(val) {
    this._visibleESIPopup.next(val);
  }
  getESIDialogVisiblity() {
    return this._visibleESIPopup.asObservable();
  }
  setLWFDialogVisibility(val) {
    this._visibleLWFPopup.next(val);
  }
  getLWFDialogVisiblity() {
    return this._visibleLWFPopup.asObservable();
  }
  setPTDialogVisibility(val) {
    this._visiblePTPopup.next(val);
  }
  getPTDialogVisiblity() {
    return this._visiblePTPopup.asObservable();
  }
  setDownloadDialogVisibility(val) {
    this._visibleDownloadPopup.next(val);
  }
  getDownloadDialogVisiblity() {
    return this._visibleDownloadPopup.asObservable();
  }

  public fetchChallanList(challanType: string, monthYear: string) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path =PATH.FETCH_CHALLAN + 'challanType=' + challanType + '&monthYear=' + monthYear;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).pipe(
      map((response) => {
        if (response && response.challans) {
          return response;
        }
      })
    );
  }
  public downloadChallan(challanID: number) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path =PATH.DOWNLOAD_CHALLAN + '?challanID=' + challanID;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).pipe(
      map((response) => {
        if (response && response.challan) {
          return response;
        }
      })
    );
  }

  public generateChallan(challanID: number, 
    newChallan: boolean, 
    challanType: string, 
    fileType: string, 
    monthYear: string) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path =PATH.GENERATE_CHALLAN;
    serviceConf.payloadObjects ={
        challanID: challanID,
        newChallan: newChallan,
        challanType: challanType,
        fileType: fileType,
        monthYear: monthYear
    }
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
            this.fetchChallanList(challanType,monthYear);
            this.setPFDialogVisibility(false);
            this.setESIDialogVisibility(false);
            this.setLWFDialogVisibility(false);
            this.setPTDialogVisibility(false);
        }
        else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
      });
  }

  
  getChallanDetails(challanType: string, monthYear: string) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path =PATH.FETCH_CHALLAN_DETAIL + 'challanType=' + challanType + '&monthYear=' + monthYear;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).pipe(
      map((response) => {
        if (response && response.challan) {
          return response;
        }
      })
    );
  }

  prepareColumnForGrid() {
    const columnDefs: any[] = [
      {
        headerName: 'Challan Name',
        field: 'challanName',
        filter: true,
        suppressSizeToFit: true,
        editable: false,
        sortable: true,
      },
      {
        headerName: 'Transaction Date',
        field: 'transactionDate',
        filter: true,
        suppressSizeToFit: true,
        editable: false,
        sortable: true,
      },
      {
        headerName: 'Total Employee',
        field: 'totalEmployee',
        filter: true,
        editable: false,
        sortable: true,
      },
      {
        headerName: 'View',
        field: 'challanID',
        filter: true,
        suppressSizeToFit: true,
        editable: false,
        sortable: true,
        icons: true,
        iconName: 'view'
      },
      {
        headerName: 'Download',
        field: 'challanID',
        filter: true,
        suppressSizeToFit: true,
        editable: true,
        sortable: false,
        icons: true,
        iconName: 'download'
      }
    ];
    return columnDefs;
  }
}
