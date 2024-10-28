import { ChangeDetectorRef, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { EmployeeHolidayComponent } from './employee-holiday/employee-holiday.component';
import { EmployeeLeaveComponent } from './employee-leave/employee-leave.component';
import { EmployeeVisitorStatusComponent } from './employee-visitor-status/employee-visitor-status.component';
import { Store } from '@ngrx/store';
import { employeeDashboardSettingState } from 'src/app/store/app.state';
import { AppUtil } from 'src/app/common/app-util';
import { EmployeeDashboardSetting } from 'src/app/store/model/employee-dashboard-setting.model';
import { EmployeeAttendanceStatsComponent } from './employee-attendance-stats/employee-attendance-stats.component';
import { EmployeeBirthdayStatusComponent } from './employee-birthday-status/employee-birthday-status.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
   @ViewChild("tile1", {static : false, read: ViewContainerRef }) tile1: ViewContainerRef;
   @ViewChild('tile2', {static : false, read: ViewContainerRef}) tile2: ViewContainerRef;
   @ViewChild('tile3', {static : false, read: ViewContainerRef}) tile3: ViewContainerRef;
   @ViewChild('tile4', {static : false, read: ViewContainerRef}) tile4: ViewContainerRef;
   @ViewChild('tile5', {static : false, read: ViewContainerRef}) tile5: ViewContainerRef;
   @ViewChild('tile6', {static : false, read: ViewContainerRef}) tile6: ViewContainerRef;
   
   employeeDashboardSettings:Array<EmployeeDashboardSetting>=[];
   tilesCollection: Array<any>=[];

   public images1:string;
   public images2:string;
   public images3:string;
   public images: any[] = [];
   public responsiveOptions: any[] | undefined;

  constructor(private authenticationService: AuthService, private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef,
    private _store: Store<any>) 
    {
      this.images.push({ source: './../../../assets/img/Time-Management-1.jpg' });
      this.images.push({ source: './../../../assets/img/Time-management-2.jpg' });
      this.images.push({ source: './../../../assets/img/Time-Management-3.jpg' });
      this.images.push({ source: './../../../assets/img/Time-Management-4.jpg' });
      this.images.push({ source: './../../../assets/img/Time-Management-5.jpg' });
      this.images;
    }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(true);
    this._store.select(employeeDashboardSettingState).subscribe(response=>{
        if (response && response.employeeDashboardSettingList) {
            this.employeeDashboardSettings = AppUtil.deepCopy(response.employeeDashboardSettingList);
            this.changeDetectorRef.detectChanges();
            this.createDashboardTiles();
        }
      });

      this.images.push({ source: './../../../assets/img/Time-Management-1.jpg' });
      this.images.push({ source: './../../../assets/img/Time-management-2.jpg' });
      this.images.push({ source: './../../../assets/img/Time-Management-3.jpg' });
      this.images.push({ source: './../../../assets/img/Time-Management-4.jpg' });
      this.images.push({ source: './../../../assets/img/Time-Management-5.jpg' });
      this.images;
  }

  ngAfterViewInit(){
    this.tilesCollection=[];
    this.tilesCollection["1"]=this.tile1;
    this.tilesCollection["2"]=this.tile2;
    this.tilesCollection["3"]=this.tile3;
    this.tilesCollection["4"]=this.tile4;
    this.tilesCollection["5"]=this.tile5;
    this.tilesCollection["6"]=this.tile6;
  }

  createDashboardTiles() {
    var componentsReferences = [];
    this.tile1?.remove();
    this.tile2?.remove();
    this.tile3?.remove();
    this.tile4?.remove();
    this.tile5?.remove();
    this.tile6?.remove();

    this.tilesCollection=[];
    this.tilesCollection["1"]=this.tile1;
    this.tilesCollection["2"]=this.tile2;
    this.tilesCollection["3"]=this.tile3;
    this.tilesCollection["4"]=this.tile4;
    this.tilesCollection["5"]=this.tile5;
    this.tilesCollection["6"]=this.tile6;

    componentsReferences["Attendance Calendar"] = this.componentFactoryResolver.resolveComponentFactory(EmployeeAttendanceComponent);
    componentsReferences["Holiday"] = this.componentFactoryResolver.resolveComponentFactory(EmployeeHolidayComponent);
    componentsReferences["Leave Balance"] = this.componentFactoryResolver.resolveComponentFactory(EmployeeLeaveComponent);
    componentsReferences["Visitor Statistics"] = this.componentFactoryResolver.resolveComponentFactory(EmployeeVisitorStatusComponent);
    componentsReferences["Attendance Statistics"] = this.componentFactoryResolver.resolveComponentFactory(EmployeeAttendanceStatsComponent);
    componentsReferences["Birthday List"] = this.componentFactoryResolver.resolveComponentFactory(EmployeeBirthdayStatusComponent);
   
    var index=1;
    this.employeeDashboardSettings.forEach( (setting) => {
        if(setting.active && componentsReferences[setting.settingName]){
           this.tilesCollection[String(index)]?.createComponent(componentsReferences[setting.settingName]);
           index++;
        }
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['\login']);
  }

}
