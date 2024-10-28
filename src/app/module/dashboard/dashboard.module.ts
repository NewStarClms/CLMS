import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EmployeeDashboardSettingComponent } from './employee-dashboard-setting/employee-dashboard-setting.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EmployeeDashboardSettingService } from 'src/app/services/employee-dashboard-setting.service';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { EmployeeLeaveComponent } from './employee-leave/employee-leave.component';
import { EmployeeHolidayComponent } from './employee-holiday/employee-holiday.component';
import { EmployeeVisitorStatusComponent } from './employee-visitor-status/employee-visitor-status.component';
import { NgTippyModule } from 'angular-tippy';
import { DropdownModule } from 'primeng/dropdown';
import { MastersModule } from '../masters/masters.module';
import { EmployeeAttendanceStatsComponent } from './employee-attendance-stats/employee-attendance-stats.component';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from 'src/app/services/authentication.service';
import { MachineJobStatusComponent } from './machine-job-status/machine-job-status.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { EmployeeBirthdayStatusComponent } from './employee-birthday-status/employee-birthday-status.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
    timeGridPlugin,
    interactionPlugin
]);

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    DashboardRoutingModule,
    FullCalendarModule,
    FormsModule,
    ButtonModule,
    BsDatepickerModule,
    DragDropModule,
    MastersModule,
    NgTippyModule,
    DialogModule,
    ProgressBarModule,
  ],
  declarations: [
    DashboardComponent,
    ResetPasswordComponent,
    EmployeeDashboardSettingComponent,
    EmployeeAttendanceComponent,
    EmployeeLeaveComponent,
    EmployeeHolidayComponent,
    EmployeeVisitorStatusComponent,
    EmployeeAttendanceStatsComponent,
    MachineJobStatusComponent,
    EmployeeBirthdayStatusComponent
    ],
    exports:[
      ResetPasswordComponent,
      EmployeeDashboardSettingComponent,
      MachineJobStatusComponent
    ]
})
export class DashboardModule {
  constructor(
    private employeeDashboardSettingService: EmployeeDashboardSettingService,
    private authenticationService: AuthService){
    this.authenticationService.currentUser.subscribe(x => {
      if(x && x.accessToken){
        const exdate:Date = new Date(x.expiresAt);
        const curDate:Date = new Date();
        console.log('date',exdate>curDate)
        if(exdate>curDate){
    this.employeeDashboardSettingService.getEmployeeDashboardSetting();
        }
      }
    });
  }
 }
export { ResetPasswordComponent } from './reset-password/reset-password.component';