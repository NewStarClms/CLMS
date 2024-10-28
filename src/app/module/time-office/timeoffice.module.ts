import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersModule } from '../masters/masters.module';
import {CheckboxModule} from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import {MultiSelectModule} from 'primeng/multiselect';
import {WorkForceModule} from  '../work-force/work-force.module';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import {WebcamModule} from 'ngx-webcam';
import { NgxPrintModule } from 'ngx-print';
import { TimeOfficeRoutingModule } from './timeoffice-routing.module';
import { GateUserModule } from '../gate-user/gate-user.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ShiftMasterComponent } from './shift-master/shift-master.component';
import { ShiftMappingComponent } from './shift-mapping/shift-mapping.component';
import { AttendancePolicyComponent } from './attendance-policy/attendance-policy.component';
import { AddEditAttendancePolicyMasterComponent } from './add-edit-attendance-policy-master/add-edit-attendance-policy-master.component';
import { CalendarModule } from 'primeng/calendar';
import { ShiftService } from '../../services/shift.service';
import { LeaveMasterComponent } from './leave-master/leave-master.component';
import { HolidayMasterComponent } from './holiday-master/holiday-master.component';
import { LeaveMasterService } from '../../services/leave-master.service';
import { LeavePolicyComponent } from './leave-policy/leave-policy.component';
import { LeavePolicyService } from 'src/app/services/leave-policy.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PolicyMappingComponent } from './policy-mapping/policy-mapping.component';
import { HolidaycalenderpolicyComponent } from './holidaycalenderpolicy/holidaycalenderpolicy.component';
import { HolidayCalenderPolicyMappingComponent } from './holiday-calender-policy-mapping/holiday-calender-policy-mapping.component';
import { AuthService } from 'src/app/services/authentication.service';
import { AttendanceDetailComponent } from './User/attendance-detail/attendance-detail.component';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { ManualPunchSingleEmployeeComponent } from './User/manual-punch-single-employee/manual-punch-single-employee.component';
import { ManualPunchMultiEmployeeComponent } from './User/manual-punch-multi-employee/manual-punch-multi-employee.component';
import { RosterprocesssingleComponent } from './User/rosterprocesssingle/rosterprocesssingle.component';
import { ShiftchnagesingleComponent } from './User/shiftchnagesingle/shiftchnagesingle.component';
import { BackdataProcessComponent } from './User/backdata-process/backdata-process.component';
import { RosterLockUnlockComponent } from './User/roster-lock-unlock/roster-lock-unlock.component';
import { FlowComponent } from './flow/flow.component';
import { WorkflowComponent } from '../masters/workflow/workflow.component';
import { GatepassComponent } from './User/gatepass/gatepass.component';
import { LeaveRequestComponent } from './User/leave-request/leave-request.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import * as moment from 'moment';
import { LeaveacurralComponent } from './User/leave-accural/leaveacurral/leaveacurral.component';
import { SingleLeaveAccrualComponent } from './User/leave-accural/single-leave-accrual/single-leave-accrual.component';
import { MulyipleLeaveAccrualComponent } from './User/leave-accural/mulyiple-leave-accrual/mulyiple-leave-accrual.component';
import { AttendanceProcessComponent } from './attendance-process/attendance-process/attendance-process.component';
import {ListboxModule} from 'primeng/listbox';
import { HttpClientModule } from '@angular/common/http';
import { LeaveEncashComponent } from './User/leave-accural/leave-encash/leave-encash.component';
import { LeaveCarryForwordComponent } from './User/leave-accural/leave-carry-forword/leave-carry-forword.component';
import { EssRequestComponent } from './ess-request/ess-request.component';
import { GatepassDialogComponent } from './ess-request/gatepass-dialog/gatepass-dialog.component';
import { PunchRegularizationComponent } from './ess-request/punch-regularization/punch-regularization.component';
import { LeaveRequestDailogComponent } from './ess-request/leave-request-dailog/leave-request-dailog.component';
import { RequestApprovalFlowComponent } from './ess-request/request-approval-flow/request-approval-flow.component';
import { CoffProcessComponent } from './User/coff-process/coff-process.component';
import { OtherPunchComponent } from './other-punch/other-punch.component';

@NgModule({
  declarations: [
    ShiftMasterComponent,
    ShiftMappingComponent,
    AttendancePolicyComponent,
    AddEditAttendancePolicyMasterComponent,
    LeaveMasterComponent,
    LeavePolicyComponent,
    PolicyMappingComponent,
    AddEditAttendancePolicyMasterComponent,
    HolidayMasterComponent,
    HolidaycalenderpolicyComponent,
    HolidayCalenderPolicyMappingComponent,
    AttendanceDetailComponent,
    ManualPunchSingleEmployeeComponent,
    ManualPunchMultiEmployeeComponent,
    RosterprocesssingleComponent,
    ShiftchnagesingleComponent,
    BackdataProcessComponent,
	FlowComponent,
	GatepassComponent,RosterLockUnlockComponent,
  LeaveRequestComponent,
  LeaveacurralComponent,
  SingleLeaveAccrualComponent,
  MulyipleLeaveAccrualComponent,
  AttendanceProcessComponent,
  LeaveEncashComponent,
  LeaveCarryForwordComponent,
  EssRequestComponent,
  GatepassDialogComponent,
  PunchRegularizationComponent,
  LeaveRequestDailogComponent,
  RequestApprovalFlowComponent,
  CoffProcessComponent,
  OtherPunchComponent
  ],
  imports: [
    CommonModule,
    MastersModule,
    CheckboxModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    TabViewModule,
    BsDatepickerModule,
    TimepickerModule.forRoot(),
    PopoverModule,
    MultiSelectModule,
    WorkForceModule,
    AutoCompleteModule,
    AccordionModule,
    CheckboxModule,
    TableModule,
    WebcamModule,
    CalendarModule,
    NgxPrintModule,
    TimeOfficeRoutingModule,
    BsDatepickerModule.forRoot(),
    GateUserModule,
    MultiSelectModule,
    AutoCompleteModule,
    InputNumberModule,
    SelectButtonModule,
    RadioButtonModule,
    ListboxModule,
    HttpClientModule
  ],
  exports:[
    OtherPunchComponent,
  ]
 
  // providers:[ShiftService]
})
export class TimeOfficeModule { 

  constructor(
    private authenticationService: AuthService,
    private shiftServices: ShiftService,
    private leavePolicyService: LeavePolicyService,
    private leaveMasterService: LeaveMasterService,
    private userAttendanceService:UserAttendanceDetailService,
  ){
    this.authenticationService.currentUser.subscribe(
      x => {
        if(x && x.accessToken && !this.authenticationService.isExpiredToken()){
          console.log('timeoffice!!!');
          this.shiftServices.fetchShiftData();
          this.leaveMasterService.fetchLeaveData();
          this.leavePolicyService.fetchLeavePolicyData();
        }
      }); 

  }
}

