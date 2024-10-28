import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
//import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { WorkForceModule } from '../module/work-force/work-force.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    WorkForceModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent
  ],
  declarations: [
    HeaderComponent,
    SidebarComponent,
    
  ]
})
export class LayoutModule { }
