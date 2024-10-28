import { Injectable } from '@angular/core';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
 import { ServiceConfig } from '../store/model/serviceConfig.model';
import { OtherPunch } from '../store/model/other-punch.model';
import { RemoteService } from '../common/remote.service';
import { Store } from '@ngrx/store';
import { NotificationService } from '../common/notification.service';
import { BehaviorSubject } from 'rxjs';
import { UI_CONSTANT } from '../common/constants/ui-constants';

@Injectable({
  providedIn: 'root'
})
export class OtherPunchService {
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _isEditable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<any>,
    private notificationService:NotificationService,
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
    saveRequesredByEss(requestByEssInfo) {
      console.log(requestByEssInfo);
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.SAVE_REQUESTBYESS;
      serviceConf.requestHeader = {};
      const payload: OtherPunch = {
        otherPunchRequestID:0,
        employeeID:0,
        punchTime:requestByEssInfo.punchTime,
        latitude:requestByEssInfo.latitude,
        longitude:requestByEssInfo.longitude,
        locationAddress:requestByEssInfo.locationAddress,
        deviceID:requestByEssInfo.deviceID,
        punchSourceID:"3",
        image1:requestByEssInfo.image1,
        image2:requestByEssInfo.image2,
        image1URL:requestByEssInfo.image1URL,
        image2URL:requestByEssInfo.image2URL,
        requestRemark:requestByEssInfo.requestRemark,
       
      };
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        console.log(response);
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
}
