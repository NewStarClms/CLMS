import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { EmployeeSeparationService } from 'src/app/services/employee-separation.service';
import { EmployeeSeparationDetail } from 'src/app/store/model/employee-separation.model';

@Component({
  selector: 'app-separation-dialog',
  templateUrl: './separation-dialog.component.html',
  styleUrls: ['./separation-dialog.component.scss']
})
export class SeparationDialogComponent implements OnInit {
  @Input() employeeSeparationDetail: EmployeeSeparationDetail;
  datepickerConfig: Partial<BsDatepickerConfig>;
  empStatusList: Array<any>=UI_CONSTANT.EMPLOYEE_STATUS;
  noticePeridTypeList:Array<any>=[{value:"D",key:"Day"}, {value:"M",key:"Month"},];
  noticePayTypeList:Array<any>=[{value:"R",key:"Recovery"}, {value:"P",key:"Payout"},];
  
 
  constructor(
    private separationService : EmployeeSeparationService) {
      this.datepickerConfig = Object.assign({}, {
        containerClass: 'theme-default',
        dateInputFormat: 'DD-MMM-YYYY',
        adaptivePosition: true,
        initCurrentTime: false
      });
     }

  ngOnInit(): void {
  }

  saveEmployeeSeparationDetail(){
    var tempEmpSeparationDetail: EmployeeSeparationDetail = AppUtil.deepCopy(this.employeeSeparationDetail);
    if (tempEmpSeparationDetail.joiningDate != null) {
      tempEmpSeparationDetail.joiningDate = moment(this.employeeSeparationDetail.joiningDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if (tempEmpSeparationDetail.leavingDate != null) {
      tempEmpSeparationDetail.leavingDate = moment(this.employeeSeparationDetail.leavingDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if (tempEmpSeparationDetail.resignationDate != null) {
      tempEmpSeparationDetail.resignationDate = moment(this.employeeSeparationDetail.resignationDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    tempEmpSeparationDetail.remark=tempEmpSeparationDetail.separationRemark;
    this.separationService.saveEmployeeSeparationDetail(tempEmpSeparationDetail);
  }
  closeDialog(){
    this.separationService.setSeparationPopupVisibility(false);
  }

  keyPressNumeric(event) {
    AppUtil.validateNumbers(event);
  }
}
