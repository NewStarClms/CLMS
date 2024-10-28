import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveMailServerAction } from '../store/actions/mailserver.action';
import {  mailserver } from '../store/model/mailserver.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';



@Injectable({
  providedIn: 'root'
})
export class MailServerService {
 
  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<mailserver>,
    private notificationService: NotificationService,
    private appCoreService:AppCoreCommonService
  ) {
    
  }
    public fetchMailData() {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_MAILSERVER;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response) {
          this._store.dispatch(new saveMailServerAction(response.server));
        }
        return true;
      });
      return true;
    }

    updateStateOfCell(params) {
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.FETCH_MAILSERVER;
      serviceConf.requestHeader = {};
      const payload: mailserver = params;
      serviceConf.payloadObjects = payload;
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
          this.fetchMailData();
        }else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
    }

  }