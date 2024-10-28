import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public userName: string = "";
  public otp: string = "";
  public password: string = "";
  public cpassword: string = "";
  clientCode: string ="";
  configData: any;
  userValidated: boolean = false;
  display: boolean=false;
  constructor( private authenticationService: AuthService, 
    private http: HttpClient, 
    private router: Router,
    private notificationService:NotificationService,
    private appConfigService: AppConfigService) {
   }

  ngOnInit(): void {
    this.authenticationService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
    this.configData=this.appConfigService.getConfig();
  }
 

  validateUsername() {
    this.clientCode = this.getDomain(this.configData);
    this.authenticationService.validateUser(this.userName,this.clientCode).subscribe(res=>{
      if(res && res.messageType==0){
        this.userValidated=true;
        this.notificationService.showSuccess(UI_CONSTANT.MESSAGE_TEXT.OTP_SENT_SUCCESSFULLY,
          UI_CONSTANT.SEVERITY.SUCCESS);
       this.authenticationService.setVisibility(false);
      }
      else{
        this.userValidated = false;
        this.notificationService.showError(res.message, UI_CONSTANT.SEVERITY.ERROR);
        this.authenticationService.setVisibility(false);
      }
    });
  }

  UpdatePassword(){
    this.clientCode = this.getDomain(this.configData);
    this.authenticationService.generateOTP(this.userName,this.clientCode,this.password,this.otp).subscribe(res=>{
      if(res && res.messageType==0){
        this.notificationService.showSuccess(UI_CONSTANT.MESSAGE_TEXT.PASSWORD_CHANGED_SUCCESSFULLY,
           UI_CONSTANT.SEVERITY.SUCCESS);
        this.authenticationService.setVisibility(false);
        this.navigationLogin();
      }
      else{
        this.notificationService.showError(res.message, UI_CONSTANT.SEVERITY.ERROR);
        this.authenticationService.setVisibility(false);
       }
    });
    return false;
  }
  navigationLogin(){
    this.authenticationService.setForgotPasswordVisibility(false);
    this.router.navigate(['/login']);
    return false;
  }

  getDomain(data: any) {
    if (data.domainInfo && data.domainInfo.domainType === 1) {
      const url = window.location.hostname;
      const hostname = url.split('/')[1];
      return hostname.toUpperCase();
    } else if (data.domainInfo && data.domainInfo.domainType === 2) {
      const url = window.location.pathname;
      const hostname = url.split('/')[0];
      return hostname.toUpperCase();
    } else {
      return data.domainInfo.clientCode ? data.domainInfo.clientCode.toUpperCase() : 'STARLINK';
    }
  }
}
