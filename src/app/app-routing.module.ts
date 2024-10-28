import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './module/login/login.component';
import { AuthGuard } from './gaurd/auth.gaurd';

const routes: Routes = [
  { path: '',
  loadChildren: () => import('./module/dashboard/dashboard.module').then( m => m.DashboardModule),
  canActivate: [AuthGuard]
  },
  { path: 'login',
    component: LoginComponent
  },
  {
    path: 'users',
    loadChildren: './users/users.module#UsersModule'
  },
  { path: 'master',
    loadChildren: () => import('./module/masters/masters.module').then( m => m.MastersModule),
  },
  { path: 'work',
    loadChildren: () => import('./module/work-force/work-force.module').then( m => m.WorkForceModule),
  },
  { path: 'core',
    loadChildren: () => import('./module/core/core-config.module').then( m => m.CoreConfigModule),
  },
  { path: 'usermanage',
    loadChildren: () => import('./module/usermanage/user-manage.module').then( m => m.UserManageModule),
  },
  { path: 'gate-user',
    loadChildren: () => import('./module/gate-user/gate-user.module').then( m => m.GateUserModule),
  },
  { path: 'self-service',
    loadChildren: () => import('./module/self-service/self-service.module').then( m => m.SelfServiceModule),
  },
  { path: 'time-office',
    loadChildren: () => import('./module/time-office/timeoffice.module').then( m => m.TimeOfficeModule),
  },
  { path: 'self-visitor',
    loadChildren: () => import('./module/gate-user/gate-user.module').then( m => m.GateUserModule),
  },
  {
    path: 'machine',
    loadChildren:()=>import('./module/machine/machine.module').then(m=>m.MachineModule),
  },
  {
    path: 'reports',
    loadChildren:()=>import('./module/report/report.module').then(m=>m.ReportModule),
  },
  {
    path: 'imports',
    loadChildren:()=>import('./module/data-import/data-import.module').then(m=>m.DataImportModule),
  },
  {
    path: 'payroll',
    loadChildren:()=>import('./module/payroll/payroll.module').then(m=>m.PayrollModule),
  },
  {
    path: 'canteen',
    loadChildren:()=>import('./module/canteen/canteen.module').then(m=>m.CanteenModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
