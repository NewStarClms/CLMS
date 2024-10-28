import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoCodeComponent } from './auto-code/auto-code.component';
import { GlobalsettingComponent } from './globalsetting/globalsetting.component';

const routes: Routes = [
  {path : 'auto-code',component:AutoCodeComponent},
  {path : 'global-setting',component:GlobalsettingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreConfigRoutingModule { }
