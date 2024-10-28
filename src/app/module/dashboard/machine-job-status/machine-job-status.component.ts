import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeDashboardSettingService } from 'src/app/services/employee-dashboard-setting.service';
import { MachineJobProgress } from 'src/app/store/model/employee-dashboard-setting.model';


@Component({
  selector: 'app-machine-job-status',
  templateUrl: './machine-job-status.component.html',
  styleUrls: ['./machine-job-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MachineJobStatusComponent implements OnInit {
    @Input() events: Observable<void>;
    @Input() showMachineStatus: boolean;
    public jobs : Array<MachineJobProgress>=[];
    public columnDefs!: any[];
    public rowData: Array<any>= [];
    eventsSubscription: any;
    constructor( private employeeDashboardSettingService: EmployeeDashboardSettingService){}

    ngOnInit(): void {
        this.eventsSubscription = this.events.subscribe(() => this.loadMachineJobData());
      
        this.columnDefs=this.employeeDashboardSettingService.getMachineJobInProgressColumns();
    }
    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }
    
    loadMachineJobData(){
      this.employeeDashboardSettingService.getMachineJobInProgress().subscribe(res=>{
           this.jobs=res;
      });
      this.employeeDashboardSettingService.setMachineJobPopupVisiblity(true);
    }

    employeeProcessStatus(processRequestID){
        this.employeeDashboardSettingService.getMachineJobInProgress(processRequestID,'E').subscribe(res=>{
            this.rowData=res;
            this.showMachineStatus=true;
        });
    }
    goBack(){
        this.showMachineStatus=false;
        this.employeeDashboardSettingService.setMachineJobPopupVisiblity(true);
    }
}