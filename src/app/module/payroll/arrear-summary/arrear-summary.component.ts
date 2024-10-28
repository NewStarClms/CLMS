import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { ArrearService } from 'src/app/services/arrear.service';
import { ArrearDetail, ArrearSalaryPaidDetails, ArrearSalaryTotalDetails } from 'src/app/store/model/arrear.model';

@Component({
  selector: 'app-arrear-summary',
  templateUrl: './arrear-summary.component.html',
  styleUrls: ['./arrear-summary.component.scss']
})
export class ArrearSummaryComponent implements OnInit {
  @Input() employeeID: number;
  @Input() monthYear : string;
  @Output() close: EventEmitter<boolean> = new EventEmitter(false);
  public arrearDetail: ArrearDetail[] = [];
  public arrearSalaryPaidDetails:ArrearSalaryPaidDetails[] = [];
  public arrearSalaryTotalDetails:ArrearSalaryTotalDetails=null;
  public arrearSalaryTotalDetails_1:ArrearSalaryTotalDetails=null;
  public arrearSalaryPaidDetailsAddition: ArrearSalaryPaidDetails[];
  public arrearSalaryPaidDetailsDeduction: ArrearSalaryPaidDetails[];
  
  constructor(private arrearService: ArrearService) { }

  ngOnInit(): void {
  }
  ngOnChanges(change: SimpleChanges){
    this.arrearService.fetchEmployeeArrearDetail(this.employeeID,202324,
      this.monthYear,"",0).subscribe(res=>{
      if(res && res.employee){
        this.arrearDetail.push(AppUtil.deepCopy(res.employee.arrearDetails));
        this.arrearSalaryPaidDetails= AppUtil.deepCopy(res.employee.arrearPaidDetails);
        this.arrearSalaryPaidDetailsAddition=this.arrearSalaryPaidDetails.filter(x=>x.payComponentType === 'A');
        this.arrearSalaryPaidDetailsDeduction=this.arrearSalaryPaidDetails.filter(x=>x.payComponentType === 'D');
        this.arrearSalaryTotalDetails=AppUtil.deepCopy(res.employee.arrearSalaryTotalDetails);
        this.arrearSalaryTotalDetails_1=AppUtil.deepCopy(res.employee.arrearSalaryTotalDetails1);
      }
    })
  }
  closeDialog(){
    this.close.emit(false);
  }
}
