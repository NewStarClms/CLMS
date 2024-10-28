import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Constants } from 'ag-grid-community';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { EmployeeSeparationService } from 'src/app/services/employee-separation.service';
import { EmployeeSeparationDetail, EmployeeSettlementDetail } from 'src/app/store/model/employee-separation.model';

@Component({
  selector: 'app-settlement-dialog',
  templateUrl: './settlement-dialog.component.html',
  styleUrls: ['./settlement-dialog.component.scss']
})
export class SettlementDialogComponent implements OnInit {
  @Input() employeeSettlementDetail: EmployeeSettlementDetail;
  @Input() selectedStatusID: number;
  datepickerConfig: Partial<BsDatepickerConfig>;
  empStatusList: Array<any>=UI_CONSTANT.EMPLOYEE_STATUS.filter(s=>s.key=="Relieved" || s.key=="Settled");
  noticePeridTypeList:Array<any>=[{value:"D",key:"Day"}, {value:"M",key:"Month"}];
  noticePayTypeList:Array<any>=[{value:"R",key:"Recovery"}, {value:"P",key:"Payout"}];
  reasonList:Array<any>=[{value:1,key:"Retirement"}, {value:2,key:"Relieved"}];
  payMonths:Array<any>= [
    { value: 1, key: 'JAN' },
    { value: 2, key: 'FEB' },
    { value: 3, key: 'MAR' },
    { value: 4, key: 'APR' },
    { value: 5, key: 'MAY' },
    { value: 6, key: 'JUN' },
    { value: 7, key: 'JUL' },
    { value: 8, key: 'AUG' },
    { value: 9, key: 'SEP' },
    { value: 10, key: 'OCT' },
    { value: 11, key: 'NOV' },
    { value: 12, key: 'DEC' }
 ];
  payYears:Array<any>=[];
  selectedPayMonth:any=0;
  selectedPayYear:any=0;
  
  constructor(
    private separationService : EmployeeSeparationService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService) {
      this.datepickerConfig = Object.assign({}, {
        containerClass: 'theme-default',
        dateInputFormat: 'DD-MMM-YYYY',
        adaptivePosition: true,
        initCurrentTime: false
      });
     }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChange) {
    this.payYears=this.generateArrayOfYears();
    if(this.employeeSettlementDetail.leavingDate){
       this.selectedPayYear = moment(this.employeeSettlementDetail.leavingDate, UI_CONSTANT.SHORT_DATE_FORMAT).toDate().getFullYear();
       this.selectedPayMonth = moment(this.employeeSettlementDetail.leavingDate, UI_CONSTANT.SHORT_DATE_FORMAT).toDate().getMonth()+1;
    }
    else{
      this.selectedPayYear= new Date().getFullYear();
      this.selectedPayMonth = new Date().getMonth()+1;
   }
  }

  saveEmployeeSettlementDetail(){
  if(this.selectedStatusID==5)//settlement, delete option will be visible
   { 
     this.confirmationService.confirm({
      message: "Are you sure you want to delete this settlment request?",
      header: 'Delete Settlement',
      icon: 'pi pi-info-circle',
      accept: () => {
         //todo: delete settlement request
         this.notificationService.showError(
          'Implementation pending',
          "NA"
        );
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
    else{
        var tempEmpSettlementDetail: EmployeeSettlementDetail = AppUtil.deepCopy(this.employeeSettlementDetail);
        if (tempEmpSettlementDetail.joiningDate != null) {
          tempEmpSettlementDetail.joiningDate = moment(this.employeeSettlementDetail.joiningDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
        }
        if (tempEmpSettlementDetail.leavingDate != null) {
          tempEmpSettlementDetail.leavingDate = moment(this.employeeSettlementDetail.leavingDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
        }
        if (tempEmpSettlementDetail.resignationDate != null) {
          tempEmpSettlementDetail.resignationDate = moment(this.employeeSettlementDetail.resignationDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
        }
        if (tempEmpSettlementDetail.settlementDate != null) {
          tempEmpSettlementDetail.settlementDate = moment(this.employeeSettlementDetail.settlementDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
        }
        var monthYearDate = new Date(this.selectedPayYear,this.selectedPayMonth,1);
        tempEmpSettlementDetail.settlementMonthYear=moment(monthYearDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");;
        this.separationService.saveEmployeeSettlementDetail(tempEmpSettlementDetail);
    }
  }

  closeDialog(){
    this.separationService.setSettlementPopupVisibility(false);
  }

  keyPressNumeric(event) {
    AppUtil.validateNumbers(event);
  }
  public  generateArrayOfYears() {
    var max = new Date().getFullYear()+1
    var min = max - 2
    var years = []
  
    for (var i = max; i >= min; i--) {
      years.push({"value": i, "key": i})
    }
    return years
  }
}
