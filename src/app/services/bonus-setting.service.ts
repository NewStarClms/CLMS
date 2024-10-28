import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { BonusSetting } from '../store/model/payroll-statutory.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';

@Injectable({
  providedIn: 'root'
})
export class BonusSettingService {
 
  public _bonusSettingData:BehaviorSubject<BonusSetting>=new BehaviorSubject<BonusSetting>(null);
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  setVisibility(val){
   this._visiblePopup.next(val);
   }
 
   getVisiblity(){
   return this._visiblePopup.asObservable();
   }
  
   constructor(
     private remoteService: RemoteService<any>,
     private notificationService:NotificationService,
   ) { 
    
   }
   public fetchBonusSettingData():Observable<any>{
     const serviceConf = new ServiceConfig();
     serviceConf.method = HttpMethod.GET;
     serviceConf.path = PATH.BONUS_SETTING;
     serviceConf.requestHeader = {};
     this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
       if (response && response) {
         this._bonusSettingData.next(response)
         return response;
       }
     });
     return this._bonusSettingData.asObservable();
   }
   savebonusSetting(bonussettingInfo){
     const serviceConf = new ServiceConfig();
     serviceConf.method = HttpMethod.POST;
     serviceConf.path = PATH.ADD_BONUS_SETTING;
     serviceConf.requestHeader = {};
     const payload: BonusSetting = bonussettingInfo;
     serviceConf.payloadObjects = payload;
     this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
       if (response.messageType === 0) {
         this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
         this.fetchBonusSettingData();
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
    serviceConf.path = PATH.UPDATE_BONUS_SETTING;
    serviceConf.requestHeader = {};
    const payload: BonusSetting = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        this.fetchBonusSettingData();
        this.setVisibility(false);
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.setVisibility(true);
      }
      return response;
    });
  }
   public prepareColumnForGrid() {
     const columnDefs:any[] = [
       {
         headerName: 'Bonus Setup Name',
         field: 'bonusSettingName',
         filter: true,
         suppressSizeToFit:true,
         editable: true,
         sortable: true,
         width: 180,
 
     },
     {
       headerName: 'Bonus On Which',
       field: 'bonusOnWhich',
       filter: true,
       suppressSizeToFit:true,
       editable: true,
       sortable: true,
       width: 130,
   },
   {
   headerName: 'Bonus Percentage',
   field: 'bonusPercentage',
   filter: true,
   editable: true,
   sortable: true,
   width:170,
 
   },
   {
   headerName: 'Bonus Amount Limit',
   field: 'bonusAmountLimit',
   filter: true,
   suppressSizeToFit:true,
   editable: true,
   sortable: true,
   width:150,
 
   },
   {
     headerName: "",
     width: 100,
     colId: "action",
     editAllow:true,
     deleteAllow:true
   }
     ]
     return columnDefs;
   }
   deleteCellFromRemote(params){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.DELETE;
    serviceConf.path = PATH.DELETE_BONUS_SETTING+'/'+params.data.bonusSettingID;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.fetchBonusSettingData();
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      }
      else {
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

   }
}
