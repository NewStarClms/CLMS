import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';
import { AuthService } from 'src/app/services/authentication.service';
import { TeamDetailService } from 'src/app/services/team-detail.service';
import { AttendanceDetailReport, AttendanceSummaryReport } from 'src/app/store/model/team-detail.model';

@Component({
  selector: 'app-team-attendance',
  templateUrl: './team-attendance.component.html',
  styleUrls: ['./team-attendance.component.scss']
})
export class TeamAttendanceComponent implements OnInit {
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public columnDefssummary!: any[];
  public rowDatasummary:Array<AttendanceSummaryReport>=[];
  public columnDefsreport!: any[];
  public rowDatareport:Array<AttendanceDetailReport>=[];
  public ReportID:string;
  public attDate;
  public fromDate:string;
  public toDate:string;
  public getDatasummarydiv:boolean;
  public employeeSerchList:any[];
  //public employee:Array<any>=[];
  public employeeID:any;
  public getDatareportdiv:boolean;
  public dropdownSettings:IDropdownSettings={};
  public selectedEmployees:Array<any>=[];
 
  constructor(private teamDetailService : TeamDetailService,
    private authenticationService:AuthService,
    private appSearchService: AppSearchCommonService,
    private notificationService:NotificationService,) { 
      this.datepickerConfig = Object.assign({}, {
        containerClass: 'theme-default',
        rangeInputFormat: 'DD-MMM-YYYY',
        adaptivePosition: true,
        initCurrentTime: false
      });
    }

  ngOnInit(): void {

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
    var lastDay = new Date(date.getFullYear(), date.getMonth()-0,0);
    this.attDate = [ firstDay, lastDay];

    this.authenticationService.setGlobalFilterVisibility(false);
    this.getDatareportdiv=false;
    this.getDatasummarydiv=false;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'employeeID',
      textField: 'displayName',
      itemsShowLimit: 2,
      allowSearchFilter: true
    }
    this.teamDetailService.fetchTeamDetailData().subscribe(res=>{
      if(res && res){
        this.employeeSerchList=[];
        this.employeeSerchList=AppUtil.deepCopy(res);
      }
    });
    this.ReportID='1';
    this.getData();
  }
  getData(){
    if(this.selectedEmployees != undefined){
      this.employeeID = this.selectedEmployees.map(({ employeeID }) => employeeID).join('~');
      }
  
      if(this.employeeID!=0)
      {
        if(this.attDate== null){
          this.notificationService.showError('Please Select Date', UI_CONSTANT.SEVERITY.ERROR);
        }
        else{
      this.fromDate = moment(this.attDate[0], UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+'T00:00';
      this.toDate = moment(this.attDate[1], UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+'T00:00';
      console.log('employeeId',this.employeeID,'reportid',this.ReportID,'fordate',this.fromDate,'todate',this.toDate)
      if(this.ReportID == '2'){
        this.getDatareportdiv=false;
        this.getDatasummarydiv=true;
        this.columnDefssummary = this.teamDetailService.prepareColumnForAttendanceSummaryReportGrid();
        this.teamDetailService.fetchAttendanceSummaryReportData(this.employeeID,this.fromDate,this.toDate).subscribe(res=>{
          if(res && res){
            this.rowDatasummary=[];
            this.rowDatasummary=AppUtil.deepCopy(res);
            console.log(this.rowDatasummary);
          }
        });
      }else{
        this.getDatareportdiv=true;
        this.getDatasummarydiv=false;
        this.columnDefsreport = this.teamDetailService.prepareColumnForAttendanceDetailReportGrid();
        this.teamDetailService.fetchAttendanceDetailReportData(this.employeeID,this.fromDate,this.toDate).subscribe(res=>{
          if(res && res){
            this.rowDatareport=[];
            this.rowDatareport=AppUtil.deepCopy(res);
          }
        });
      } 
        }
      }
     
      else{
        this.notificationService.showError('Please Select Employee', UI_CONSTANT.SEVERITY.ERROR);
        this.rowDatasummary=[];
      }
   
   }
  onCellClicked(params){
    
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
       
      }
    }
  }
  // searchData(event) {
  //   this.appSearchService.getFilteredEmployee(event.query).subscribe(data => {
  //     if(data && data.searchData){
  //     this.employeeSerchList = data.searchData;
      
  //     }
  //   });
  // }
}
