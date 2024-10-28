import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import {CheckboxModule} from 'primeng/checkbox';
import { MastersModule } from '../masters/masters.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import {SelectButtonModule} from 'primeng/selectbutton';
import { MachineMasterComponent } from './machine-master/machine-master.component';
import { MachineRoutingModule } from './machine-routing.module';
import {TreeModule} from 'primeng/tree';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditMachineComponent } from './machine-master/edit-machine/edit-machine.component';
import { AccordionModule } from 'primeng/accordion';
import { RegisteredEmpComponent } from './registered-emp/registered-emp.component';
import { UnRegisteredEmpComponent } from './unregistered-emp/unregistered-emp.component';

@NgModule({
  declarations: [
   MachineMasterComponent,
   EditMachineComponent,
   RegisteredEmpComponent,
   UnRegisteredEmpComponent
  ],
  imports: [
    MachineRoutingModule,
    CommonModule,
    SelectButtonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    TabViewModule,
    CheckboxModule,
    MastersModule,
    ConfirmDialogModule,
    BsDatepickerModule.forRoot(),
    AutoCompleteModule,
    DialogModule,
    TreeModule,
    NgMultiSelectDropDownModule,
    AccordionModule
  ],
  exports:[

  ]
})
export class MachineModule { 
  
}