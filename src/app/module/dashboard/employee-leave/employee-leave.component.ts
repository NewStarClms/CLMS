import { Component, OnInit } from '@angular/core';
import { LeaveMasterService } from 'src/app/services/leave-master.service';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { LeaveModel } from 'src/app/store/model/master-data.model';

@Component({
  selector: 'app-employee-leave',
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.scss'],
})
export class EmployeeLeaveComponent implements OnInit {
  public columnDefs: any[];
  public rowData: Array<LeaveModel> = [];
  public years: Array<any>;
  public year: string;

  constructor(
    private leaveService: LeaveMasterService,
    private attendanceService: UserAttendanceDetailService
  ) {}

  ngOnInit(): void {
    this.years = this.attendanceService.fetchYears();
    this.year = new Date().getFullYear() + '';
    this.columnDefs = this.leaveService.prepareColumnForDashboardGrid();
    this.fetchLeave(this.year);
  }
  loadLeave() {
    this.fetchLeave(this.year);
  }

  fetchLeave(year) {
    this.leaveService
      .fetchLeaveBalanceData(0, year)
      .subscribe((response) => {
        if (response) {
          this.rowData = response.policys;
        }
      });
  }
}
