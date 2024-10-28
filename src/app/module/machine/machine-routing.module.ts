import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditMachineComponent } from './machine-master/edit-machine/edit-machine.component';
import { MachineMasterComponent } from './machine-master/machine-master.component';
import { RegisteredEmpComponent } from './registered-emp/registered-emp.component';
import { UnRegisteredEmpComponent } from './unregistered-emp/unregistered-emp.component';


const routes: Routes = [
  { path : '', component: MachineMasterComponent},
  { path : 'edit/:id', component: EditMachineComponent},
  { path : 'registered-emp', component: RegisteredEmpComponent},
  { path : 'unregistered-emp', component: UnRegisteredEmpComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachineRoutingModule { }
