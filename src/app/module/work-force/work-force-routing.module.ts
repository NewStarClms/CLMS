import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditEmployeeComponent } from './add-edit-employee/add-edit-employee.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { EmployeeComponent } from './employee/employee.component';


const routes: Routes = [
  { path : 'employee', component: EmployeeComponent},
  { path : 'add-edit-employee/:id',component:AddEditEmployeeComponent},
  { path : 'employee-profile', component:EmployeeProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkForceRoutingModule { }
