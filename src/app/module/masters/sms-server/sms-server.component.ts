import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { smsServer } from '../../../store/model/smsServer.model';
import { selectsmsServerState } from '../../../store/app.state';
import { SmsServerService } from '../../../services/sms-server.service';
import {ConfirmationService} from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-sms-server',
  templateUrl: './sms-server.component.html',
  styleUrls: ['./sms-server.component.scss']
})
export class SmsServerComponent implements OnInit {

    public smsServerInfo: smsServer = {} as smsServer;
    constructor(
    private _store: Store<any>,
    private SmsServerService: SmsServerService,
    private confirmationService: ConfirmationService,
    private authenticationService:AuthService
  ){
  }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
  }
  
}
