import { Component, OnInit } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { PayrollStatutoryService } from 'src/app/services/payroll-statutory.service';
import { PFSetting } from 'src/app/store/model/payroll-statutory.model';

@Component({
  selector: 'app-pf-setting',
  templateUrl: './pf-setting.component.html',
  styleUrls: ['./pf-setting.component.scss']
})
export class PfSettingComponent implements OnInit {
  public pfSettingInfo = {} as PFSetting;
  stateOptions=UI_CONSTANT.stateOptions;
  public pfRoundingsList=UI_CONSTANT.PFROUNDING;
  public pfOnArrearTypeList = UI_CONSTANT.PFONARREAR;
  public pfonarreartype:boolean;
  public pfongrossearning:boolean;
  public vpfAllowfield:boolean;
  public vpfOnGrossEarningfield:boolean;
  public vpfONList=UI_CONSTANT.VPFON;
  //New Changes
  public proratePensionWageLimitField:boolean;
// End
  constructor(private statutoryService:PayrollStatutoryService,
   private authenticationService:AuthService) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.statutoryService.fetchPFSettingData().subscribe(res=>{
      if(res){
        this.pfSettingInfo=res;
        this.getpfOnGrossEarning(this.pfSettingInfo.pfOnGrossEarning);
        //this.getpfOnArrear(this.pfSettingInfo.pfOnArrear);
        this.getvpfOnGrossEarning(this.pfSettingInfo.vpfOnGrossEarning);
        this.getvpfAllow(this.pfSettingInfo.vpfAllow)
          //New Changes
        this.showHideproratePensionWageLimit(this.pfSettingInfo.proratePensionWageLimit);
          // End
      }
    });
  }
savePFSetting(){
  console.log(this.pfSettingInfo);
  this.statutoryService.savePFSetting(this.pfSettingInfo);
}
keyPressNumbers(event){
  AppUtil.validateDecimalNumbers(event);
}
getpfOnGrossEarning(event){
  if(event===true){
    this.pfongrossearning=true;
  }
  else{
      this.pfongrossearning=false;
  }
}
// getpfOnArrear(event){
//   if(event===true){
//     this.pfonarreartype=true;
//   }
//   else{
//       this.pfonarreartype=false;
//   }
// }
getvpfAllow(event){
  if(event===true){
    this.vpfAllowfield=true;
    this.vpfOnGrossEarningfield=true;
    this.getvpfOnGrossEarning(true)
  }else{
    this.vpfAllowfield=false;
    this.vpfOnGrossEarningfield=false;
  }
}
getvpfOnGrossEarning(event){
  console.log(event)
  if(event == true){
    this.vpfOnGrossEarningfield=false;
  }else{
    this.vpfOnGrossEarningfield=true;
    
  }
}
// New Changes
showHideproratePensionWageLimit(event)
{
  if(event==true)
  {
    this.proratePensionWageLimitField=true;
  }
  else
  {
    this.proratePensionWageLimitField=false;
  }
}
// End

}
