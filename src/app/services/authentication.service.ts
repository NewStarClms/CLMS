import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User, LoginModel } from '../store/model/login.model';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { RemoteService } from '../common/remote.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUserSubject: BehaviorSubject<User>;
  private _validateUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private _generateOTPSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public _forgotPasswordVisibilityFlag: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public currentUser: Observable<User>;
  public _displayGlobalFilter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private refreshTokenTimeout;


  public get currentUserVal(): User {
    return this._currentUserSubject.value;
  }

  get currentUserToken() {
    // console.log('Auth--',this.currentUserVal);
    if (!this.currentUserVal) {
      return false;
    }
    const exdate: Date = new Date(this.currentUserVal.expiresAt);
    const curDate: Date = new Date();
    // console.log('date',exdate>curDate)
    if (exdate > curDate) {
      return true;
    } else {
      return false;
    }
  }

  isExpiredToken(): boolean {
    if (!this.currentUserVal) {
      return false;
    }
    const exdate: Date = new Date(this.currentUserVal.expiresAt);
    const curDate: Date = new Date();
    //console.log('date',exdate>curDate)
    if (exdate > curDate) {
      return false;
    } else {
      return true;
    }
  }

  setGlobalFilterVisibility(value: boolean) {
    this._displayGlobalFilter.next(value);
  }

  getGlobalFilterVisibility() {
    return this._displayGlobalFilter.asObservable();
  }

  constructor(
    private remoteService: RemoteService<any>,
    private router: Router
  ) {
    this._currentUserSubject = new BehaviorSubject<User>(
      this.getUserFromLocalStorage()
    );
    this.currentUser = this._currentUserSubject.asObservable();
  }

  login(loginDetail: LoginModel) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.AUTH_TOKEN_API;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = loginDetail;
    serviceConf.storeAction = 'Login';
    return this.remoteService.httpServiceRequest(serviceConf).pipe(
      map((user) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem(UI_CONSTANT.ConstValue.CurrentUser, JSON.stringify(user));
        this._currentUserSubject.next(user);
        this.startRefreshTokenTimer();
        // console.log(user);
        return user;
      })
    );
  }

  private startRefreshTokenTimer() {
    var expiringInSeconds=this.currentUserVal.expireIn as number;
    // set a timeout to refresh the token a minute before it expires
    var timeout =  (expiringInSeconds *1000) - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(()=>this.refreshAccessToken(), timeout);
}

private stopRefreshTokenTimer() {
  clearTimeout(this.refreshTokenTimeout);
}

refreshAccessToken() {
  const serviceConf = new ServiceConfig();
  serviceConf.method = HttpMethod.POST;
  serviceConf.path = PATH.REFRESH_AUTH_TOKEN_API;
  serviceConf.requestHeader = {};
  serviceConf.payloadObjects = {"accessToken": this.currentUserVal?.accessToken,"refreshToken": this.currentUserVal?.refreshKey};

  return this.remoteService.httpServiceRequest(serviceConf).subscribe(user => {
              
              localStorage.removeItem(UI_CONSTANT.ConstValue.CurrentUser);
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem(UI_CONSTANT.ConstValue.CurrentUser, JSON.stringify(user));
              //this._currentUserSubject.next(user);
              this.startRefreshTokenTimer();
              // console.log(user);
              return user;
          });
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem(UI_CONSTANT.ConstValue.CurrentUser);
    this.stopRefreshTokenTimer();
    this._currentUserSubject.next(null);
  }

  private getUserFromLocalStorage(): User {
    try {
      return JSON.parse(
        localStorage.getItem(UI_CONSTANT.ConstValue.CurrentUser)!
      );
    } catch (error) {
      return null!;
    }
  }

  validateUser(userName: string, clientCode: string) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path =
      PATH.FORGOT_PASSWORD_VALIDATE_USER +
      userName +
      '?clientCode=' +
      clientCode;
    serviceConf.requestHeader = {};
    return this.remoteService.httpServiceRequest(serviceConf).pipe(
      map((response) => {
        this._validateUserSubject.next(response);
        return response;
      })
    );
  }

  generateOTP(
    userName: string,
    clientCode: string,
    newPassword: string,
    otp: string
  ) {
    const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.POST;
    serviceConf.path = PATH.FORGOT_PASSWORD_GENERATE_OTP;
    serviceConf.requestHeader = {};
    serviceConf.payloadObjects = {
      userName: userName,
      newPassword: newPassword,
      otp: otp,
      clientCode: clientCode,
    };
    return this.remoteService.httpServiceRequest(serviceConf).pipe(
      map((response) => {
        this._generateOTPSubject.next(response);
        return response;
      })
    );
  }

  setVisibility(val) {
    this._visiblePopup.next(val);
  }

  getVisiblity() {
    return this._visiblePopup.asObservable();
  }

  setForgotPasswordVisibility(isVisible) {
    this._forgotPasswordVisibilityFlag.next(isVisible);
  }
  getForgotPasswordVisibility() {
    return this._forgotPasswordVisibilityFlag.asObservable();
  }
}
