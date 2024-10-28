import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemMasterComponent } from './item-master/item-master.component';
import { CanteenPolicyComponent } from './canteen-policy/canteen-policy.component';
import { CanteenUserComponent } from './canteen-user/canteen-user.component';

const routes: Routes = [
  { path : 'item-master', component: ItemMasterComponent},
  { path : 'canteen-policy', component: CanteenPolicyComponent},
  { path : 'canteen-process/:id', component: CanteenUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanteenRoutingModule { }
