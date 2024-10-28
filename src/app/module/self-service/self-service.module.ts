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
import { VisitorAdminComponent } from './visitor-admin/visitor-admin.component';
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
import { SelfServiceRoutingModule } from './self-service-routing.module';
import { GateUserModule } from '../gate-user/gate-user.module';
import { ItemTypeService } from 'src/app/services/item-type.service';
import { VisitorAreasService } from '../../services/visitor-areas.service';
import { VisitorTypeService } from '../../services/visitor-type.service';
import { VisitorPurposeService } from 'src/app/services/visitor-purpose.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { GateService } from 'src/app/services/gate.service';
import * as moment from 'moment';
import { VisitorAdminService } from 'src/app/services/visitor-admin.service';
import { VisitorEssService } from 'src/app/services/visitor-ess.service';
import { RequestDashboardComponent } from './request-flow/request-dashboard/request-dashboard.component';
import { RequestApproveFlowComponent } from './request-flow/request-approve-flow/request-approve-flow.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RadioButtonModule} from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { LeaveMasterService } from 'src/app/services/leave-master.service';
import { RequestApprovalFlowComponent } from './request-approval-flow/request-approval-flow.component';
import { GatepassDialogComponent } from './request-flow/gatepass-dialog/gatepass-dialog.component';
import { LeaveRequestDailogComponent } from './request-flow/leave-request-dailog/leave-request-dailog.component';
import { AuthService } from '../../services/authentication.service';
import { RequestFlowService } from 'src/app/services/request-flow.service';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { TeamDetailComponent } from './team/team-detail/team-detail.component';
import { TeamAttendanceComponent } from './team/team-attendance/team-attendance.component';
import { PunchRegularizationComponent } from './request-flow/punch-regularization/punch-regularization.component';
import { LeaveDetailComponent } from './team/leave-detail/leave-detail.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SalarySlipComponent } from './salary-slip/salary-slip.component';

@NgModule({
  declarations: [
    VisitorAdminComponent,
    RequestDashboardComponent,
    RequestApproveFlowComponent,
    RequestApprovalFlowComponent,
    GatepassDialogComponent,
    LeaveRequestDailogComponent,
    TeamDetailComponent,
    TeamAttendanceComponent,
    PunchRegularizationComponent,
    LeaveDetailComponent,
    SalarySlipComponent
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
    NgxPrintModule,
    SelfServiceRoutingModule,
    GateUserModule,
    RadioButtonModule,
    GateUserModule,
    DropdownModule,
    RadioButtonModule,
    InputTextareaModule,
    CalendarModule,
    NgMultiSelectDropDownModule.forRoot(),
    ButtonModule
  ]
})
export class SelfServiceModule {
  todatetime: string; 
  fromdatetime: string;
  constructor(
    private gateService: GateService,
    private itemTypeService:ItemTypeService,
    private visitorareaService:VisitorAreasService,
    private visitortypeService:VisitorTypeService,
    private visitorpurposeService:VisitorPurposeService,
    private visitorAdminService:VisitorAdminService,
    private visitorEssService: VisitorEssService,
    private employeeService:EmployeeService,
    private leaveMasterService: LeaveMasterService,
    private authService:AuthService,
    private requestFlowService:LeaveRequestService
  ){
    console.log('self-service');
    // if(!this.authService.isExpiredToken()){
    this.fromdatetime = moment(moment().toDate()).format('DD-MMM-YYYY')+' 00:00';
    this.todatetime = moment(moment().toDate()).format('DD-MMM-YYYY')+' 23:59';
    this.gateService.fetchGateData();
    this.itemTypeService.fetchItemTypeData();
    this.visitorareaService.fetchVisitorAreaData();
    this.visitortypeService.fetchVisitorTypeData();
    this.visitorpurposeService.fetchVisitorPurposeData();
    this.employeeService.fetchEmployeeMasterData();
    this.leaveMasterService.fetchLeaveData();
    this.visitorEssService.fetchVisitorAdminESSData(this.fromdatetime,this.todatetime,0);
    this.leaveMasterService.fetchLeaveData();
    this.requestFlowService.setVisibility(false);
   
    // }
  }
}
