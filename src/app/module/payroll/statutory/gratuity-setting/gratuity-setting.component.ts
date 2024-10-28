import { Component, OnInit } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
import { PayrollStatutoryService } from 'src/app/services/payroll-statutory.service';
import { GratuitySetting } from 'src/app/store/model/payroll-statutory.model';

@Component({
  selector: 'app-gratuity-setting',
  templateUrl: './gratuity-setting.component.html',
  styleUrls: ['./gratuity-setting.component.scss']
})
export class GratuitySettingComponent implements OnInit {
  public gartuitySettingInfo = {} as GratuitySetting;
 

  constructor(private statutoryService:PayrollStatutoryService,
   private authenticationService:AuthService) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.statutoryService.fetchGratuitySettingData().subscribe(res=>{
      if(res){
        this.gartuitySettingInfo=res;
      }
    });
  }
  savegratuitySetting(){
  console.log(this.gartuitySettingInfo);
  this.statutoryService.saveGratuitySetting(this.gartuitySettingInfo);
}
keyPressNumbers(event){
  AppUtil.validateDecimalNumbers(event);
}

}
