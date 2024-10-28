import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { smsServer } from '../store/model/smsServer.model'
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { SavesmsServerAction } from '../store/actions/smsServer.action';


@Injectable({
  providedIn: 'root'
})
export class SmsServerService {
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<smsServer>,
    private notificationService: NotificationService,
    private appCoreService:AppCoreCommonService
  ) {
  }
    public fetchsmsServerData() {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_SMSSERVER;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response) {
          this._store.dispatch(new SavesmsServerAction(response.server));
        }
        return true;
      });
      return true;
    }
  updateStateOfCell(params) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_SMSSERVER;
    serviceConf.requestHeader = {};
    const payload: smsServer = params;
    serviceConf.payloadObjects = payload;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
        this.fetchsmsServerData();
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        this.fetchsmsServerData();
      }
      return response;
    });
  }
}
 

