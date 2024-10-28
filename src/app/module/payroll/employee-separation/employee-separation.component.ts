import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { EmployeeSeparationService } from 'src/app/services/employee-separation.service';
import { EmployeeSeparation, EmployeeSeparationDetail, EmployeeSettlementDetail } from 'src/app/store/model/employee-separation.model';

@Component({
  selector: 'app-employee-separation',
  templateUrl: './employee-separation.component.html',
  styleUrls: ['./employee-separation.component.scss']
})
export class EmployeeSeparationComponent implements OnInit {
  
  datepickerConfig: Partial<BsDatepickerConfig>;
  empStatusList: Array<any>=UI_CONSTANT.EMPLOYEE_STATUS;
  searchDateTypeList: Array<any>=UI_CONSTANT.SEARCH_DATE_TYPE_LIST;
  selectedStatus:number;
  selectedSearchDateType:any;
  searchDate:any=null;
  rowData: Array<EmployeeSeparation>=[];
  columnDefs: any;
  showSeparationPopup: boolean= false;
  showSettlementPopup: boolean= false;
  employeeSeparationDetail:EmployeeSeparationDetail;
  employeeSettlementDetail: EmployeeSettlementDetail;
  changeDetectorRef: any;
  public fromDate:string;
  public toDate:string;

  constructor(private separationService: EmployeeSeparationService,
    private notificationService:NotificationService) {
    this.datepickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      rangeInputFormat: 'DD-MMM-YYYY',
      adaptivePosition: true,
      initCurrentTime: false
    });

    
    this.separationService.getSeparationPopupVisibility().subscribe(res =>{
      this.showSeparationPopup = res;
    });
    this.separationService.getSettlementPopupVisibility().subscribe(res =>{
      this.showSettlementPopup = res;
    });
   }

  ngOnInit(): void {
    this.columnDefs=this.separationService.prepareColumnForGrid();
  }


  loadEmployeeList(){
    if(this.searchDate != null){
      this.fromDate = moment(this.searchDate[0], UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+'T00:00';
      this.toDate = moment(this.searchDate[1], UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DD")+'T00:00';
    }else{
      this.fromDate=null;
      this.toDate=null;
    }
    if(this.selectedSearchDateType !="" && (this.fromDate==null || this.toDate==null)){
      this.notificationService.showError('Please enter date', UI_CONSTANT.SEVERITY.ERROR);
    }
    else{
      this.separationService.fetchEmployeeList(this.selectedStatus, this.selectedSearchDateType, this.fromDate, this.toDate).subscribe(data => {
        if(data && data.employees){
          var empData = AppUtil.deepCopy(data.employees);
          if(empData){
            empData.forEach(emp => {
              emp.joiningDate=emp.joiningDate !='0001-01-01T00:00:00'?moment(emp.joiningDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT):"";
              emp.leavingDate=emp.leavingDate !='0001-01-01T00:00:00'?moment(emp.leavingDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT):"";
              emp.resignationDate=emp.resignationDate !='0001-01-01T00:00:00'?moment(emp.resignationDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT):"";
            });
            this.rowData=empData;
          }
        }
      });
    }
  }

  onCellClicked(params){
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      if (action === "separation") {
        this.separationService.fetchEmployeeSeparationDetail(params.data.employeeID).subscribe((res)=>{
          this.separationService.setSeparationPopupVisibility(true);
          if(res && res.employee){
            this.employeeSeparationDetail=AppUtil.deepCopy(res.employee);
            if (this.employeeSeparationDetail.joiningDate != null  && moment(this.employeeSeparationDetail.joiningDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
              this.employeeSeparationDetail.joiningDate = moment(this.employeeSeparationDetail.joiningDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
            }
            else this.employeeSeparationDetail.joiningDate=null;
            if (this.employeeSeparationDetail.leavingDate != null && moment(this.employeeSeparationDetail.leavingDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
              this.employeeSeparationDetail.leavingDate = moment(this.employeeSeparationDetail.leavingDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
            }
            else this.employeeSeparationDetail.leavingDate=null;
            if (this.employeeSeparationDetail.resignationDate != null && moment(this.employeeSeparationDetail.resignationDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
              this.employeeSeparationDetail.resignationDate = moment(this.employeeSeparationDetail.resignationDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
            }
            else this.employeeSeparationDetail.resignationDate =null;
          }
        })
      }
      else if(action==="settlement"){
        this.separationService.fetchEmployeeSettlementDetail(params.data.employeeID).subscribe((res)=>{
          this.separationService.setSettlementPopupVisibility(true);
          if(res && res.employee){
             this.employeeSettlementDetail=AppUtil.deepCopy(res.employee);
             if (this.employeeSettlementDetail.joiningDate != null  && moment(this.employeeSettlementDetail.joiningDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
              this.employeeSettlementDetail.joiningDate = moment(this.employeeSettlementDetail.joiningDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
            }
            else this.employeeSettlementDetail.joiningDate=null;
            if (this.employeeSettlementDetail.leavingDate != null && moment(this.employeeSettlementDetail.leavingDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
              this.employeeSettlementDetail.leavingDate = moment(this.employeeSettlementDetail.leavingDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
            }
            else this.employeeSettlementDetail.leavingDate=null;
            if (this.employeeSettlementDetail.resignationDate != null && moment(this.employeeSettlementDetail.resignationDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
              this.employeeSettlementDetail.resignationDate = moment(this.employeeSettlementDetail.resignationDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
            }
            else this.employeeSettlementDetail.resignationDate =null;
            if (this.employeeSettlementDetail.settlementDate != null && moment(this.employeeSettlementDetail.settlementDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT)!="01-Jan-0001") {
              this.employeeSettlementDetail.settlementDate = moment(this.employeeSettlementDetail.settlementDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
            }
            else this.employeeSettlementDetail.settlementDate =null;
          }else{
            this.employeeSettlementDetail= <EmployeeSettlementDetail>{};
          }
        })
      }
     //this.changeDetectorRef.detectChanges();
    }
  }
  closePopUp(event){
    this.separationService.setSeparationPopupVisibility(event);
    this.separationService.setSettlementPopupVisibility(event);
  }
}
