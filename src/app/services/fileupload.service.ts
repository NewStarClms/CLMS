import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { saveFileUploadAction } from '../store/actions/fileupload.action';
import { FileUpload } from '../store/model/file.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<FileUpload>,
    private notificationService: NotificationService,
    private appCoreService:AppCoreCommonService
  ) {

  }

  public fetchFileVirtualPath() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_FILE_VIRTUALPATH;
    serviceConf.requestHeader = {};
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response) {
        this._store.dispatch(new saveFileUploadAction(response.fileVirtualPath));
      }
      return true;
    });
    return true;
  }
  saveFileUpload(fileInfo) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FETCH_FILE_VIRTUALPATH;
    serviceConf.requestHeader = {};

    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      console.log(response);
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });

  }
}
