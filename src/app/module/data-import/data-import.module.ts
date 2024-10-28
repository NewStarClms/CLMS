import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataImportRoutingModule } from './data-import-routing.module';
import { FileImportComponent } from './file-import/file-import.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EmployeeGlobalFilterComponent } from '../work-force/work-force.module';
import { WorkForceModule } from '../work-force/work-force.module';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    FileImportComponent
  ],
  imports: [
    CommonModule,
    DataImportRoutingModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    TableModule,
    BsDatepickerModule,
    WorkForceModule,
    DialogModule,
  ],
  exports:[
    EmployeeGlobalFilterComponent
  ]
})
export class DataImportModule { }
