import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import {  Employee, EmployeeMaster } from '../store/model/employee.model';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { AppCoreCommonService } from './app.core-common.services';
import { inSearchModel } from '../store/model/search.model';
import { VisitorAdmin } from '../store/model/visitorAdmin.model';
import { GlobalEmployeeFilter } from '../store/model/globalemployeefilter.model';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { PageInfo } from '../store/model/pageinfo.model';

@Injectable({
  providedIn: 'root'
})
export class AppSearchCommonService {
  private _employeeSerchList:BehaviorSubject<Array<Employee>> = new BehaviorSubject<Array<Employee>>(null);
  private _visitorSerchList:BehaviorSubject<Array<VisitorAdmin>> = new BehaviorSubject<Array<VisitorAdmin>>(null);
  employeeStateList: BehaviorSubject<Array<Employee>>= new BehaviorSubject<Array<Employee>>([]);
  MasterStateList : BehaviorSubject<Array<EmployeeMaster>>= new BehaviorSubject<Array<EmployeeMaster>>([]);

  constructor(
    private remoteService: RemoteService<any>,
    private _store: Store<Employee>,
    private notificationService:NotificationService,
    private router: Router,
    private appCoreCommonService:AppCoreCommonService
  ) { }

    getFilteredEmployee(query:any,searchType:any='EMP', moduleID:number=1):Observable<any>{
      const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SEARCH_GLOBAL_DATA;
    serviceConf.requestHeader = {};

    const searchObj:inSearchModel ={
        seachType:"EMP",
        moduleID:moduleID,
        searchString:query,
        multiSelect:false,
        selectedCodes:''
    }
    if(searchType){
      searchObj.seachType=searchType;
    }
    serviceConf.payloadObjects = searchObj;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
      if(response){
        this._employeeSerchList.next(response);
       // console.log('employeemaster',this._employeeSerchList);
      }
      return response;
    });
    return this._employeeSerchList.asObservable();
    }
    getFilteredVisitor(query:any):Observable<any>{
      const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.SEARCH_GLOBAL_DATA;
    serviceConf.requestHeader = {};

    const searchObj:inSearchModel ={
        seachType:"VMS",
        moduleID:5,
        searchString:query,
        multiSelect:false,
        selectedCodes:''
    }
    serviceConf.payloadObjects = searchObj;
    this.remoteService.httpServiceRequest(serviceConf)?.subscribe(res =>{
      if(res){
        this._visitorSerchList.next(res);
        console.log('visitormaster',this._visitorSerchList);
      }
      return res;
    });
    return this._visitorSerchList.asObservable();
    }
    saveGlobalEmployeeFilter(globalEmployeeFilterInfo){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.POST;
      serviceConf.path = PATH.FETCH_GLOBAL_EMPLOYEE_FILTER+'/Apply';
      serviceConf.requestHeader = {};
      const payload: GlobalEmployeeFilter = globalEmployeeFilterInfo;
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
    deleteCellFromRemote(){
      const serviceConf = new ServiceConfig();
      serviceConf.method = HttpMethod.DELETE;
      serviceConf.path = PATH.FETCH_GLOBAL_EMPLOYEE_FILTER+'/Clear';
      serviceConf.requestHeader = {};
      this.remoteService.httpServiceRequest(serviceConf)?.subscribe(response =>{
        if (response.messageType === 0) {
          this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
        }
        else {
          this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
        }
        return response;
      });
  
     }

     getPagingQueryString(pager : PageInfo){
       const defaultPager: PageInfo= {
        pageNumber:1,
        searchKeyword:"",
        orderBy:"1",
        orderDirection:"asc",
        pageSize:5
      };
      if(pager==null){
         pager=defaultPager;
      }
      return `?searchKeyword=${pager.searchKeyword}&pageNumber=${pager.pageNumber}&pageSize=${pager.pageSize}&orderBy=${pager.orderBy}&orderDirection=${pager.orderDirection}`;
     
     }
}
