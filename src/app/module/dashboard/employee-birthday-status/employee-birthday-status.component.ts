import { Component, OnInit } from '@angular/core';
import { LeaveModel } from 'src/app/store/model/master-data.model';

import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { EmployeeBirthdayStatusService } from 'src/app/services/employee-birthday-status.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-employee-birthday-status',
  templateUrl: './employee-birthday-status.component.html',
  styleUrls: ['./employee-birthday-status.component.scss']
})
export class EmployeeBirthdayStatusComponent implements OnInit {

  public columnDefs!: any[];
  public rowData= [];
  public FromDate:string;
  public ToDate: string;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  //public EmployeeBirthdayStatusInfo:EmployeeBirthdayStatus={} as EmployeeBirthdayStatus;
  currentdate=moment().toDate();
  constructor(  private employeeBirthdayStatus:EmployeeBirthdayStatusService,
                private attendanceService: UserAttendanceDetailService,
                private _store: Store<any>,) {this.datepickerConfig = Object.assign({}, { containerClass: 'theme-default', adaptivePosition:true,dateInputFormat: 'DD-MMM-YYYY' });
              }

  ngOnInit(): void {
    this.columnDefs=this.employeeBirthdayStatus.prepareColumnForBirthdayStatus();
    this.FromDate = moment(this.currentdate).format('DD-MMM-YYYY');
    this.ToDate = moment(this.currentdate).format('DD-MMM-YYYY');
  }

  loadEmployeeBirthday(){
    let formdatetime:string;
    let todatetime:string;
    if(this.FromDate !=null){
      formdatetime= moment(this.FromDate).format("DD-MMM-YYYY");
    }else{
      formdatetime=null
    }
    if(this.ToDate !=null){
      todatetime= moment(this.ToDate).format("DD-MMM-YYYY");
    }else{
      todatetime=null
    }

    this.employeeBirthdayStatus.fetchEmployeeBirthdayStatus(formdatetime,todatetime).subscribe(res =>{
    if(res)  {
   this.rowData=res;
   }
   this.columnDefs = this.employeeBirthdayStatus.prepareColumnForBirthdayStatus();
   });
   }

}
