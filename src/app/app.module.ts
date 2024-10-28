import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { StoreModule } from '@ngrx/store'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {DropdownModule} from 'primeng/dropdown';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

//Application imports 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightsidebarComponent } from './layout/rightsidebar/rightsidebar.component';
import { FooterComponent } from './layout/header/footer/footer.component';
import { LoginComponent } from './module/login/login.component';
import { LoaderComponent } from './loader/loader.component';
import { DashboardModule } from './module/dashboard/dashboard.module';
import { MastersModule } from './module/masters/masters.module';
import { AgGridModule } from 'ag-grid-angular';
import { FileUploadModule } from "primeng/fileupload";
// renderer

import { appReducers } from './store/app.state';
import { BranchService } from './services/branch.service';
import { ButtonModule } from 'primeng/button';
import { HttpErrorInterceptor } from './common/http-error.interceptor';
import {MegaMenuModule} from 'primeng/megamenu';
import { AccordionModule } from 'primeng/accordion';
import { StarLoaderComponent } from './star-loader/star-loader.component';
import {CalendarModule} from 'primeng/calendar';
import { DatePipe } from '@angular/common';
import { AutoCodeComponent } from './module/core/auto-code/auto-code.component';
import { GlobalsettingComponent } from './module/core/globalsetting/globalsetting.component';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { WebcamModule} from 'ngx-webcam';
import { WorkForceModule } from './module/work-force/work-force.module';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ForgotPasswordComponent } from './module/forgot-password/forgot-password.component';
import { GalleriaModule } from 'primeng/galleria';
import { payrollAppReducers } from './store/payroll.app.state';
import { AppConfigService } from './services/app-config.service';
import { CanteenAppReducers } from './store/canteen.app.state';
import { TimeOfficeModule } from './module/time-office/timeoffice.module';

let appReducersObj = {...appReducers,...payrollAppReducers,...CanteenAppReducers};

export function initConfig(appConfig: AppConfigService) {
  return () => appConfig.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    RightsidebarComponent,
    FooterComponent,
    LoginComponent,
    LoaderComponent,
    StarLoaderComponent,
    AutoCodeComponent,
    GlobalsettingComponent,
    ForgotPasswordComponent,

   
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgHttpLoaderModule.forRoot(),
    ToastModule,
    DialogModule,
    DashboardModule,
    MastersModule,
    AgGridModule.withComponents([]),
    ButtonModule,
    MegaMenuModule,
    AccordionModule,
    DropdownModule,
    FileUploadModule,
    CalendarModule,
    ConfirmDialogModule,
    TableModule,
    AutoCompleteModule,
    WebcamModule,   
    WorkForceModule,
    TimeOfficeModule,
    TimepickerModule.forRoot(),
    GalleriaModule,
    StoreModule.forRoot(appReducersObj,{})
    
  ],
  providers: [
    MessageService,
    BranchService,
    FormBuilder,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initConfig, multi: true, deps: [AppConfigService]},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
