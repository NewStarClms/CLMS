import { Component, OnInit } from '@angular/core';
import { HolidayService } from 'src/app/services/holiday.service';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { HolidayMaster } from 'src/app/store/model/holidayMaster.model';

@Component({
  selector: 'app-employee-holiday',
  templateUrl: './employee-holiday.component.html',
  styleUrls: ['./employee-holiday.component.scss'],
})
export class EmployeeHolidayComponent implements OnInit {
  public columnDefs: any[];
  public rowData: Array<HolidayMaster> = [];
  public years: Array<any>;
  public year: string;
  constructor(
    private holidayService: HolidayService,
    private attendanceService: UserAttendanceDetailService
  ) {}

  ngOnInit(): void {
    this.columnDefs = this.holidayService.prepareDashboardGridColumns();
    this.years = this.attendanceService.fetchYears();
    this.year = new Date().getFullYear() + '';
    this.fetchHoliday(this.year);
  }
  loadHoliday() {
    this.fetchHoliday(this.year);
  }

  fetchHoliday(year) {
    this.holidayService
      .fetchEmployeeHolidays(0, year)
      .subscribe((response) => {
        if (response) {
          this.rowData = response.policys;
        }
      });
  }
}
