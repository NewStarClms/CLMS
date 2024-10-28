import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../../store/model/login.model';
import { AuthService } from '../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { GuestVisitorService } from '../../services/guest-visitor.service';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginDetails: LoginModel = new LoginModel();
  loading = false;
  submitted = false;
  returnUrl: string;
  display = false;
  loginOff = false;
  configData: any;
  images: any[] = [];

  constructor(
    private authenticationService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private appConfigService: AppConfigService,
    private guestService: GuestVisitorService
  ) {
    // this.loginDetails = { userName: 'STR001', password: 'star', clientCode: null };
  }

  /* 1- subdomain eg- demo.starlink.com , 
domain -demo 
2- subdirectory eg- starlink.com/demo 
domain- demo  
3- static , from configuration  
    /*"https://154.61.75.86/api",
*/

  ngOnInit(): void {
    this.images.push({ source: './../../../assets/img/Payroll.png' });
    this.images.push({ source: './../../../assets/img/TImeOffice.png' });
    this.images.push({ source: './../../../assets/img/LeaveManagement.png' });
    this.images.push({ source: './../../../assets/img/WebDataCapture.png' });
    this.images.push({ source: './../../../assets/img/VisitorManagement.png' });
    this.images.push({ source: './../../../assets/img/canteen.png' });
    this.configData = this.appConfigService.getConfig();
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnurl'] || '/';
    this.images;
  }
  openForm() {
    this.display = true;
  }
  onSubmit(guest: boolean = false) {
    //console.log('login data:->', this.loginDetails);
    this.loginDetails.clientCode = this.getDomain(this.configData);
    this.submitted = true;
    this.loading = true;
    this.authenticationService
      .login(this.loginDetails)
      .pipe(first())
      .subscribe(
        (data) => {
          if (guest) {
            this.guestService.setParamsData({
              header: false,
              footer: false,
              sidebar: false,
            });
            this.router.navigate(['/self-visitor/request']).then(() => {
              window.location.reload();
            });
          } else {
            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
          }
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  goToGuestEntry() {
    if (this.configData) {
      const domain = this.getDomain(this.configData);
      this.loginDetails = {
        userName: this.configData.guestLogin.userID,
        password: this.configData.guestLogin.password,
        clientCode: domain,
      };
      this.onSubmit(true);
    }
  }

  getDomain(data: any) {
    if (data.domainInfo && data.domainInfo.domainType === 1) {
      const url = window.location.hostname;
      console.log('url', url);
      const hostname = url.split('.')[0];
      return hostname.toUpperCase();
    } else if (data.domainInfo && data.domainInfo.domainType === 2) {
      const url = window.location.pathname;
      const hostname = url.split('/')[0];
      return hostname.toUpperCase();
    } else {
      return data.domainInfo.clientCode
        ? data.domainInfo.clientCode.toUpperCase()
        : 'STARLINK';
    }
  }
  navigateForgotPwd() {
    this.authenticationService.setForgotPasswordVisibility(true);
    this.router.navigate(['/forgot-pwd']);
    return false;
  }
}
