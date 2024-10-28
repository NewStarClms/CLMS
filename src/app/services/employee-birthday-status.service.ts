import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeBirthdayStatusService {

  constructor(private remoteService: RemoteService<any>) { }

  public fetchEmployeeBirthdayStatus(FromDate,ToDate){
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.GET;
    serviceConf.path = PATH.FETCH_EMPLOYEE_Birthday_Status+'FromDate='+FromDate+'&ToDate='+ToDate;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response =>{
      if(response){
      
        return response;
      }
    }));
  }

  
  prepareColumnForBirthdayStatus() {
    const columnDefs:any[] = [
      {
        headerName: 'Name',
        field: 'fullName',
        filter: false,
        suppressSizeToFit:true,
       editable: false,
        sortable: false,
        width: 180,

      },
      {
      headerName: 'Department',
      field: 'department',
      filter: false,
      suppressSizeToFit:true,
      editable: false,
      sortable: false,
      width: 130
     },
    {
     headerName: 'Branch',
     field: 'branch',
     filter: false,
     editable: false,
     sortable: false,
     width:170
  },
  {
   headerName: 'DOB',
   field: 'dateOfBirth',
   filter: false,
   editable: false,
   sortable: false,
   width:170
}
]
  return columnDefs;
}

}
