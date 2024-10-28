import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import {CheckboxModule} from 'primeng/checkbox';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import {SelectButtonModule} from 'primeng/selectbutton';
import { PayrollRoutingModule } from './payroll-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PayComponentComponent } from './paygroup/pay-component/pay-component.component';
import {AccordionModule} from 'primeng/accordion';
import { PfSettingComponent } from './statutory/pf-setting/pf-setting.component';
import { EsiSettingComponent } from './statutory/esi-setting/esi-setting.component';
import { LwfSettingComponent } from './statutory/lwf-setting/lwf-setting.component';
import { PtSettingComponent } from './statutory/pt-setting/pt-setting.component';
import { WagesMasterComponent } from './statutory/wages-master/wages-master.component';
import { GratuitySettingComponent } from './statutory/gratuity-setting/gratuity-setting.component';
import { TableModule } from 'primeng/table';
import { PayrollGridRendereComponent } from './payroll-grid-rendere.component';
import { SharedModule } from 'src/app/sharedModule/shared.module';
import { BonusSettingComponent } from './statutory/bonus-setting/bonus-setting.component';
import { AddEditPayComponentComponent } from './paygroup/add-edit-pay-component/add-edit-pay-component.component';
import { SalaryDashboardComponent } from './salary-dashboard/salary-dashboard.component';
import { AuthService } from '../../services/authentication.service';
import { PayComponentService } from '../../services/pay-component.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PayrollWorkflowComponent } from './payroll-workflow/payroll-workflow.component';
import { MastersModule } from '../masters/masters.module';
import { PayGroupComponent } from './paygroup/pay-group/pay-group.component';
import { AddEditPayGroupComponent } from './paygroup/add-edit-pay-group/add-edit-pay-group.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrganizationMapingComponent } from '../masters/organization-maping/organization-maping.component';
import { UpdatePayComponentComponent } from './paygroup/update-pay-component/update-pay-component.component';
import { FormulaBuilderComponent } from './formula-builder/formula-builder.component';
import {FieldsetModule} from 'primeng/fieldset';
import {DividerModule} from 'primeng/divider';
import { EmployeeService } from '../../services/employee.service';
import { ActionPayrollComponent } from './action-payroll/action-payroll.component';
import { EmpSalStructureComponent } from './emp-sal-structure/emp-sal-structure.component';
import { StatutoryComponent } from './emp-sal-structure/statutory/statutory.component';
import { SalaryComponent } from './emp-sal-structure/salary/salary.component';
import { PairsPipe } from 'src/app/pipe/transform.pairs.pipe';
import { SalarySummaryComponent } from './salary-summary/salary-summary.component';
import { LoanSummaryComponent } from './loan-summary/loan-summary.component';
import { LeaveSummaryComponent } from './leave-summary/leave-summary.component';
import { BonusSummaryComponent } from './bonus-summary/bonus-summary.component';
import { ArrearSummaryComponent } from './arrear-summary/arrear-summary.component';
import { ViewSalarySummaryComponent } from './view-salary-summary/view-salary-summary.component';
import { LoanRequestComponent } from './loan-request/loan-request.component';
import { SettelmentReasonComponent } from './other/settelment-reason/settelment-reason.component';
import { SettlementReasonService } from '../../services/settlement-reason.service';
import { FinancialYearComponent } from './other/financial-year/financial-year.component';
import { FinancialyYearService } from 'src/app/services/financialy-year.service';
import { PaidDaysRequestComponent } from './paid-days-request/paid-days-request.component';
import { CalendarModule } from 'primeng/calendar';
import { LeaveEncashmentRequestComponent } from './leave-encashment-request/leave-encashment-request.component';
import { EmployeeSeparationComponent } from './employee-separation/employee-separation.component';
import { SeparationDialogComponent } from './employee-separation/separation-dialog/separation-dialog.component';
import { SettlementDialogComponent } from './employee-separation/settlement-dialog/settlement-dialog.component';
import { VariablePayComponent } from './variable-pay/variable-pay.component';
import { ChallanComponent } from './challan/challan.component';
import { ArrearComponent } from './arrear/arrear.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BonusProcessComponent } from './bonus-process/bonus-process.component';

@NgModule({
  declarations: [
    PayComponentComponent,
    PfSettingComponent,
    EsiSettingComponent,
    LwfSettingComponent,
    PtSettingComponent,
    WagesMasterComponent,
    GratuitySettingComponent,
    PayrollGridRendereComponent,
    BonusSettingComponent,
    SalaryDashboardComponent,
    AddEditPayComponentComponent,
    PayrollWorkflowComponent,
    PayGroupComponent,
    AddEditPayGroupComponent,
    UpdatePayComponentComponent,
    FormulaBuilderComponent,
    ActionPayrollComponent,
    EmpSalStructureComponent,
    StatutoryComponent,
    SalaryComponent,
    PairsPipe,
    SalarySummaryComponent,
    LoanSummaryComponent,
    LeaveSummaryComponent,
    BonusSummaryComponent,
    ArrearSummaryComponent,
    ViewSalarySummaryComponent,   
    LoanRequestComponent,
    FinancialYearComponent,
    SettelmentReasonComponent,
    PaidDaysRequestComponent,
    LeaveEncashmentRequestComponent,
    EmployeeSeparationComponent,
    SeparationDialogComponent,
    SettlementDialogComponent,
    VariablePayComponent,
    ChallanComponent,
    ArrearComponent,
    BonusProcessComponent
  ],
  imports: [
    MastersModule,
    FieldsetModule,
    PayrollRoutingModule,
    CommonModule,
    SelectButtonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    TabViewModule,
    CheckboxModule,
    ConfirmDialogModule,
    DragDropModule,
    BsDatepickerModule.forRoot(),
    AutoCompleteModule,
    DialogModule,
    NgMultiSelectDropDownModule,
    AccordionModule,
    CommonModule,
    TableModule,
    SharedModule,
    RadioButtonModule,
    SelectButtonModule,
    MultiSelectModule,
    DialogModule,
    DividerModule,
    CalendarModule,
    PopoverModule,
    TimepickerModule
  ],
  exports:[

  ]
})
export class PayrollModule { 
  constructor(
    private authService:AuthService,
    private payComponentService: PayComponentService,
    private employeeService: EmployeeService,
    private settlementReasonService: SettlementReasonService,
    private financialyYearService:FinancialyYearService
  ){
    this.authService.currentUser.subscribe(
      x => {
        if(x && x.accessToken){
    if(!this.authService.isExpiredToken()){
      console.log('dd');
    this.employeeService.fetchEmployeeMasterData();
    this.payComponentService.getPayComponentsfromRemote();
    this.payComponentService.getPayheadsfromRemote();
    this.settlementReasonService.fetchSettlementReasonData();
    this.financialyYearService.fetchFinancialyYearData();
    }
  }
});
  }
}
