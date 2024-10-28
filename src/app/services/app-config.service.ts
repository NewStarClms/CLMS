import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private config: any;

  constructor(private _http: HttpClient) { }

  public loadConfig() {
      localStorage.removeItem("APPURL");
      localStorage.removeItem("CLIENTCODE");
    return this._http.get('./assets/config.json')
      .toPromise()
      .then((config: any) => {
        this.config = config;
        localStorage.setItem('APPURL',this.config.appURL);
        localStorage.setItem('CLIENTCODE',this.config.domainInfo.clientCode);
      })
      .catch((err: any) => {
        console.error(err);
      })
  }

  getConfig() {
    return this.config;
  }
}