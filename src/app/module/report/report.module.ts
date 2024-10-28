import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSetupComponent } from './report-setup/report-setup.component';
import { AuthService } from '../../services/authentication.service';
import { ReportsService } from '../../services/reports.service';
import { ReportRoutingModule } from './report-routing.module';
import { TabViewModule } from 'primeng/tabview';
import { ReportConfigurationComponent } from './report-configuration/report-configuration.component';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragDropDualListComponent } from './drag-drop-dual-list/drag-drop-dual-list.component';
// import { ArrayFilterPipe, ArraySortPipe } from '../../pipe/array.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



@NgModule({
  declarations: [
    ReportSetupComponent,
    ReportConfigurationComponent,
    DragDropDualListComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    TabViewModule,
    DialogModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    SelectButtonModule,
    MultiSelectModule,
    InputNumberModule,
    BsDatepickerModule,
    AutoCompleteModule,
    ConfirmDialogModule
  ],
  // providers:[ArrayFilterPipe,ArraySortPipe]

})
export class ReportModule { 
  constructor(
    private authenticationService:AuthService,
    private reportsService: ReportsService
  ){
    this.authenticationService.currentUser.subscribe(
      x => {
        if(x && x.accessToken){
          if(!this.authenticationService.isExpiredToken()){
            this.reportsService.fetchReportSetupData();
          }
          console.log('Report Module!!!');
        }
      }); 
  }
}
