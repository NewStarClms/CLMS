import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DownloadService } from 'src/app/services/download.service';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { AttendanceStatsDownload } from 'src/app/store/model/userActionAttendanceDetail.model';

@Component({
  selector: 'app-employee-attendance-stats',
  templateUrl: './employee-attendance-stats.component.html',
  styleUrls: ['./employee-attendance-stats.component.scss']
})
export class EmployeeAttendanceStatsComponent implements OnInit {
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public headerName:string="";
  public showPopup:boolean=false;
  public rowData: Array<AttendanceStatsDownload>=[];
  public columnDefs: any;
  public report:string='';
  @ViewChild('reportGrid') reportGrid;
  public attendance: any = {
    present: 0,
    absent: 0,
    leave: 0,
    wo: 0,
    holiday:0,
    lateArrival:0,
    earlyDeparture:0,
    joinEmployee:0,
    totalEmployee:0,
    rosterNotCreated:0,
    odCount:0,
    pGatePassTime:'00:00',
    oGatePassTime:'00:00'
  };
  fromDate: string;
  constructor(private attendanceService: UserAttendanceDetailService, private downloadService: DownloadService) {
    this.datepickerConfig = Object.assign(
      {},
      {
        containerClass: 'theme-default',
        adaptivePosition: true,
        dateInputFormat: 'DD-MMM-YYYY',
      }
    );
  }

  ngOnInit(): void {
    this.columnDefs=this.attendanceService.prepareColumnForDownload();
    this.fromDate = moment(new Date()).format('DD-MMM-YYYY');
    this.attendanceService.getPopupVisibility().subscribe(res=>{
      this.showPopup = res;
    });
    this.fetchAttendanceStats(this.fromDate);
  }
  loadAttendanceStats(){
    const curDate = moment(this.fromDate).format('yyyy-MM-DD') + ' 00:00';
    if (curDate) {
      this.fetchAttendanceStats(curDate);
    }
    
  }

  fetchAttendanceStats(fromDate){
    this.attendanceService
    .fetchEmployeeAttendanceStats(fromDate)
    .subscribe((response) => {
      if(response && response.statistics){
        this.attendance=response.statistics;
      }
    });

  }

  openDialog(title,report){
    this.headerName=title;
    this.report=report;
    this.rowData=[];
    const curDate = moment(this.fromDate).format('yyyy-MM-DD');
    this.attendanceService.fetchEmployeeAttendanceStatsDownload(curDate,report).subscribe((response) => {
      if(response && response.statistics){
        this.rowData=response.statistics;
      }
      this.headerName=title;
      this.attendanceService.setPopupVisibility(true);
      this.headerName=title;
    });
    
  }

  download(report, type='EXCEL'){
    const curDate = moment(this.fromDate).format('yyyy-MM-DD');
    if(report !=this.report){//if view report is already clicked, then just download the data
      this.report=report;
      this.attendanceService.fetchEmployeeAttendanceStatsDownload(curDate,report).subscribe((response) => {
        if(response && response.statistics){
          this.rowData=response.statistics;
        }
        this.callDownload(type,report+curDate,report +" report as on "+ curDate);
      });
    }else{
      this.callDownload(type,report+curDate,report +" report as on "+ curDate);
    }
    
  }
  downloadView(type){
    if(type=='') type="EXCEL";
    this.download(this.report,type);
  }

  callDownload(type,report, heading){
    if(type=='PDF'){
      var cols = [{header: "SNo",dataKey:'sNo'},
      {header: "Employee Code",dataKey:"employeeCode"},
      {header: "Employee Name",dataKey:'employeeName'},
      {header: "Company", dataKey:'company'},
      {header: "Department", dataKey:"department"},
      {header: "Section", dataKey:"section"}];
      this.downloadService.downloadPDF(cols,this.rowData,report, heading);
    }
    else if(type=="EXCEL"){
      let header=[["SNo","Employee Code","Employee Name","Company","Department","Section"]];
      this.downloadService.downloadExcel(header,this.rowData,report);
    }
  }

}
