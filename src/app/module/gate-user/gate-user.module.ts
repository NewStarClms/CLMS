import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersModule } from '../masters/masters.module';
import { GateUserRoutingModule } from './gate-user-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { VisitorAdminComponent } from './visitor-admin/visitor-admin.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MultiSelectModule } from 'primeng/multiselect';
import { WorkForceModule } from '../work-force/work-force.module';
import { SearchVisitorComponent } from './search-visitor/search-visitor.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { EditVisitorAdminComponent } from './edit-visitor-admin/edit-visitor-admin.component';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { WebcamModule } from 'ngx-webcam';
import { NgxPrintModule } from 'ngx-print';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelfVisitorResquestComponent } from './self-visitor-resquest/self-visitor-resquest.component';
import { VisitorReportComponent } from './visitor-report/visitor-report.component';

import { ItemTypeService } from 'src/app/services/item-type.service';
import { VisitorAreasService } from '../../services/visitor-areas.service';
import { VisitorTypeService } from '../../services/visitor-type.service';
import { VisitorPurposeService } from 'src/app/services/visitor-purpose.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { GateService } from 'src/app/services/gate.service';
import * as moment from 'moment';
import { VisitorAdminService } from 'src/app/services/visitor-admin.service';
import { VisitorPassTemplateService } from 'src/app/services/visitor-pass-template.service';
import { GeneralSettingsService } from '../../services/general-settings.service';
import { AuthService } from 'src/app/services/authentication.service';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  declarations: [
    VisitorAdminComponent,
    SearchVisitorComponent,
    EditVisitorAdminComponent,
    SelfVisitorResquestComponent,
    VisitorReportComponent
  ],
  imports: [
    CommonModule,
    GateUserRoutingModule,
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
    CalendarModule,
    SelectButtonModule,
    NgxQRCodeModule
  ],
  exports: [
    SearchVisitorComponent,
  ]
})
export class GateUserModule {
  fromdatetime: string;
  todatetime: string;
  constructor(
    private authenticationService: AuthService,
    private gateService: GateService,
    private itemTypeService:ItemTypeService,
    private visitorareaService:VisitorAreasService,
    private visitortypeService:VisitorTypeService,
    private visitorpurposeService:VisitorPurposeService,
    private visitorAdminService:VisitorAdminService,
    private generalSettingsService: GeneralSettingsService,
    private employeeService:EmployeeService,
    private visitorPassTemplateService: VisitorPassTemplateService
  ){
    this.authenticationService.currentUser.subscribe(
      x => {
        if(x && x.accessToken){
          console.log('gate user!!',x);
          this.fromdatetime = moment(moment().toDate()).format('DD-MMM-YYYY')+' 00:00';
          this.todatetime = moment(moment().toDate()).format('DD-MMM-YYYY')+' 23:59';
          this.gateService.fetchGateData();
          this.itemTypeService.fetchItemTypeData();
          this.visitorareaService.fetchVisitorAreaData();
          this.visitortypeService.fetchVisitorTypeData();
          this.visitorpurposeService.fetchVisitorPurposeData();
          this.visitorPassTemplateService.fetchVisitorPassTemplateData();
          this.visitorPassTemplateService.fetchTagMasterData();
          this.employeeService.fetchEmployeeMasterData();
          this.generalSettingsService.fetchGeneralSettigsData();
          this.visitorAdminService.fetchVisitorAdminData(this.fromdatetime,this.todatetime,0);
        }
      });
    
  }
 }
export { SearchVisitorComponent } from './search-visitor/search-visitor.component';
