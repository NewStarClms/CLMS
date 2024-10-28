import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessTypeComponent } from './business-type/business-type.component';
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
import { NatureofworkComponent } from './natureofwork/natureofwork.component';
import { OrganizationComponent } from './organization/organization.component';
import { DispensaryComponent } from './dispensary/dispensary.component';
import { GradeComponent } from './grade/grade.component';
import { GateComponent } from './gate/gate.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { VisitorAreasComponent } from './visitor-areas/visitor-areas.component';
import { VisitorTypeComponent } from './visitor-type/visitor-type.component';
import { VisitorPurposeComponent } from './visitor-purpose/visitor-purpose.component';
import { AddEditCompanyComponent } from './add-edit-company/add-edit-company.component';
import { AddEditContractorComponent } from './add-edit-contractor/add-edit-contractor.component';
import { DocumenttypeComponent } from './documenttype/documenttype.component';
import { VisitorPassTemplateComponent } from './visitor-pass-template/visitor-pass-template.component';
import { AddEditVisitorPassTemplateComponent } from './add-edit-visitor-pass-template/add-edit-visitor-pass-template.component';
import { MailserverComponent } from './mailserver/mailserver.component';
import { VisitorGeneralSettingComponent } from './visitor-general-setting/visitor-general-setting.component';
import { AddEditWorkflowComponent } from './add-edit-workflow/add-edit-workflow.component';
import { AlertTemplateComponent } from './template/alert-template/alert-template.component';
import { EditAlertTemplateComponent } from './template/alert-template/edit-alert-template/edit-alert-template.component';
import { LetterTemplateComponent } from './template/letter-template/letter-template.component';
import { AddEditTemplateComponent } from './template/letter-template/add-edit-template/add-edit-template.component';
import { UnderDevelopmentComponent } from './under-development/under-development.component';

const routes: Routes = [
  { path : 'business-type', component: BusinessTypeComponent },
  { path : 'branch', component: BranchComponent},
  { path : 'category', component: CategoryComponent},
  { path : 'company', component: CompanyComponent},
  { path : 'contractor',component:ContractorComponent},
  { path : 'city',component:CityComponent},
  { path : 'department', component:DepartmentComponent},
  { path : 'designation', component:DesignationComponent},
  { path : 'qualification', component:QualificationComponent},
  { path : 'sub-department', component:SubDepartmentComponent},
  { path : 'section', component:SectionComponent},
  { path : 'bank', component:BankComponent},
  { path : 'bank-branch', component:BankBranchComponent},
  { path : 'level', component:LevelComponent},
  { path : 'nature-of-work', component:NatureofworkComponent},
  { path : 'organization', component:OrganizationComponent},
  { path : 'dispensary', component:DispensaryComponent},
  { path : 'grade', component:GradeComponent},
  { path : 'gate', component:GateComponent},
  { path : 'item-type', component:ItemTypeComponent},
  { path : 'visitor-area', component:VisitorAreasComponent},
  { path : 'visitor-type', component:VisitorTypeComponent},
  { path :  'visitor-purpose',component:VisitorPurposeComponent},
  { path :  'add-edit-company/:id',component:AddEditCompanyComponent},
  { path :  'add-edit-contractor/:id',component:AddEditContractorComponent},
  { path :  'document-type', component:DocumenttypeComponent},
  { path :  'visitor-pass-template',component:VisitorPassTemplateComponent},
  { path :  'add-edit-visitor-template/:id',component:AddEditVisitorPassTemplateComponent},
  { path :  'mailserver',component:MailserverComponent},
  { path :  'smsServer',component:MailserverComponent},
  { path :  'Visitor-General-Setting',component:VisitorGeneralSettingComponent},
  { path :  'add-edit-workflow/:modId/:id',component:AddEditWorkflowComponent},
  { path :  'alert-template',component:AlertTemplateComponent},
  { path :  'alert-template/edit',component:EditAlertTemplateComponent},
  { path :  'letter-template',component:LetterTemplateComponent},
  { path :  'letter-template/edit',component:AddEditTemplateComponent},
  { path :  'letter-template/add',component:AddEditTemplateComponent},
  { path :  'under-development',component:UnderDevelopmentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
