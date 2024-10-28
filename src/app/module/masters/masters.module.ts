import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersRoutingModule } from './masters-routing.module';
import { BusinessTypeComponent } from './business-type/business-type.component';
import { AgGridModule } from 'ag-grid-angular';
import { BranchComponent } from './branch/branch.component';
import { CategoryComponent } from './category/category.component';
import { CompanyComponent } from './company/company.component';
import { ContractorComponent } from './contractor/contractor.component';
import { CityComponent } from './city/city.component';
import { DepartmentComponent } from './department/department.component';
import { DesignationComponent } from './designation/designation.component';
import { QualificationComponent } from './qualification/qualification.component';
import { SubDepartmentComponent } from './sub-department/sub-department.component';
import { SectionComponent } from './section/section.component';
import { BankComponent } from './bank/bank.component';
import { BankBranchComponent } from './bank-branch/bank-branch.component';
import { LevelComponent } from './level/level.component';
import { GridRendererComponent } from './renderer/grid-renderer.component';
import { EditableCellRendererComponent } from './renderer/editable-cell-renderer.component';
import { FormsModule } from '@angular/forms';
import { NatureofworkComponent } from './natureofwork/natureofwork.component';
import { OrganizationComponent } from './organization/organization.component';
import { DispensaryComponent } from './dispensary/dispensary.component';
import { GradeComponent } from './grade/grade.component';
import { GateComponent } from './gate/gate.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { VisitorAreasComponent } from './visitor-areas/visitor-areas.component';
import { VisitorTypeComponent } from './visitor-type/visitor-type.component';
import { VisitorPurposeComponent } from './visitor-purpose/visitor-purpose.component';
import { DialogModule } from 'primeng/dialog';
import { AddEditCompanyComponent } from './add-edit-company/add-edit-company.component';
import { AddEditContractorComponent } from './add-edit-contractor/add-edit-contractor.component';
import {ToastModule} from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import {AccordionModule} from 'primeng/accordion';
import {DropdownModule} from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../sharedModule/shared.module';
import { DocumenttypeComponent } from './documenttype/documenttype.component';
import { VisitorPassTemplateComponent } from './visitor-pass-template/visitor-pass-template.component';
import { AddEditVisitorPassTemplateComponent } from './add-edit-visitor-pass-template/add-edit-visitor-pass-template.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import {SelectButtonModule} from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';
import {  MultiSelectModule } from 'primeng/multiselect';
import { MailserverComponent } from './mailserver/mailserver.component';
import { SmsServerComponent } from './sms-server/sms-server.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { EmployeeSearchComponent } from './employee-search/employee-search.component';
import { VisitorGeneralSettingComponent } from './visitor-general-setting/visitor-general-setting.component';
import { AuthService } from '../../services/authentication.service';
import { WorkflowComponent } from './workflow/workflow.component';
import { AddEditWorkflowComponent } from './add-edit-workflow/add-edit-workflow.component';
import { CheckboxModule } from 'primeng/checkbox';
import { GateService } from 'src/app/services/gate.service';
import { ItemTypeService } from '../../services/item-type.service';
import { VisitorAreasService } from '../../services/visitor-areas.service';
import { VisitorTypeService } from '../../services/visitor-type.service';
import { VisitorPurposeService } from 'src/app/services/visitor-purpose.service';
import { AlertTemplateComponent } from './template/alert-template/alert-template.component';
import { EditAlertTemplateComponent } from './template/alert-template/edit-alert-template/edit-alert-template.component';
import { LetterTemplateComponent } from './template/letter-template/letter-template.component';
import { AddEditTemplateComponent } from './template/letter-template/add-edit-template/add-edit-template.component';
import { OrganizationMapingComponent } from './organization-maping/organization-maping.component';
import { UnderDevelopmentComponent } from './under-development/under-development.component';

@NgModule({
  declarations: [
    BusinessTypeComponent,
    BranchComponent,
    CategoryComponent,
    CompanyComponent,
    ContractorComponent,
    CityComponent,
    DepartmentComponent,
    DesignationComponent,
    QualificationComponent,
    SubDepartmentComponent,
    SectionComponent,
    BankComponent,
    BankBranchComponent,
    LevelComponent,
    NatureofworkComponent,
    SectionComponent,
    GridRendererComponent,
    EditableCellRendererComponent,
    OrganizationComponent,
    DispensaryComponent,
    GradeComponent,
    GateComponent,
    ItemTypeComponent,
    VisitorAreasComponent,
    VisitorTypeComponent,
    VisitorPurposeComponent,
    AddEditCompanyComponent,
    AddEditContractorComponent,
    DocumenttypeComponent,
    VisitorPassTemplateComponent,
    AddEditVisitorPassTemplateComponent,
    MailserverComponent,
    SmsServerComponent,
    EmployeeSearchComponent,
    VisitorGeneralSettingComponent,
    WorkflowComponent,
    AddEditWorkflowComponent,
    AlertTemplateComponent,
    EditAlertTemplateComponent,
    LetterTemplateComponent,
    AddEditTemplateComponent,
    OrganizationMapingComponent,
    UnderDevelopmentComponent

  ],
  imports: [
    SelectButtonModule,
    CommonModule,
    MastersRoutingModule,
    AgGridModule,
    FormsModule,
    DialogModule,
    ToastModule,
    ButtonModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    FileUploadModule,
    ToolbarModule,
    TableModule,
    AccordionModule,
    DropdownModule,
    CalendarModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
    CKEditorModule,
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    TabViewModule,
    MultiSelectModule,
    AutoCompleteModule,
    InputNumberModule,
    CheckboxModule,
  ],
  providers: [ConfirmationService],
  exports:[
    GridRendererComponent,
    EmployeeSearchComponent,
    WorkflowComponent,
    OrganizationMapingComponent
  ]
})
export class MastersModule {
  constructor(
    private authenticationService:AuthService,
    private gateService:GateService,
    private itemTypeService:ItemTypeService,
    private visitorareaService:VisitorAreasService,
    private visitortypeService:VisitorTypeService,
    private visitorpurposeService:VisitorPurposeService,
  ){
    this.authenticationService.currentUser.subscribe(
      x => {
        if(x && x.accessToken){
        console.log('Master Module!');
        this.gateService.fetchGateData();
    this.itemTypeService.fetchItemTypeData();
    this.visitorareaService.fetchVisitorAreaData();
    this.visitortypeService.fetchVisitorTypeData();
    this.visitorpurposeService.fetchVisitorPurposeData();
    // this.employeemService.fetchEmployeeMasterData();
        
        }
      });
  }

}
export {GridRendererComponent} from './renderer/grid-renderer.component';
export {EmployeeSearchComponent} from './employee-search/employee-search.component';
