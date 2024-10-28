import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import '@fullcalendar/core/vdom';
import {
  CalendarOptions,
  EventInput,
  FullCalendarComponent,
} from '@fullcalendar/angular';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import tippy from 'tippy.js';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeAttendanceComponent implements OnInit {
  public events: EventInput[] = [];
  public months: Array<any>;
  public years: Array<any>;
  public month: string;
  public year: string;
  public headerLabel = '';
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: false,
  };
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  constructor(private attendanceService: UserAttendanceDetailService) {}

  ngOnInit(): void {
    this.initCalendar();
    this.setCalendarHeader(0,0,0,0,0,'',0);
    this.years = this.attendanceService.fetchYears();
    this.months = this.attendanceService.fetchMonths();
    this.year = new Date().getFullYear() + '';
    this.month = new Date().getMonth() + 1 + '';
    var lastDayOfMonth = new Date(
      Number(this.year),
      Number(this.month),
      0
    ).getDate();
    this.bindCalendar(
      this.year + '-' + this.month + '-01',
      this.year + '-' + this.month + '-' + lastDayOfMonth
    );
  }
  handleEventMouseEnter(info) {
    tippy(info.el, {
      content: info.event.extendedProps.description,
      allowHTML: true,
      theme: 'light',
    });
  }

  loadAtttendance() {
    var fromDate = this.year + '-' + this.month + '-01';
    var lastDayOfMonth = new Date(
      Number(this.year),
      Number(this.month),
      0
    ).getDate();
    this.bindCalendar(
      fromDate,
      this.year + '-' + this.month + '-' + lastDayOfMonth
    );
  }

  bindCalendar(fromDate, toDate) {
    this.attendanceService
      .fetchEmployeeAttendance(0, fromDate, toDate)
      .subscribe((response) => {
        this.events = [];
        if (response && response.punches && response.punches.attendances) {
          response.punches.attendances.forEach((element) => {
            const event: EventInput = {
              title: element.status,
              start: new Date(element.attendanceDate),
              end: new Date(element.attendanceDate),
              allDay: false,
              color: element.colorCode,
              customRender: true,
              description: this.getFormattedToolip(
                element,
                response.punches.summary
              ),
            };
            this.events.push(event);
          });
          this.initCalendar();
          let calendarApi = this.calendarComponent.getApi();
          if(calendarApi){
             calendarApi.gotoDate(new Date(fromDate));
          }
        }

        if (response && response.punches && response.punches.summary) {
         
          this.setCalendarHeader(response.punches.summary.present
                                ,response.punches.summary.absent
                                ,response.punches.summary.leave
                                ,response.punches.summary.weeklyoff
                                ,response.punches.summary.holiday
                                ,response.punches.summary.otosFlag
                                ,response.punches.summary.extraWork);
        }
       
      });
  }
  
  setCalendarHeader(presentDays, absentDays,leaveCount,weekoffCount,holidayCount,otosFlag,extraWork){
    this.headerLabel = '';
    this.headerLabel +='<span class="badge bg-present"><b>Present</b>' + presentDays + '</span>';
    this.headerLabel +='<span class="badge bg-absent"><b>Absent</b>' + absentDays + '</span>';
    this.headerLabel +='<span class="badge bg-leave"><b>Leave</b>' + leaveCount +'</span>';
    this.headerLabel += '<span class="badge bg-weekoff"><b>Weeklyoff</b>' + weekoffCount +'</span>';
    this.headerLabel +='<span class="badge bg-holiday"><b>Holiday</b>' + holidayCount + '</span>';
    if (otosFlag == 'O') {
      this.headerLabel += '<span class="badge bg-overtime"><b>Over Time </b>' + extraWork +'</span>';
    } 
    else if (otosFlag == 'S') {
      this.headerLabel +='<span class="badge bg-overtime"><b>Over Stay </b>' + extraWork +'</span>';
    }
  }

  initCalendar(){
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      initialDate: new Date(),
      showNonCurrentDates: false,
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      headerToolbar: false,
      events: this.events,
      fixedWeekCount: false,
      displayEventTime: false,
      weekends: true,
      eventMouseEnter: this.handleEventMouseEnter.bind(this),
      contentHeight: 305,
    };
  }

  getFormattedToolip(attendance, summary) {
    let msg =
      '<div class="tippy-popper"> <div class="tippy-tooltip" data-placement="top">' +
      '<table class="tippy-content">' +
      '<tr><td colspan="2" class="tippy-hdrText"><b>' +
      attendance.shiftView +
      '</b></td></tr>' +
      '<tr>' +
      '<td>In Time :</td> <td>' +
      attendance.inTime +
      '</td></tr>' +
      '<tr>' +
      '<td>Out Time :</td><td>' +
      attendance.outTime +
      '</td></tr>' +
      '<tr>' +
      '<td>Working Hours :</td><td> ' +
      attendance.workingHours +
      '</td></tr>' +
      '<tr>' +
      '<td>Status :</td><td>' +
      attendance.status +
      '</td></tr>';
    if (summary.otosFlag == 'O') {
      msg =
        msg +
        '<tr>' +
        '<td>Over Time :</td><td>' +
        attendance.extraWork +
        '</td></tr>';
    } else if (summary.otosFlag == 'S') {
      msg =
        msg +
        '<tr>' +
        '<td>Over Stay :</td><td>' +
        attendance.extraWork +
        '</td></tr>';
    }
    msg =
      msg +
      '<tr>' +
      '<td>Late Arrival :</td><td>' +
      attendance.lateArrival +
      '</td></tr>' +
      '<tr>' +
      '<td>Early Departure :</td><td>' +
      attendance.earlyDeparture +
      '</td></tr>' +
      '</table>' +
      '</div></div>';
    return msg;
  }
}
