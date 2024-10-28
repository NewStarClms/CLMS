import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkForceRoutingModule } from './work-force-routing.module';
import { AddEditEmployeeComponent } from './add-edit-employee/add-edit-employee.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { EmployeeComponent } from './employee/employee.component';
import {CheckboxModule} from 'primeng/checkbox';
import { MastersModule } from '../masters/masters.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { EmployeeGlobalFilterComponent } from './employee-global-filter/employee-global-filter.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { WebcamModule } from 'ngx-webcam';
import { DialogModule } from 'primeng/dialog';
import {SelectButtonModule} from 'primeng/selectbutton';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { AuthService } from 'src/app/services/authentication.service';
import { EmployeeService } from 'src/app/services/employee.service';

@NgModule({
  declarations: [
    AddEditEmployeeComponent,
    EmployeeComponent,
    SearchEmployeeComponent,
    EmployeeGlobalFilterComponent,
    EmployeeProfileComponent,
  ],
  imports: [
    CommonModule,
    WorkForceRoutingModule,
    SelectButtonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    TabViewModule,
    FileUploadModule,
    CheckboxModule,
    MastersModule,
    ConfirmDialogModule,
    BsDatepickerModule.forRoot(),
    AutoCompleteModule,
    MultiSelectModule,
    WebcamModule,
    DialogModule
  ],
  exports:[
    SearchEmployeeComponent,
    EmployeeGlobalFilterComponent
  ]
})
export class WorkForceModule { 
  constructor(
    private authenticationService: AuthService,
    private employeeService:EmployeeService,
  ){
    this.authenticationService.currentUser.subscribe(
      x => {
        if(x && x.accessToken && !this.authenticationService.isExpiredToken()){
          console.log('workforce!!!');
          this.employeeService.fetchEmployeeMasterData();
        }
      }); 

  }
  
}
export { SearchEmployeeComponent } from './search-employee/search-employee.component';
export { EmployeeGlobalFilterComponent } from './employee-global-filter/employee-global-filter.component';