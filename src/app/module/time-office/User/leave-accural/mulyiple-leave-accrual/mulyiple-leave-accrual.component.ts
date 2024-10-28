import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { LeaveaccrualServiceService } from 'src/app/services/leaveaccrual-service.service';
import { LeaveAccrual } from 'src/app/store/model/laeveAcurral.model';

@Component({
  selector: 'app-mulyiple-leave-accrual',
  templateUrl: './mulyiple-leave-accrual.component.html',
  styleUrls: ['./mulyiple-leave-accrual.component.scss']
})
export class MulyipleLeaveAccrualComponent implements OnInit {

  @Output() multipleLeaveAccrualdiv = new EventEmitter<boolean>();
  public yearList=UI_CONSTANT.YEAR_LIST;
  public leaveaccrualYear:string;
  public monthList=UI_CONSTANT.MONTH_LIST;
  public leaveaccrualmonth:string;
  public leaveaccrualInfo: LeaveAccrual = {} as LeaveAccrual;
  public accrualTypeList=UI_CONSTANT.ACCRUAL_TYPE;
  public accuralAutoManual:string;
  public accrualType:string;
  

  constructor(private leaveAccrualService:LeaveaccrualServiceService) { }

  ngOnInit(): void {
    this.accuralAutoManual='Auto';
    this.accrualType='M';
    const currentyear = new Date().getFullYear();
    this.leaveaccrualYear=currentyear.toString();
    this.leaveaccrualmonth = (new Date()).toLocaleString('default', { month: 'short' });
    // this.getLeaveAccrualList();
  }
  SaveleaveaacrualPostData(){
    var accrDate = this.leaveaccrualYear+'-'+((new Date().getMonth())+1)+'-01T00:00:00';
      this.leaveaccrualInfo.employeeID=0
      this.leaveaccrualInfo.accrualDate=accrDate;
      this.leaveaccrualInfo.accrualType=this.accrualType;
      this.leaveaccrualInfo.xmlLeaveAccrual='';
      this.leaveaccrualInfo.openingBalance=0;
      this.leaveAccrualService.saveLeaveAccrualSingle(this.leaveaccrualInfo);
      this.Cancelleaveaccrual();
  }
  Cancelleaveaccrual(){
    this.leaveaccrualInfo = {} as LeaveAccrual;
    this.multipleLeaveAccrualdiv.emit(false);
  }
 
  
}
