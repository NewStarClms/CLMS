import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { ArrearService } from 'src/app/services/arrear.service';
import {
  ArrearRequest,
  UnProcessArrearRequest,
} from 'src/app/store/model/arrear.model';

@Component({
  selector: 'app-arrear',
  templateUrl: './arrear.component.html',
  styleUrls: ['./arrear.component.scss'],
})
export class ArrearComponent implements OnInit {
  public pageTitle: string = '';
  public requestRemark: string = '';
  public columnDefs!: any[];
  public rowData: Array<any> = [];
  public selectedArrears: Array<any> = [];
  public actiontype: string = '';
  public labelDeleteName: string = 'Delete';
  public deletebtn: boolean = false;
  public processBtnName: string = '';
  public arrearMonthYear: string = '';
  public displayArrearPopup: boolean = false;
  public employeeId: number = 0;
  public flag: string="";

  constructor(
    private router: Router,
    private activateRouter: ActivatedRoute,
    private arrearService: ArrearService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.flag = this.activateRouter.snapshot.params.flag;
    if (this.flag == 'P') {
      this.columnDefs = this.arrearService.prepareColumnForProcessGrid();
      this.processBtnName = 'ReProcess';
      this.deletebtn = true;
      this.labelDeleteName = 'Delete Arrear';
      this.pageTitle = 'Arrear Reprocess for the month ' + this.arrearMonthYear;
    } else {
      this.columnDefs = this.arrearService.prepareColumnForPendingGrid();
      this.processBtnName = 'Process';
    }
    this.arrearService.getArrearMonthYearValue().subscribe((res) => {
      if (res) {
        this.arrearMonthYear = res;
        this.pageTitle = 'Arrear process for the month ' + this.arrearMonthYear;
        this.arrearService
          .fetchEmployeeArrearList(0, this.arrearMonthYear, this.flag)
          .subscribe((res) => {
            this.rowData = res.employees;
          });
      }
    });
    this.arrearService.getEmployeeArrearList().subscribe((res) => {
      if (res) {
        this.rowData = res;
      }
    });
    if (!this.arrearMonthYear || this.arrearMonthYear == '') this.closePage();
  }

  processArrear(flag) {
    if (this.selectedArrears && this.selectedArrears.length > 0) {
      this.confirmationService.confirm({
        message: 'Do you want to process selected record(s)?',
        header: 'RE-PROCESS',
        icon: 'pi pi-info-circle',
        accept: () => {
          let selectedEmployeeIDs = this.selectedArrears
        .map((e) => e.employeeID)
        .join('~')
        .toString();
         this.reProcessArrearRequest(selectedEmployeeIDs, flag);
        },
        reject: (type) => {
          //close dialog
        },
      });
     
    } else {
      this.notificationService.showError(
        'Please select a row first.',
        UI_CONSTANT.SEVERITY.WARNING
      );
    }
  }

  deleteArrear(flag) {
    if (this.selectedArrears && this.selectedArrears.length > 0) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          let selectedEmployeeIDs = this.selectedArrears
        .map((e) => e.employeeID)
        .join('~')
        .toString();
         this.unProcessArrearRequests(selectedEmployeeIDs);
        },
        reject: (type) => {
          //close dialog
        },
      });
     
    } else {
      this.notificationService.showError(
        'Please select a row first.',
        UI_CONSTANT.SEVERITY.WARNING
      );
    }
  }
  closePage() {
    this.router.navigate(['/payroll/salary-dashboard']);
  }
  closeDailog() {
    this.displayArrearPopup = false;
  }
  onCellClicked(params) {
    if (
      params.column.colId === UI_CONSTANT.ACTIONS.ACTION &&
      params.event.path[1].dataset.action
    ) {
      let action = params.event.path[1].dataset.action;
      if (action === UI_CONSTANT.ACTIONS.DETAILVIEW) {
        this.employeeId = params.data.employeeID;
        this.displayArrearPopup = true;
      } else if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.employeeId = params.data.employeeID;
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex(
              (item) => item.employeeID == params.data.employeeID
            );
            temdata.splice(index, 1);
            this.rowData = temdata;
            this.unProcessArrearRequests(params.data.employeeID.toString());
          },
          reject: (type) => {
            //close dialog
          },
        });
      } else if (action === UI_CONSTANT.ACTIONS.REPROCESS) {
        this.employeeId = params.data.employeeID;
        this.confirmationService.confirm({
          message: 'Do you want to reprocess selected record(s)?',
          header: 'RE-PROCESS',
          icon: 'pi pi-info-circle',
          accept: () => {
            this.reProcessArrearRequest(params.data.employeeID.toString(), 'P');
          },
          reject: (type) => {
            //close dialog
          },
        });
      }
    }
  }

  reProcessArrearRequest(employeeIDs, actionType) {
    var request: ArrearRequest = {} as ArrearRequest;
    request.employeeList = employeeIDs;
    request.actionType = actionType;
    request.arrearType = 'A';
    request.executeManual = false;
    request.monthYear = this.arrearMonthYear;
    request.remark = this.requestRemark;
    this.arrearService.processArrearRequest(request);
  }

  unProcessArrearRequests(employeeIDs) {
    let unprocessRequest = {} as UnProcessArrearRequest;
    unprocessRequest.employeeList = employeeIDs;
    unprocessRequest.arrearType = 'A';
    unprocessRequest.monthYear = this.arrearMonthYear;
    unprocessRequest.dataChangeStageID = 0; //TODO: check
    this.arrearService.UnprocessArrearRequest(unprocessRequest);
  }

  checkUnCheckAllClicked(chbSelectAll) {
    if (chbSelectAll.checked) {
      this.selectedArrears = this.rowData;
    } else {
      this.selectedArrears = [];
    }
  }

  checkUnCheckRowClicked(params) {
    if (params.isSelected) {
      this.selectedArrears.push(params.data);
    } else {
      this.selectedArrears = this.selectedArrears.filter(
        (e) => e.employeeID != params.data.employeeID
      );
    }
  }
}
