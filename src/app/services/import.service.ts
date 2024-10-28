import { Injectable } from '@angular/core';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { SaveReportSetupAction } from '../store/actions/report.action';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { Store } from '@ngrx/store';
import { RemoteService } from '../common/remote.service';
import { NotificationService } from '../common/notification.service';
import { SecureURLService } from './secure-url.service';


@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store,
    private notificationService:NotificationService,
    private secureURLService: SecureURLService
  ) { }

  fetchImportMasterData() {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_IMPORT_MASTER;
    serviceConf.requestHeader = {};

    return this.remoteService.httpServiceRequest(serviceConf);
  }

  getTemplate(importID,importType,importName,ExtraValue1,ExtraValue2){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_IMPORT_TEMPLATE+importID+"/"+importType+"/?ImportName="+importName+"&ExtraValue1="+ExtraValue1+"&ExtraValue2="+ExtraValue2;
    serviceConf.requestHeader = {};
    this.remoteService.downloadFile(serviceConf);
  }

  uploadFileMethod(fileDEtailObj,file){
      const fileToUpload =<File>file;
      var form = new FormData();
      form.append("File", fileToUpload);
      // form.append("File", fileInput.files[0], "/C:/Etp/Company.xlsx");
      form.append("ImportId", fileDEtailObj.importId);
      form.append("ImportType", fileDEtailObj.action);
      form.append("ImportName", fileDEtailObj.importName);
      form.append("ExtraValue1", fileDEtailObj.extraValue1);
      form.append("ExtraValue2", fileDEtailObj.extraValue2);
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.FILE;
      serviceConf.path = PATH.IMPORT_UOLOAD_FILE;
      serviceConf.requestHeader = {
      "mimeType": "multipart/form-data",
      };
      const payload = form;
      serviceConf.payloadObjects = payload;
      return this.remoteService.httpServiceRequest(serviceConf)?.pipe().subscribe(res =>{
        if(res && res.messageType === 0){
          this.notificationService.showSuccess('File Uploaded Successfully, Please verify',null);
          window.open(this.secureURLService.appendSecurityToken(res.message),'_self');
        }else{
          this.notificationService.showError(res.message,null);
        }
        console.log('upload',res);
        return res;
      });
  }
}
