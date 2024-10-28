import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorAdminComponent } from './visitor-admin/visitor-admin.component';
import { RequestDashboardComponent } from './request-flow/request-dashboard/request-dashboard.component';
import { RequestApproveFlowComponent } from './request-flow/request-approve-flow/request-approve-flow.component';
import { TeamDetailComponent } from './team/team-detail/team-detail.component';
import { TeamAttendanceComponent } from './team/team-attendance/team-attendance.component';
import { LeaveDetailComponent } from './team/leave-detail/leave-detail.component';
import { SalarySlipComponent } from './salary-slip/salary-slip.component';
const routes: Routes = [
     { path:'visitor-request', component:VisitorAdminComponent},
     { path:'request-flow/:id', component:RequestDashboardComponent},
     { path:'request-approve/:id', component:RequestApproveFlowComponent},
     { path:'team/detail', component:TeamDetailComponent},
     { path:'team/attendance', component:TeamAttendanceComponent},
     { path:'team/leave', component:LeaveDetailComponent},
     { path:'salary-slip', component:SalarySlipComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfServiceRoutingModule { }
