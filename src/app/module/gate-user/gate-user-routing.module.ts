import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditVisitorAdminComponent } from './edit-visitor-admin/edit-visitor-admin.component';
import { SelfVisitorResquestComponent } from './self-visitor-resquest/self-visitor-resquest.component';
import { VisitorAdminComponent } from './visitor-admin/visitor-admin.component';
import { VisitorReportComponent } from './visitor-report/visitor-report.component';
const routes: Routes = [
     { path:'visitor-request', component:VisitorAdminComponent},
     { path : 'edit-visitor-admin/:id/:idd',component:EditVisitorAdminComponent},
     { path : 'visitor-report', component: VisitorReportComponent },
     { path :'request',component:SelfVisitorResquestComponent,
     data:{header: false, sidebar:false,footer:false}
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GateUserRoutingModule { }
