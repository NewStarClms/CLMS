import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersModule } from '../masters/masters.module';
import { UserManageRoutingModule } from './user-manage-routing.module';
import {CheckboxModule} from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { UsergroupComponent } from './usergroup/usergroup.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MapaccessrightComponent } from './mapaccessright/mapaccessright.component';
import { TabViewModule } from 'primeng/tabview';
import {TreeModule} from 'primeng/tree';
import { EmployeeUserGroupComponent } from './employee-usergroup/employee-usergroup.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EmployeeOrganizationComponent } from './employee-organization/employee-organization.component';
import { EditEmpOrganizationComponent } from './employee-organization/edit-emp-organization/edit-emp-organization.component';
import { UserGroupService } from '../../services/user-group.service';
import { EmployeeOUService } from '../../services/employee-ou.service';
import { EmployeeUserGroupService } from '../../services/employee-usergroup.service';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AuthService } from '../../services/authentication.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    UsergroupComponent,
    MapaccessrightComponent,
    EmployeeUserGroupComponent,
    EmployeeOrganizationComponent,
    EditEmpOrganizationComponent
  ],
  imports: [
    CommonModule,
    UserManageRoutingModule,
    MastersModule,
    CheckboxModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    TabViewModule,
    TreeModule,
    TableModule,
    NgMultiSelectDropDownModule.forRoot(),
    SelectButtonModule,
    BsDatepickerModule
  ],
  providers:[]
})
export class UserManageModule { 
  constructor(
    private userGroupService: UserGroupService,
    private employeeOUService: EmployeeOUService,
    private employeeUserGroupService:EmployeeUserGroupService,
    private authenticationService:AuthService
  ){
  if(!this.authenticationService.isExpiredToken()){
    this.userGroupService.fetchUserGroupData();
  this.userGroupService.fetchUserGroupTypeData();
  // this.employeeOUService.fetchEmployeesOUStatusData();
  this.employeeUserGroupService.fetchEmployeesUserGroupData();
  console.log('userMAnage!!!');
  }
  }

}
