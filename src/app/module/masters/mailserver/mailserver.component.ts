import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectMailServerState, selectsmsServerState } from '../../../store/app.state';
import { AppUtil } from 'src/app/common/app-util';
import { mailserver } from 'src/app/store/model/mailserver.model';
import { MailServerService } from '../../../services/mail-server.service'
import { SmsServerService } from '../../../services/sms-server.service';
import { smsServer } from 'src/app/store/model/smsServer.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-mailserver',
  templateUrl: './mailserver.component.html',
  styleUrls: ['./mailserver.component.scss']
})
export class MailserverComponent implements OnInit {
  public mailInfo: mailserver = {} as mailserver;
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public smsServerInfo: smsServer = {} as smsServer;
  public isMailTabSelected = true;
  public isSmsTabSelected = false;
  constructor(
    private router: Router,
    private _store: Store<any>,
    private mailServerService: MailServerService,
    private SmsServerService: SmsServerService,
    private authenticationService:AuthService
  ) { 
    this.mailServerService.fetchMailData();
  this.SmsServerService.fetchsmsServerData();
  }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectMailServerState).subscribe(res => {
      if (res && res.mailserverList) {
        this.mailInfo = AppUtil.deepCopy(res.mailserverList);
      }
    });
    this._store.select(selectsmsServerState).subscribe(res => {
      if (res && res.smsServerList) {
        this.smsServerInfo = AppUtil.deepCopy(res.smsServerList);
      }
    });
  }

  ngAfterViewInit() {
    console.log(this.router.url); //  /routename
    const routename = this.router.url;
    if(routename === '/master/smsServer'){
      this.isMailTabSelected = false;
      this.isSmsTabSelected = true;
    } else{
      this.isMailTabSelected = true;
      this.isSmsTabSelected = false;
    }
  }
  saveMailserverData() {
    this.mailServerService.updateStateOfCell(this.mailInfo);
  }
  savesmsServerData() {
    console.log(this.smsServerInfo);
    this.SmsServerService.updateStateOfCell(this.smsServerInfo);
  }
}
