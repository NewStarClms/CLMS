import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { VisitorAdminService } from 'src/app/services/visitor-admin.service';
import { selectEmployeeMasterState, selectGateState, selectVisitorAdminState, selectVisitorPassTemplateState, selectVisitorPurposeState, selectVisitorTypeState } from 'src/app/store/app.state';
import { VisitorAdmin, VisitorInOut } from 'src/app/store/model/visitorAdmin.model';
import * as moment from 'moment';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { Gate, VisitorPassTemplate, VisitorType, VisitPurpose } from '../../../store/model/master-data.model';
import { Router } from '@angular/router';
import { VisitorPassTemplateService } from 'src/app/services/visitor-pass-template.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-visitor-report',
  templateUrl: './visitor-report.component.html',
  styleUrls: ['./visitor-report.component.scss']
})
export class VisitorReportComponent implements OnInit {
  public reportParams: any = {
    fromtime: '',
    fromDate: '',
    toDate: '',
    totime: '',
    Vstatus: [],
    reportID: null
  }
  public statusList = UI_CONSTANT.STATUSLIST;
  public reportTypeOption = UI_CONSTANT.REPORT_VISITOR_TYPE;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  genderList: any;
  visitTypeList: any;


  constructor(
    private _store: Store<any>,
    private visitorAdminService: VisitorAdminService,
    private visitorpassService: VisitorPassTemplateService,
    private router: Router,
    private _sanitizer: DomSanitizer,
  ) {
    this.datepickerConfig = Object.assign({}, { containerClass: 'theme-default',adaptivePosition:true,
     dateInputFormat: 'DD-MMM-YYYY' });

  }

  ngOnInit(): void {
    console.log('report');
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.reportParams.fromDate = moment(new Date()).format('DD-MMM-YYYY');
    this.reportParams.toDate = moment(new Date()).format('DD-MMM-YYYY');
    this.reportParams.fromtime = '00:00';
    this.reportParams.totime = '23:59';
    this.reportParams.Vstatus = UI_CONSTANT.VISITOR_STATUS;
    this.reportParams.reportID = null;

  }

  getTime(event) {
    this.reportParams.fromtime = moment(event).format("HH:mm");
    // this.reportParams.fromDate = moment(this.reportParams.fromDate).format('yyyy-MM-DD') + 'T' + moment(event).format("HH:mm:ss");
  }
  gettoTime(event) {
    this.reportParams.totime = moment(event).format("HH:mm");
    // this.reportParams.toDate = moment(this.reportParams.toDate).format('yyyy-MM-DD') + 'T' + moment(event).format("HH:mm:ss");
  }
  updateDate(){
    console.log('date',this.reportParams);
  }
  getVisitorReport() {
    const params = {
      reportID: 0,
      fromDate: null,
      toDate: null,
      visitorStatusId: null,
      reportName: null
    }
    console.log('date',this.reportParams,moment(this.reportParams.fromDate).format("YYYY-MM-DDTHH:MM:SS"));
    params.reportID = this.reportParams.reportID;
    params.reportName = UI_CONSTANT.REPORT_VISITOR_TYPE.filter(i=> i.value === this.reportParams.reportID)[0].key;
    let resultstatus = this.reportParams.Vstatus.map(({ value }) => value);
    params.visitorStatusId = resultstatus.join('~');
    if (this.reportParams.fromDate != null) {
      const fromDate: Date = new Date(this.reportParams.fromDate);//  moment(this.reportParams.fromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
      params.fromDate = moment(this.reportParams.fromDate).format('yyyy-MM-DD') + 'T' + this.reportParams.fromtime;

    } else {
      params.fromDate = null
    }
    if (this.reportParams.toDate != null) {
      if (this.reportParams.toDate != null) {
        const toDate =  new Date(this.reportParams.fromDate);//moment(this.reportParams.toDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
        params.toDate = moment(this.reportParams.toDate).format('yyyy-MM-DD') + 'T' + this.reportParams.totime;
      } else {
        params.toDate = null
      }
    }
    this.visitorAdminService.downloadVisitorReport(params);
  }
  
  download(url, filename) {
    fetch(url).then(function(t) {
        return t.blob().then((b)=>{
            var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", filename);
            a.click();
        }
        );
    });
    }
  }
