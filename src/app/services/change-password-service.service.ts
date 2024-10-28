import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { ChangePassword } from '../store/model/login.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordServiceService {

  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor( private remoteService: RemoteService<any>,
    private notificationService:NotificationService) { }

  setVisibility(val){
  this._visiblePopup.next(val);
  }

  getVisiblity(){
  return this._visiblePopup.asObservable();
  }
  saveChangePassword(newpassword){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.CHANGE_PASSWORD;
    serviceConf.requestHeader = {};
    const payload: ChangePassword = {
     newPassword:newpassword.newPassword
    };
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
      
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        
      }
      return response;
    });

  }
}
