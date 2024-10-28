import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileImportComponent } from './file-import/file-import.component';

const routes: Routes = [
  { path :'import-file/:importModuleID',component:FileImportComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataImportRoutingModule { }
