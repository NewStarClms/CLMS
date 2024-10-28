import { Component, OnInit } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { PayrollStatutoryService } from 'src/app/services/payroll-statutory.service';
import { ESISetting } from 'src/app/store/model/payroll-statutory.model';

@Component({
  selector: 'app-esi-setting',
  templateUrl: './esi-setting.component.html',
  styleUrls: ['./esi-setting.component.scss']
})
export class EsiSettingComponent implements OnInit {
  public esiSettingInfo = {} as ESISetting;
  stateOptions=UI_CONSTANT.stateOptions;
  public employeeESIRoundsList=UI_CONSTANT.PFROUNDING;
  public esiOnArrearTypeList = UI_CONSTANT.PFONARREAR;
 // public esionarreartype:boolean;
  public esiOnGrossEarningtxt:boolean;
  public vpfAllowfield:boolean;
  public vpfOnGrossEarningfield:boolean;
  public vpfONList=UI_CONSTANT.VPFON;

  constructor(private statutoryService:PayrollStatutoryService,
   private authenticationService:AuthService) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.statutoryService.fetchESISettingData().subscribe(res=>{
      if(res){
        this.esiSettingInfo=res;
        this.getesiOnGrossEarning(this.esiSettingInfo.esiOnGrossEarning);
        //this.getesiOnArrear(this.esiSettingInfo.esiOnArrear);
      }
    });
  }
saveESISetting(){
  console.log(this.esiSettingInfo);
  this.statutoryService.saveESISetting(this.esiSettingInfo);
}
keyPressNumbers(event){
  AppUtil.validateDecimalNumbers(event);
}
getesiOnGrossEarning(event){
  if(event===true){
    this.esiOnGrossEarningtxt=true;
  }
  else{
      this.esiOnGrossEarningtxt=false;
  }
}
// getesiOnArrear(event){
//   if(event===true){
//     this.esionarreartype=true;
//   }
//   else{
//       this.esionarreartype=false;
//   }
// }

}
