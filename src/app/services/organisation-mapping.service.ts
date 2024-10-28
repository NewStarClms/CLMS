import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { organizationMapping } from '../store/model/master-data.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { UI_CONSTANT } from '../common/constants/ui-constants';

@Injectable({
  providedIn: 'root'
})
export class OrganisationMappingService {

  
  constructor(
    private remoteService: RemoteService<any>,
    private notificationService: NotificationService
  ) { }

  public fetchMappedOUData(policyId,path) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path= PATH[path]+policyId;
    // serviceConf.path = path.replace('{policyID}', policyId);
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }

  SaveOrgnaizationMapping(params , updatePath) {
     
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.PUT;
    serviceConf.path = PATH[updatePath];
    serviceConf.requestHeader = {};
    const payload: organizationMapping = params;
    serviceConf.payloadObjects =  {
      policyID: params.policyID,
      policyTypeID: params.policyTypeID,
      workFlowID: params.workFlowID,
      organizationKeyID: params.organizationKeyID,
      locationKeyID: params.locationKeyID,
      organization: params.organization,
      location: params.location 
    };;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response => {
      if (response.messageType === 0) {
        this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS)
      }else{
        this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
      }
      return response;
    });
  }
  fetchPolicyMappingDetail(id):Observable<any>{
    const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.GET;
      serviceConf.path = PATH.FETCH_LEAVE_POLICY+"/organizatioMapping/"+id;
      serviceConf.requestHeader = {};
      return this.remoteService.httpServiceRequest(serviceConf)?.pipe();
  }
}
function valueToString(path: any) {
  throw new Error('Function not implemented.');
}

