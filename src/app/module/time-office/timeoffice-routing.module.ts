import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftMasterComponent } from './shift-master/shift-master.component';
import { AttendancePolicyComponent } from './attendance-policy/attendance-policy.component';
import { AddEditAttendancePolicyMasterComponent } from './add-edit-attendance-policy-master/add-edit-attendance-policy-master.component';
import { LeaveMasterComponent } from './leave-master/leave-master.component';
import { LeavePolicyComponent } from './leave-policy/leave-policy.component';
import { HolidayMasterComponent } from './holiday-master/holiday-master.component';
import { HolidaycalenderpolicyComponent } from './holidaycalenderpolicy/holidaycalenderpolicy.component';
import { HolidayCalenderPolicyMappingComponent } from './holiday-calender-policy-mapping/holiday-calender-policy-mapping.component';
import { AttendanceDetailComponent } from './User/attendance-detail/attendance-detail.component';
import { FlowComponent } from './flow/flow.component';
import { LeaveacurralComponent } from './User/leave-accural/leaveacurral/leaveacurral.component';
import { AttendanceProcessComponent } from './attendance-process/attendance-process/attendance-process.component';
import { EssRequestComponent } from './ess-request/ess-request.component';


const routes: Routes = [
  {path : 'shift-master',component:ShiftMasterComponent},
  {path : 'attendance-policy', component:AttendancePolicyComponent},
  {path : 'add-edit-attendance-policy-master/:id',component:AddEditAttendancePolicyMasterComponent},
  {path : 'leave-master',component:LeaveMasterComponent},
  {path : 'holiday-master', component:HolidayMasterComponent},
  {path : 'leave-policy',component:LeavePolicyComponent},
  {path : 'holiday-calender',component:HolidaycalenderpolicyComponent},
  {path : 'holiday-calender/holiday-calender-policy-mapping/:id',component:HolidayCalenderPolicyMappingComponent},
  {path : 'attendance-detail/:id',component:AttendanceDetailComponent},
  {path : 'workflow-detail',component:FlowComponent},
  {path : 'leave-accrual/:id',component:LeaveacurralComponent},
  {path : 'attendance-process', component:AttendanceProcessComponent},
  {path : 'ess-request/:id', component:EssRequestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeOfficeRoutingModule { }
