import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageInfo } from 'jspdf';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { ArrearService } from 'src/app/services/arrear.service';
import { AuthService } from 'src/app/services/authentication.service';
import { SalaryDashboardService } from 'src/app/services/salary-dashboard.service';
import { AttendanceProcess, EmployeeDetailList, EmployeeSalarySummaryDetail, SalaryProcess, SaveHoldRelease } from 'src/app/store/model/attendance-process.model';

@Component({
  selector: 'app-salary-dashboard',
  templateUrl: './salary-dashboard.component.html',
  styleUrls: ['./salary-dashboard.component.scss'],
})
export class SalaryDashboardComponent implements OnInit {
  public month;
  public holdMonth;
  public holdMonths;
  public holdYear;
  public year;
  public columnDefs!: any[];
  public rowData: Array<EmployeeDetailList> = [];
  public monthList = UI_CONSTANT.MONTH_LIST;
  public yearList = UI_CONSTANT.YEAR_LIST;
  public notificationList: Array<any> = [];
  public verficationList: Array<any> = [];
  public employeeSalarySummaryInfo = {} as EmployeeSalarySummaryDetail;
  // public arrearList:Array<any>=[];
  // public salaryProcessList:Array<any>=[];
  // public salaryreleaseList:Array<any>=[];
  // public salarypublisgList:Array<any>=[];
  public notiList: string;
  public maindetailDiv: boolean;
  public employeeListDetailprocessDIv: boolean;
  public employeeListDetailReleaseDiv: boolean;
  public salaryproInfo = {} as SalaryProcess;
  public salaryHoldReleaseInfo = {} as SaveHoldRelease;
  public requestRemark: string;
  public employeeListHeader: string;
  public totalRecordCount: number;
  public labeldeleteName: string;
  public pager: PageInfo;
  public selectedEmployees: Array<EmployeeDetailList> = [];
  public txtontxt: boolean;
  public aCompletedCount: string;
  public apendingCount: string;
  public atotalEmployeeCount: string;
  public deletebtn: boolean;
  public actiondropdown: boolean;
  public releaseaction: string;
  public releaseactionList = UI_CONSTANT.RELEASE_ACTION_R_H;
  public releasemonthyear: boolean;
  public releaseMonth;
  public releaseYear;

  public pCompletedCount: string;
  public ppendingCount: string;
  public ptotalEmployeeCount: string;

  public pubCompletedCount: string;
  public pubpendingCount: string;
  public pubtotalEmployeeCount: string;

  public paymentCompletedCount: string;
  public readytoreleaseCount: string;
  public holdCount: string;
  public settlementCount: string;

  public employeeID = 0;
  public labelName: string;
  public actiontype: string;
  public monthYear: string;
  public monthlySalaryDetaildiv: boolean;
  public monthlySalaryDetail: boolean;

  constructor(
    private salaryProcessServices: SalaryDashboardService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private arrearService: ArrearService,
    private router: Router,
    private authenticationService: AuthService,
    private coreService: AppCoreCommonService
  ) {}

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(true);
    this.year = this.coreService.getDefaultYearForReport();
    this.month = this.coreService.getDefaultMonthForReport();
    this.holdMonth=new Date().toLocaleString(
      'default',
      { month: 'short' }
    );
    this.holdMonths=this.holdMonth-1;
    this.holdYear=this.coreService.getDefaultYearForReport();
    this.employeeListDetailprocessDIv = false;
    this.employeeListDetailReleaseDiv = false;
    this.maindetailDiv = true;
    this.fngetData();
  }
  fngetData() {
    var datetime = '01-' + this.month + '-' + this.year;
    this.salaryProcessServices
      .fetchSalaryProcessData(datetime)
      .subscribe((res) => {
        if (res) {
          // console.log(res);
          this.fngetAllNotification(res);
        }
      });
  }
  fnDownloadData(groupId, sequenceNo) {
    var datetime = '01-' + this.month + '-' + this.year;
    this.salaryProcessServices.fetchProcessDownloadData(datetime, groupId, sequenceNo);
  }
  fnArrearProcess(flag){
    const monthyear =   this.month + '-' + this.year  ;
    this.arrearService.setArrearMonthYearValue(monthyear);
    this.router.navigate(['/payroll/arrear/'+flag]);
  }
  fngetAllNotification(res) {
    this.notificationList = [];
    this.verficationList = [];
    console.log;
    res.forEach((item) => {
      if (item.groupID == 0) {
        this.notificationList.push(item);
      } else if (item.groupID == 1) {
        this.verficationList.push(item);
      } else if (item.groupID == 2) {
        if (item.sequenceNo == 1) {
          this.aCompletedCount = item.countNo;
        }
        if (item.sequenceNo == 2) {
          this.apendingCount = item.countNo;
        }
        if (item.sequenceNo == 3) {
          this.atotalEmployeeCount = item.countNo;
        }
      } else if (item.groupID == 5) {
        if (item.sequenceNo == 1) {
          this.pCompletedCount = item.countNo;
        }
        if (item.sequenceNo == 2) {
          this.ppendingCount = item.countNo;
        }
        if (item.sequenceNo == 3) {
          this.ptotalEmployeeCount = item.countNo;
        }
      } else if (item.groupID == 6) {
        if (item.sequenceNo == 1) {
          this.paymentCompletedCount = item.countNo;
        }
        if (item.sequenceNo == 2) {
          this.readytoreleaseCount = item.countNo;
        }
        if (item.sequenceNo == 3) {
          this.holdCount = item.countNo;
        }
        if (item.sequenceNo == 4) {
          this.settlementCount = item.countNo;
        }
      } else if (item.groupID == 7) {
        if (item.sequenceNo == 1) {
          this.pubCompletedCount = item.countNo;
        }
        if (item.sequenceNo == 2) {
          this.pubpendingCount = item.countNo;
        }
        if (item.sequenceNo == 3) {
          this.pubtotalEmployeeCount = item.countNo;
        }
      }
    });
    console.log(this.notificationList);
  }
  Cloasepage() {
    this.actiondropdown = false;
    this.releasemonthyear = false;
    this.deletebtn = false;
    this.employeeListDetailprocessDIv = false;
    this.employeeListDetailReleaseDiv = false;
    this.maindetailDiv = true;
    this.releaseMonth = null;
    this.releaseYear = null;
    this.requestRemark="";
    //this.fngetData();
    this.selectedEmployees=[];
    this.salaryproInfo={} as SalaryProcess;
  }
  fnViewsalaryProcessData(actiontype, actionId) {
    this.employeeListDetailprocessDIv = true;
    this.employeeListDetailReleaseDiv = false;
    this.maindetailDiv = false;
    var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
    var monthNumber = month >9 ? month:'0'+month
    const monthyear=this.year+'-'+monthNumber+'-01T00:00:00';
    //const monthyear = this.year + '-' + this.month + '-01';

    if (actiontype == 'P') {
      this.columnDefs = this.salaryProcessServices.prepareColumnForGrid();
      if (actionId == 'A') {
        this.employeeListHeader =
          'Arrear Reprocess for the month 01-' + this.month + '-' + this.year;
        this.deletebtn = true;
        this.labeldeleteName = 'Delete Arrear';
        this.labelName = 'ReProcess';
      } else if (actionId == 'S') {
        this.employeeListHeader =
          'Salary Reprocess for the month 01-' + this.month + '-' + this.year;
        this.deletebtn = true;
        this.labeldeleteName = 'Delete Salary';
        this.labelName = 'ReProcess';
      } else if (actionId == 'R') {
        this.employeeListHeader =
          'Salary RePublish for the month 01-' + this.month + '-' + this.year;
        this.deletebtn = true;
        this.labeldeleteName = 'Delete';
        this.labelName = 'RePublish';
      }

      this.actiontype = 'P';
      this.salaryProcessServices
        .fetchEmployeeDetailforProcess(monthyear, this.employeeID)
        .subscribe((resl) => {
          if (resl && resl.data) {
            console.log(resl);
            this.rowData = AppUtil.deepCopy(resl?.data);
            this.totalRecordCount = AppUtil.deepCopy(resl?.totalRecords);
          }
        });
    } else {
      this.actiontype = 'U';
      this.columnDefs =
        this.salaryProcessServices.UnProcessprepareColumnForGrid();
      if (actionId == 'A') {
        this.labelName = 'Process';
        this.employeeListHeader =
          'Arrear Process for the month 01-' + this.month + '-' + this.year;
        this.deletebtn = false;
      } else if (actionId == 'S') {
        this.labelName = 'Process';
        this.employeeListHeader =
          'Salary Process for the month 01-' + this.month + '-' + this.year;
        this.deletebtn = false;
      } else if (actionId == 'R') {
        this.employeeListHeader =
          'Salary Publish for the month 01-' + this.month + '-' + this.year;
        this.deletebtn = false;
        this.labelName = 'Publish';
      }

      this.salaryProcessServices
        .fetchEmployeeDetailforUnProcess(monthyear, this.employeeID)
        .subscribe((response) => {
          if (response && response.data) {
            // console.log(response);
            this.rowData = AppUtil.deepCopy(response?.data);
            this.totalRecordCount = AppUtil.deepCopy(response?.totalRecords);
          }
        });
    }
  }
  fnViewSalaryReleaseData(actiontype, actionId) {
    this.employeeListDetailprocessDIv = false;
    this.employeeListDetailReleaseDiv = true;
    this.maindetailDiv = false;
    var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
    var monthNumber = month >9 ? month:'0'+month
    const monthyear=this.year+'-'+monthNumber+'-01T00:00:00';
   // const monthyear = this.year + '-' + this.month + '-01';
    this.columnDefs = this.salaryProcessServices.prepareColumnForGridRelease();

    this.actiontype=actiontype;
    this.releaseaction = actionId;
    if (actiontype == 'R') {
      this.columnDefs = this.salaryProcessServices.prepareColumnForGrid();
      this.employeeListHeader = 'Salary Release for the month 01-' + this.month + '-' + this.year;
      this.actiondropdown = false;
      this.releasemonthyear = false;
      this.labelName = 'Un-Release';
    } 
    else if (actiontype == 'U') {
      this.employeeListHeader ='Salary Release for the month 01-' + this.month + '-' + this.year;
      this.actiondropdown = true;
      this.releasemonthyear = false;
      this.labelName = 'Action';
      this.releaseactionList = UI_CONSTANT.RELEASE_ACTION_R_H;
    }
    else if (actiontype == 'H') {
      this.employeeListHeader ='Salary Hold for the month 01-' + this.month + '-' + this.year;
      this.actiondropdown = true;
      this.releasemonthyear = true;
      this.labelName = 'Action';
      this.releaseactionList=UI_CONSTANT.RELEASE_ACTION_R_U;
      this.releaseMonth= this.holdMonths;
      this.releaseYear = this.holdYear;
    }
    else if (actiontype == 'P') {
      this.employeeListHeader = 'Salary Publish for the month 01-' + this.month + '-' + this.year;
      this.actiondropdown = false;
      this.releasemonthyear = false;
      this.labelName = 'Re-Publish';
    }
    else if (actiontype == 'N') {
      this.employeeListHeader = 'Salary Publish for the month 01-' + this.month + '-' + this.year;
      this.actiondropdown = false;
      this.releasemonthyear = false;
      this.labelName = 'Publish';
    }
    if(actionId=="RS")   this.columnDefs = this.salaryProcessServices.prepareColumnForGridRelease();
    this.salaryProcessServices
      .fetchEmployeeDetailforHoldRelease(monthyear, this.actiontype)
      .subscribe((resultHold) => {
        if (resultHold && resultHold.data) {
          // console.log(response);
          this.rowData = AppUtil.deepCopy(resultHold?.data);
          this.totalRecordCount = AppUtil.deepCopy(resultHold?.totalRecords);
        }
      });
  }
  savesalaryProcess(actiontype) {
    let selectedEmployeeIDs = this.selectedEmployees
      .map((e) => e.employeeID)
      .join('~')
      .toString();
    let employeeIdes = selectedEmployeeIDs.split('~');
    this.salaryproInfo.employeeIdes = employeeIdes.map(Number);
    if (this.salaryproInfo.employeeIdes != null) {
      var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
      var monthNumber = month >9 ? month:'0'+month
      this.salaryproInfo.monthYear=this.year+'-'+monthNumber+'-01T00:00:00';
      this.salaryproInfo.remark = this.requestRemark;
      this.salaryproInfo.actionType = actiontype;

      //console.log(this.salaryproInfo);

      this.salaryProcessServices.saveSalaryProcess(this.salaryproInfo);
      this.Cloasepage();
    } else {
      this.notificationService.showError(
        'Please Select the employee',
        UI_CONSTANT.SEVERITY.ERROR
      );
    }
  }
  saveHoldReleasesalary(action) {
    let selectedEmployeeIDs = this.selectedEmployees
      .map((e) => e.employeeID)
      .join('~')
      .toString();
    let employeeIdes = selectedEmployeeIDs.split('~');
    this.salaryHoldReleaseInfo.employeeIdes = employeeIdes.map(Number);

    if (this.salaryHoldReleaseInfo.employeeIdes != null) {
      if ((this.releaseYear == undefined || this.releaseYear == null) && (this.releaseMonth == undefined || this.releaseMonth == null)) {
        var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
        var monthNumber = month >9 ? month:'0'+month
        this.salaryHoldReleaseInfo.monthYear = this.year + '-' + monthNumber + '-01T00:00:00';
      } 
      else {

        var month = new Date(`${this.releaseMonth} 1, ${this.releaseYear}`).getMonth() + 1;
        var monthNumber = month >9 ? month:'0'+month

        this.salaryHoldReleaseInfo.salaryHoldPayMonthYear = this.releaseYear + '-' + monthNumber + '-01T00:00:00';
        var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
        var monthNumber = month >9 ? month:'0'+month
        this.salaryHoldReleaseInfo.monthYear = this.year + '-' + monthNumber + '-01T00:00:00';
      }

      this.salaryHoldReleaseInfo.remark = this.requestRemark;
      this.salaryHoldReleaseInfo.actionType = action;
      if (this.releaseaction != null) {
        this.salaryHoldReleaseInfo.releaseType = this.releaseaction;
      }

      console.log(this.salaryHoldReleaseInfo);

      this.salaryProcessServices.saveSalaryHoldRelease(
        this.salaryHoldReleaseInfo
      );

      this.Cloasepage();

    } else {
      this.notificationService.showError(
        'Please Select the employee',
        UI_CONSTANT.SEVERITY.ERROR
      );
    }
  }

  onCellClicked(params) {
    if (
      params.column.colId === UI_CONSTANT.ACTIONS.ACTION &&
      params.event.path[1].dataset.action
    ) {
      let action = params.event.path[1].dataset.action;
      if (action === UI_CONSTANT.ACTIONS.DETAILVIEW) {
        console.log('params', params.data);
        this.employeeID = params.data.employeeID;
        var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
        var monthNumber = month >9 ? month:'0'+month
        this.monthYear =this.year+'-'+monthNumber+'-01T00:00:00';
        this.monthlySalaryDetaildiv = true;
        this.monthlySalaryDetail = true;
      }

      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.UNPROCESS_SALARY_CONFIRM_TEXT,
          header: 'Un-Process',
          icon: 'pi pi-info-circle',
          accept: () => {
            var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
            var monthNumber = month >9 ? month:'0'+month
            this.salaryproInfo.employeeIdes = [params.data.employeeID];
            this.salaryproInfo.monthYear =this.year+'-'+monthNumber+'-01T00:00:00';
            this.salaryProcessServices.saveSalaryUnProcess(this.salaryproInfo);
          },
          reject: (type) => {
            switch (type) {
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                this.notificationService.showError(
                  'Comfirmation Rejected',
                  null
                );
                break;
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                this.notificationService.showWarning(
                  'Comfirmation Canceled',
                  null
                );
                break;
            }
          },
        });
      }

      if (action === UI_CONSTANT.ACTIONS.REPROCESS) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.PROCESS_SALARY_CONFIRM_TEXT,
          header: 'Re-Process',
          icon: 'pi pi-info-circle',
          accept: () => {
            var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
            var monthNumber = month >9 ? month:'0'+month
            this.salaryproInfo.employeeIdes = [params.data.employeeID];
            this.salaryproInfo.monthYear = this.year+'-'+monthNumber+'-01T00:00:00';  
            this.salaryproInfo.remark = this.requestRemark;
            this.salaryproInfo.actionType = 'P';
            this.salaryProcessServices.saveSalaryProcess(this.salaryproInfo);
          },
          reject: (type) => {
            switch (type) {
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                this.notificationService.showError(
                  'Comfirmation Rejected',
                  null
                );
                break;
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                this.notificationService.showWarning(
                  'Comfirmation Canceled',
                  null
                );
                break;
            }
          },
        });
      }
    }
  }
  checkUnCheckAllClicked(chbSelectAll) {
    if (chbSelectAll.checked) {
      this.selectedEmployees = this.rowData;
    } else {
      this.selectedEmployees = [];
    }
  }

  checkUnCheckRowClicked(params) {
    if (params.isSelected) {
      this.selectedEmployees.push(params.data);
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        (e) => e.employeeID != params.data.employeeID
      );
    }
  }

  //New Changes
  deletesalaryProcess(actiontype) {
    let selectedEmployeeIDs = this.selectedEmployees.map((e) => e.employeeID).join('~').toString();
    let employeeIdes = selectedEmployeeIDs.split('~');
    this.salaryproInfo.employeeIdes = employeeIdes.map(Number);
    if (this.salaryproInfo.employeeIdes != null) {
      var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
      var monthNumber = month >9 ? month:'0'+month
    this.salaryproInfo.monthYear =this.year+'-'+monthNumber+'-01T00:00:00';  
    this.salaryproInfo.actionType = actiontype;
    this.salaryProcessServices.saveSalaryUnProcess(this.salaryproInfo);
    this.Cloasepage();
    }
    else{
      this.notificationService.showError(
        'Please Select the employee',
        UI_CONSTANT.SEVERITY.ERROR
      );
    }
  }
  //End

  getLongDate(month, year) {
    var months = new Date(`${month} 1, ${year}`).getMonth() + 1;
    if (months < 10) {
      var monthNumber = '0' + months;
    }
    const datetime = this.year + '-' + monthNumber + '-01T00:00:00';
    return datetime;
  }
  CloaseSalary() {
    this.employeeSalarySummaryInfo = {} as EmployeeSalarySummaryDetail;
    this.monthlySalaryDetaildiv = false;
    this.monthlySalaryDetail = false;
  }
}
