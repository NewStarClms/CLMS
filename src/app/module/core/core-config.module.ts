import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersModule } from '../masters/masters.module';
import { CoreConfigRoutingModule } from './core-config-routing.module';
import {CheckboxModule} from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { AutoCodeService } from '../../services/auto-code.service';
import { GlobalsettingService } from '../../services/globalsetting.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CoreConfigRoutingModule,
    MastersModule,
    CheckboxModule,
    ButtonModule,
  ],
})
export class CoreConfigModule { 
  constructor(
    private autocodeService : AutoCodeService,
    private globalsetting: GlobalsettingService
  ){
    console.log('core!!');
    this.autocodeService.fetchAutoCodeData();
  this.autocodeService.fetchAutoCodeOrgData();
     this.globalsetting.fetchGlobalSettingData();
  }
}
