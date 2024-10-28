import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorComponent } from './visitor/visitor.component';
import { MastersModule } from '../masters/masters.module';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { VisitorRoutingModule } from './visitor-routing.module';




@NgModule({
  declarations: [
    VisitorComponent,
    
  ],
  imports: [
    VisitorRoutingModule,
    CommonModule,
    MastersModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    DropdownModule,
  ]
})
export class VisitorModule { }
