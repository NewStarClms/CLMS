import { Injectable } from '@angular/core';
import { RemoteService } from '../common/remote.service';
import { NotificationService } from '../common/notification.service';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { SecureURLService } from './secure-url.service';

@Injectable({
  providedIn: 'root'
})
export class SalarySlipService {

  constructor(
    private remoteService: RemoteService<any>,
    private notificationService: NotificationService,
    private secureURLService: SecureURLService
  ) { }

  downlodSalaryReport(date,empId){

    const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.GENERATE_SARY_SLIP+ empId + '/'+ date;
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf).subscribe(response => {
        if (response && response.message && response.messageType===0) {
            window.open(this.secureURLService.appendSecurityToken(response.message),'_blank', 'location=yes,height=900,width=900,scrollbars=yes,status=yes');
        } else{
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
      });
    }
}
