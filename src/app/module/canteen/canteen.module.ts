import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanteenRoutingModule } from './canteen-routing.module';
import { ItemMasterComponent } from './item-master/item-master.component';
import { CanteenGridRendereComponent } from './canteen-grid-rendere/canteen-grid-rendere.component';

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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {AccordionModule} from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/sharedModule/shared.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import {FieldsetModule} from 'primeng/fieldset';
import {DividerModule} from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgGridModule } from 'ag-grid-angular';
import { AuthService } from 'src/app/services/authentication.service';
import { ItemMasterService } from 'src/app/services/item-master.service';
import { CanteenPolicyComponent } from './canteen-policy/canteen-policy.component';
import { CanteenManualPunchComponent } from './canteen-manual-punch/canteen-manual-punch.component';
import { CanteenPolicyMappingComponent } from './canteen-policy-mapping/canteen-policy-mapping.component';
import { CanteenprocessSingleEmployeeComponent } from './canteenprocess-single-employee/canteenprocess-single-employee.component';
import { CanteenprocessMultipleEmployeeComponent } from './canteenprocess-multiple-employee/canteenprocess-multiple-employee.component';
import { CanteenUserComponent } from './canteen-user/canteen-user.component';
import { MastersModule } from '../masters/masters.module';

@NgModule({
  declarations: [
    ItemMasterComponent,
    CanteenGridRendereComponent,
    CanteenPolicyComponent,
    CanteenManualPunchComponent,
    CanteenPolicyMappingComponent,
    CanteenprocessSingleEmployeeComponent,
    CanteenprocessMultipleEmployeeComponent,
    CanteenUserComponent,
  ],
  imports: [
    CommonModule,
    CanteenRoutingModule,
    FieldsetModule,
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
    TimepickerModule,
    AgGridModule,
    MastersModule
  ]
})
export class CanteenModule {
  constructor(
    private authService:AuthService,
    private itemMasterService:ItemMasterService,
  ){
    this.authService.currentUser.subscribe(
      x => {
        if(x && x.accessToken){
    if(!this.authService.isExpiredToken()){
      console.log('dd');
    this.itemMasterService.fetchItemMasterData();
   
    }
  }
});
  }
 }
