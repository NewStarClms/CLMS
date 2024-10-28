import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FetchNameByID } from '../pipe/transform.master.pip';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FetchPayrollNameByID } from '../pipe/transform.payroll.pip';

@NgModule({
  
  imports:      [ 
  CommonModule,
  ButtonModule,
  TableModule
 ],
  declarations: [ 
    FetchNameByID,
    FetchPayrollNameByID
  ],
  providers:[FetchNameByID,FetchPayrollNameByID],
  // exports is required so you can access your component/pipe in other modules
  exports: [ 
    FetchNameByID,
    CommonModule,
    FormsModule,
    FetchPayrollNameByID
  ]
})
export class SharedModule{}