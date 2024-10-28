import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayComponentComponent } from './paygroup/pay-component/pay-component.component';
import { SalaryDashboardComponent } from './salary-dashboard/salary-dashboard.component';
import { BonusSettingComponent } from './statutory/bonus-setting/bonus-setting.component';
import { EsiSettingComponent } from './statutory/esi-setting/esi-setting.component';
import { GratuitySettingComponent } from './statutory/gratuity-setting/gratuity-setting.component';
import { LwfSettingComponent } from './statutory/lwf-setting/lwf-setting.component';
import { PfSettingComponent } from './statutory/pf-setting/pf-setting.component';
import { PtSettingComponent } from './statutory/pt-setting/pt-setting.component';
import { WagesMasterComponent } from './statutory/wages-master/wages-master.component';
import { AddEditPayComponentComponent } from './paygroup/add-edit-pay-component/add-edit-pay-component.component';
import { PayrollWorkflowComponent } from './payroll-workflow/payroll-workflow.component';
import { PayGroupComponent } from './paygroup/pay-group/pay-group.component';
import { AddEditPayGroupComponent } from './paygroup/add-edit-pay-group/add-edit-pay-group.component';
import { ActionPayrollComponent } from './action-payroll/action-payroll.component';
import { EmpSalStructureComponent } from './emp-sal-structure/emp-sal-structure.component';
import { SettelmentReasonComponent } from './other/settelment-reason/settelment-reason.component';
import { FinancialYearComponent } from './other/financial-year/financial-year.component';
import { EmployeeSeparationComponent } from './employee-separation/employee-separation.component';
import { ChallanComponent } from './challan/challan.component';
import { ArrearComponent } from './arrear/arrear.component';
import { BonusProcessComponent } from './bonus-process/bonus-process.component';


const routes: Routes = [
  { path : '', component: PayComponentComponent},
 { path : 'pf', component: PfSettingComponent},
 { path : 'esi', component: EsiSettingComponent},
 { path : 'pt', component: PtSettingComponent},
 { path : 'gratuity', component: GratuitySettingComponent},
 { path : 'lwf', component: LwfSettingComponent},
 { path : 'wagesmaster', component: WagesMasterComponent},
 { path : 'bonus', component: BonusSettingComponent},
 { path : 'pay', component: PayComponentComponent},
 { path : 'salary-dashboard', component:SalaryDashboardComponent},
 { path : 'action/:id', component:ActionPayrollComponent},
 { path : 'process-bonus', component:BonusProcessComponent},
 { path : 'add-edit-pay/:id', component: AddEditPayComponentComponent},
 { path : 'workflow-detail',component:PayrollWorkflowComponent},
 { path : 'pay-group', component:PayGroupComponent},
 { path : 'add-edit-pay-group/:id', component: AddEditPayGroupComponent},
 { path : 'salary-structure', component: EmpSalStructureComponent},
 { path : 'settlement-reason', component: SettelmentReasonComponent},
 { path : 'financial-year', component:FinancialYearComponent},
 { path : 'separation', component:EmployeeSeparationComponent},
 { path : 'challan', component:ChallanComponent},
 { path : 'arrear/:flag', component: ArrearComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule { }
