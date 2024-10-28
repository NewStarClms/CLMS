import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpMethod } from './constants/http-method.constants';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { UI_CONSTANT } from './constants/ui-constants';
import { AppConfigService } from '../services/app-config.service';

@Injectable({
  providedIn: 'root'
})

/*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

export class RemoteService<T> {

  constructor(
    private http: HttpClient,
    private store: Store<T>,
    private appConfigService: AppConfigService
  ) { }
private baseHeader ;
  private bHeader: {
    [name: string]: string | string[];
  } = {'Content-Type': 'application/json',};
  private fileHeader: {
    [name: string]: string | string[];
  } = {
};
  
  public httpServiceRequest(serviceConfig: ServiceConfig): Observable<T>{
    const methodType: string = serviceConfig.method;
    const fileSize = 9999999;
    const baseUrl = this.appConfigService.getConfig()?.appURL;
    if(!baseUrl) return null;
   if(methodType=='file'){
     this.baseHeader = this.fileHeader;
   }else{
    this.baseHeader = this.bHeader
   }
      if(this.baseHeader){
        serviceConfig.requestHeader = Object.assign(serviceConfig.requestHeader , this.baseHeader)
      }
      const token:string = JSON.parse(localStorage.getItem(UI_CONSTANT.ConstValue.CurrentUser))?.accessToken;
      if(token){
        serviceConfig.requestHeader = Object.assign(serviceConfig.requestHeader , {'Authorization':'bearer '+ token})
      }
      const headers = new HttpHeaders(serviceConfig.requestHeader);

      switch(methodType.toLowerCase()){
        case HttpMethod.GET:
          return this.httpGet(baseUrl+serviceConfig.path, headers).pipe();
        break;

        case HttpMethod.POST:
          return this.httpPost(baseUrl+serviceConfig.path, serviceConfig.payloadObjects, headers).pipe(res =>{
            return res;
          });
        break;

        case HttpMethod.PUT:
          return this.httpPut(baseUrl+serviceConfig.path, serviceConfig.payloadObjects, headers).pipe(res =>{
            return res;
          });;
        break;
        case HttpMethod.DELETE:
          return this.httpDelete(baseUrl+serviceConfig.path, headers).pipe(res =>{
            return res;
          });
        break;
        case HttpMethod.FILE:
          return this.httpFile(baseUrl+serviceConfig.path, serviceConfig.payloadObjects, headers).pipe(res =>{
            return res;
          });
        default :
          return this.httpDelete(baseUrl+serviceConfig.path, headers).pipe(res =>{
            return res;
          }); ;
          break;
    }
  }

  public httpHtmlGet(serviceUrl: string, headers:HttpHeaders){
    return this.http.get<T>(serviceUrl, {'headers': headers});
  }

  private httpGet(serviceUrl: string, headers:HttpHeaders){
    return this.http.get<T>(serviceUrl, {'headers': headers});
  }

  private httpPost(serviceUrl: string, data:any, headers:HttpHeaders){
    return this.http.post<T>(serviceUrl,data, {'headers': headers});
  }

  private httpPut(serviceUrl: string, data:any, headers:HttpHeaders){
    return this.http.put<T>(serviceUrl,data, {'headers': headers});
  }

  private httpDelete(serviceUrl: string, headers:HttpHeaders){
    return this.http.delete<T>(serviceUrl, {'headers': headers});
  }
  private httpFile(serviceUrl: string, data:any, headers:HttpHeaders){
    return this.http.post<T>(serviceUrl,data, {'headers': headers});
  }
  public updateStoreFromRemote(serviceConfig: ServiceConfig, loaderText: string){

  }
  getCleanModulePath(url:string,moduleID:number){
    if(url.includes('{0}')){
      const moduleName= UI_CONSTANT.MODULE_ID.filter(x=>x.value === moduleID)[0].key;
      const pathVar= url.replace('{0}',moduleName);
      return pathVar;
    } else{
      return url;
    }
    
  }

  downloadFile(serviceConf : ServiceConfig){
    const methodType: string = serviceConf.method;
    if(methodType=='file'){
      this.baseHeader = this.fileHeader;
    }else{
     this.baseHeader = this.bHeader
    }
    const baseUrl = this.appConfigService.getConfig()?.appURL;
    if(!baseUrl) return null;
    if(this.baseHeader){
      serviceConf.requestHeader = Object.assign(serviceConf.requestHeader , this.baseHeader)
    }
    const token:string = JSON.parse(localStorage.getItem(UI_CONSTANT.ConstValue.CurrentUser))?.accessToken;
    if(token){
      serviceConf.requestHeader = Object.assign(serviceConf.requestHeader , {'Authorization':'bearer '+ token})
    }
    const httpHeaders = new HttpHeaders(serviceConf.requestHeader);
    if(methodType==HttpMethod.POST || methodType== HttpMethod.FILE) {
      return this.http.post<Blob>(baseUrl+ serviceConf.path,serviceConf.payloadObjects, { headers: httpHeaders,observe:"response", responseType: 'blob' as 'json'})
      .subscribe((res: HttpResponse<Blob>)=>{
        console.log("res header="+JSON.stringify(res.headers));
        if(res.status==200){
          const blob = new Blob([res.body], { type: res.body.type });
          console.log("type="+res.body.type)
          const url= window.URL.createObjectURL(blob);
          console.log("url = "+url);
          var downloadLink = document.createElement("a");
          downloadLink.download = this.getFilenameFromHeader(res.headers.get('content-disposition'));
          downloadLink.href = url;
          downloadLink.click();
          
        }
      });
    }else{
      return this.http.get<Blob>(baseUrl+ serviceConf.path, { headers: httpHeaders,observe:"response", responseType: 'blob' as 'json'})
      .subscribe((res: HttpResponse<Blob>)=>{
        console.log("res header="+JSON.stringify(res.headers));
        if(res.status==200){
          const blob = new Blob([res.body], { type: res.body.type });
          console.log("type="+res.body.type)
          const url= window.URL.createObjectURL(blob);
          console.log("url = "+url);
          var downloadLink = document.createElement("a");
          downloadLink.download = this.getFilenameFromHeader(res.headers.get('content-disposition'));
          downloadLink.href = url;
          downloadLink.click();
          
        }
      });
    }
  }

  private getFilenameFromHeader(contentDisposition: string): string {
    const reg = /filename=(?<filename>[^,;]+);/g;
    const match = reg.exec(contentDisposition);
    let fileName = match.groups.filename;
    if(fileName){
     fileName= fileName.replace('"','');
     fileName= fileName.replace('"','');
    }
    return fileName;
  }
}
