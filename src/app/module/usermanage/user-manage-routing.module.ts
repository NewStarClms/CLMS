import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEmpOrganizationComponent } from './employee-organization/edit-emp-organization/edit-emp-organization.component';
import { EmployeeOrganizationComponent } from './employee-organization/employee-organization.component';
import { EmployeeUserGroupComponent } from './employee-usergroup/employee-usergroup.component';
import { MapaccessrightComponent } from './mapaccessright/mapaccessright.component';
import { UsergroupComponent } from './usergroup/usergroup.component';


const routes: Routes = [
     { path:'user-group', component:UsergroupComponent},
     { path :'mapaccessright/:id',component:MapaccessrightComponent},
     { path:'employee-usergroup', component: EmployeeUserGroupComponent},
     { path:'employee-ou', component: EmployeeOrganizationComponent},
     { path:'edit-emp-ou',component: EditEmpOrganizationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManageRoutingModule { }
