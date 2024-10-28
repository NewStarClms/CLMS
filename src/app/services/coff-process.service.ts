import { Injectable } from '@angular/core';
import { CoffProcess } from '../store/model/coffprocess.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { RemoteService } from '../common/remote.service';
import { NotificationService } from '../common/notification.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UI_CONSTANT } from '../common/constants/ui-constants';

@Injectable({
  providedIn: 'root'
})
export class CoffProcessService {
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _coffProcess:BehaviorSubject<CoffProcess> = new BehaviorSubject<CoffProcess>(null);
  constructor(private remoteService: RemoteService<any>,  
    private notificationService: NotificationService,) { }

    setVisibility(val){
      this._visiblePopup.next(val);
       }
                  
      getVisiblity(){
      return this._visiblePopup.asObservable();
      }


      fetchCoffPocessData(param):Observable<any>{
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path = PATH.GET_COFF_PROCESS;
        serviceConf.requestHeader = {};
        const payload: CoffProcess = param;
        serviceConf.payloadObjects = payload;
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
          if (response) {
            console.log('gatepass',response.cofDetails);
            this._coffProcess.next(response.cofDetails)
            return response.cofDetails;
            
          }
        });
        return this._coffProcess.asObservable();
      }

      saveCoffProcessSingle(coffProcessInfo){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path = PATH.POST_COFF_PROCESS;
        serviceConf.requestHeader = {};
        const payload: CoffProcess = coffProcessInfo
        serviceConf.payloadObjects = payload;
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
          if (response.messageType === 0) {
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
            this.setVisibility(false);
          }else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            this.setVisibility(true);
          }
          return response;
        });
      }

      saveCoffProcessMultiple(coffProcessInfo){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path = PATH.POST_Multiple_COFF_PROCESS;
        serviceConf.requestHeader = {};
        const payload: CoffProcess = coffProcessInfo
        serviceConf.payloadObjects = payload;
        this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
          if (response.messageType === 0) {
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
            this.setVisibility(false);
          }else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            this.setVisibility(true);
          }
          return response;
        });
      }

      coffProcessColumnForGrid() {
        const columnDefs:any[] = [
          {
            headerName: '',
            field: 'employeeID',
            filter: false,
            editable: false,
            sortable: false,
            checkbox: false,
            suppressSizeToFit:true,
            hideData: true
            
        },
        {
          headerName: 'Employee Code',
          field: 'employeeCode',
          filter: true,
          suppressSizeToFit:true,
          sortable: true,
          width: 180,
        },
        {
            headerName: 'Attendance Date',
            field: 'attendanceDate',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
            width: 180,
          },
          {
            headerName: 'In Time',
            field: 'inTime',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
            width: 130,
          },
          {
          headerName: 'Out Time',
          field: 'outTime',
          filter: true,
          sortable: true,
          width:170,
          },
          {
          headerName: 'Working Hours',
          field: 'workingHours',
          filter: true,
          suppressSizeToFit:true,
          sortable: true,
          width:150,
          },
          {
            headerName: 'OverTime',
            field: 'overTime',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
            width:150,
            },
          {
            headerName: 'Coff Value',
            field: 'cofValue',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          },
          {
            headerName: 'Balance Value',
            field: 'balanceValue',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          },
          {
            headerName: 'Laps Balance',
            field: 'lapsBalance',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          },
          {
            headerName: 'Expired Balance',
            field: 'expiredBalance',
            filter: true,
            suppressSizeToFit:true,
            sortable: true,
          },
        ]
        return columnDefs;
      }

}
