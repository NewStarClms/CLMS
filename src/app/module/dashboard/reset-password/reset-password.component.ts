import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChangePasswordServiceService } from 'src/app/services/change-password-service.service';
import { ChangePassword } from 'src/app/store/model/login.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public changePasswordInfo = {} as ChangePassword;
  @Output() changePassword = new EventEmitter<any>();
  constructor(private chnagePasswordService:ChangePasswordServiceService) { }
  ngOnInit(): void {
  }
  SavechangePassword(){
      console.log(this.changePasswordInfo);
      this.chnagePasswordService.saveChangePassword(this.changePasswordInfo);
      this.changePassword.emit();
  }
  CancelChangePassword(){
    this.changePasswordInfo = {} as ChangePassword;
    this.changePassword.emit();
  }
}
