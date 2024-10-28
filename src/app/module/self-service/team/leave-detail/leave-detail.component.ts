import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';
import { AuthService } from 'src/app/services/authentication.service';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { TeamDetailService } from 'src/app/services/team-detail.service';
import { LeaveBalance } from 'src/app/store/model/LeaveRequest.model';

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.scss']
})
export class LeaveDetailComponent implements OnInit {
  public columnDefs!: any[];
  public rowData:Array<LeaveBalance>=[];
  public year:string;
  public getDataildiv:boolean;
  //public employeeID:number=0;
  public yearList=UI_CONSTANT.YEAR_LIST;
  public dropdownSettings:IDropdownSettings={};
  public selectedEmployee:any={};
  public employeeSerchList:any[];
  
  constructor(private leaveRequestService : LeaveRequestService,
    private authenticationService:AuthService,
    private appSearchService: AppSearchCommonService,
    private notificationService:NotificationService,
    private teamDetailService : TeamDetailService) { 
      
    }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.getDataildiv=false;
    console.log((new Date()).getFullYear());
    const numberYear= (new Date()).getFullYear();
    this.year = numberYear.toString();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'employeeID',
      textField: 'displayName',
      itemsShowLimit: 1,
      allowSearchFilter: true
    }
    this.teamDetailService.fetchTeamDetailData().subscribe(res=>{
      if(res && res){
        this.employeeSerchList=[];
        this.employeeSerchList=AppUtil.deepCopy(res);
      }
    });
  }
 getData(){
   if(this.selectedEmployee && this.selectedEmployee[0].employeeID != 0){
    this.getDataildiv=true;
    this.columnDefs = this.leaveRequestService.perpareColumnForGridforLeaveBalance();
    
    this.leaveRequestService.fetchLeaveBalanceData(this.selectedEmployee[0].employeeID,this.year).subscribe(res=>{
      if(res && res){
          this.rowData = AppUtil.deepCopy(res);
      }
    });
   }else{
    this.notificationService.showError("Please Select Employee",UI_CONSTANT.SEVERITY.ERROR);
   }
 }
  onCellClicked(params){
    
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
       
      }
    }
  }
  // onGetEmployeeDetail(event){
  //   //this.employeeID = event.data;
  // }
}
