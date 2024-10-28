import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportSetupComponent } from './report-setup/report-setup.component';
import { ReportConfigurationComponent } from './report-configuration/report-configuration.component';

const routes: Routes = [
    { path :'report-setup/:reportModuleID',component:ReportSetupComponent  },
    { path :'report-detail/:reportId/:reportTypeId/:reportModuleID', component:ReportConfigurationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReportRoutingModule {

}
