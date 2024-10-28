import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { AttendanceProcessService } from 'src/app/services/attendance-process.service';
import { AuthService } from 'src/app/services/authentication.service';
import { AttendanceProcess, AttendanceProcessEmployeeDetail, EmployeeDetailList } from 'src/app/store/model/attendance-process.model';
import { PageInfo } from 'src/app/store/model/pageinfo.model';

@Component({
  selector: 'app-attendance-process',
  templateUrl: './attendance-process.component.html',
  styleUrls: ['./attendance-process.component.scss']
})
export class AttendanceProcessComponent implements OnInit {
  public columnDefs!: any[];
  public rowData: Array<EmployeeDetailList>= [];
  public month;
  public year;
  public monthList=UI_CONSTANT.MONTH_LIST;
  public yearList=UI_CONSTANT.YEAR_LIST;
  public notificationList:Array<any>=[];
  public verficationList:Array<any>=[];
  public arrearList:Array<any>=[];
  public attendanceProcessList:Array<any>=[];
  public notiList:string;
  public maindetailDiv:boolean;
  public employeeListDetailDIv:boolean;
  public requestRemark:string;
  public totalRecordCount: number;
  public pager: PageInfo;
  public selectedEmployees: Array<EmployeeDetailList>=[];
  public txtontxt:boolean;
  public processCompletedCount:string;
  public pendingCount:string;
  public totalEmployeeCount:string;
  public employeeID = 0;
  public attProcessInfo = {} as AttendanceProcess;
  public labelName:string;
  public actiontype:string;
  public deletebtn:boolean;

  constructor(private attendanceProcessServices : AttendanceProcessService,
    private authenticationService:AuthService,
    private notificationService:NotificationService,
    private commonService: AppCoreCommonService,
    private route:Router) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(true);
    this.year=this.commonService.getDefaultYearForReport();
    this.month =this.commonService.getDefaultMonthForReport();
    this.employeeListDetailDIv=false;
    this.maindetailDiv=true;
   this.fngetData();
   this.attendanceProcessServices.getRefreshGridData().subscribe(res=>{
      if(res){
        this.fnViewAttendaceProcessData(this.actiontype);
      }
   });
  }
  fnDownloadData(groupId,sequenceNo){
    // var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
    // if(month <10){
    //  var monthNumber = '0'+month;
    // }
  const datetime = '01-'+this.month+'-'+this.year//this.year+'-'+monthNumber+'-01T00:00:00';
    this.attendanceProcessServices.fetchProcessDownloadData(datetime,groupId,sequenceNo);
  }
  fngetData(){
    // var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
    //   if(month <10){
    //    var monthNumber = '0'+month;
    //   }
    const datetime = '01-'+this.month+'-'+this.year//this.year+'-'+monthNumber+'-01T00:00:00';
    this.attendanceProcessServices.fetchAttendanceProcessData(datetime).subscribe(res=>{
      if(res){
        // console.log(res);
        this.fngetAllNotification(res);
      }
    });
  }
  fngetAllNotification(alllist){
    this.notificationList=[];
    this.verficationList=[];
    this.arrearList=[];
    this.attendanceProcessList=[];
    const tempallList = AppUtil.deepCopy(alllist);
    // console.log(tempallList);
   if(tempallList){
    tempallList.forEach(item => {
      if(item.groupID == 0){
        this.notificationList.push(item);
      }
      else if(item.groupID == 1){
        this.verficationList.push(item);
      }
      else if(item.groupID == 2){
        this.arrearList.push(item);
      }
      else if(item.groupID == 3){
     
       if(item.sequenceNo == 1){
        this.processCompletedCount = item.countNo;
       }
       if(item.sequenceNo == 2){
        this.pendingCount = item.countNo;
       }
       if(item.sequenceNo == 3){
        this.totalEmployeeCount = item.countNo;
       }
      }
     });
   }
   
  }
  fnViewAttendaceProcessData(txt){
    if(txt!=undefined){
      this.employeeListDetailDIv=true;
      this.maindetailDiv=false;
      const monthyear = '01-'+this.month+'-'+this.year;
      this.columnDefs=this.attendanceProcessServices.prepareColumnForGrid();
      if(txt == 'P'){
        this.labelName="ReProcess";
        this.actiontype='P';
        this.deletebtn=true;
        this.attendanceProcessServices.fetchEmployeeDetailforProcess(monthyear,this.employeeID).subscribe(resl=>{
          if(resl && resl.data){
            console.log(resl);
            this.rowData = AppUtil.deepCopy(resl?.data);
          this.totalRecordCount=AppUtil.deepCopy(resl?.totalRecords);
          }
        });
      }else{
        this.labelName="Process";
        this.actiontype='U';
        this.deletebtn=false;
        this.attendanceProcessServices.fetchEmployeeDetailforUnProcess(monthyear,this.employeeID).subscribe(response=>{
          if(response && response.data){
            // console.log(response);
            this.rowData = AppUtil.deepCopy(response?.data);
          this.totalRecordCount=AppUtil.deepCopy(response?.totalRecords);
          }
      });
      }
    }else{
      this.maindetailDiv=true;
    }
  }
  Cloasepage(){
   
    this.employeeListDetailDIv=false;
    this.maindetailDiv=true;
    this.fngetData();
  }
  onLazyLoadGridData(params){
    //this.pager=params;
    //let selectedGroupsList = this.selectedUserGroups.map(u=>u.userGroupID).join('~').toString();
    // if(selectedGroupsList=='')
    //   selectedGroupsList="0";
    // if(params.searchKeyword=='' || params.searchKeyword.length>=3){
    //   this.employeeUserGroupService.fetchEmployeesUserGroupData(params,selectedGroupsList);
    // }
  }
  onCellClicked(params){
    // let action=params.event.path[1].dataset.action;
    // if(action == UI_CONSTANT.ACTIONS.PWDRESET)
    //  this.employeeUserGroupService.resetEmployeePwd(params.data.employeeCode);
    //  else if (action == UI_CONSTANT.ACTIONS.TOGGLEESS)
    //  this.employeeUserGroupService.toggleEssAccess(params.data.employeeID);
    // return false;
  }
  checkUnCheckAllClicked(chbSelectAll){
    if(chbSelectAll.checked){
     this.selectedEmployees= this.rowData;
    }
    else{
      this.selectedEmployees=[];
    }
   }
 
   checkUnCheckRowClicked(params){
     if(params.isSelected){
       this.selectedEmployees.push(params.data);
     }
     else{
       this.selectedEmployees=this.selectedEmployees.filter(e=>e.employeeID!=params.data.employeeID);
     }
   }
   saveAttendanceProcess(actiontype){
    let selectedEmployeeIDs = this.selectedEmployees.map(e=>e.employeeID).join('~').toString();
    let employeeIdes = selectedEmployeeIDs.split('~');
    this.attProcessInfo.employeeIdes = employeeIdes.map(Number);
    if( this.attProcessInfo.employeeIdes!= null){
    var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
    var monthNumber = month >9 ? month:'0'+month
    this.attProcessInfo.monthYear=this.year+'-'+monthNumber+'-01T00:00:00';
    this.attProcessInfo.remark = this.requestRemark;
    this.attProcessInfo.actionType = actiontype;
    
    //console.log(this.attProcessInfo);
    this.attendanceProcessServices.saveAttendanceProcess(this.attProcessInfo);
    
    }else{
      this.notificationService.showError("Please Select the employee", UI_CONSTANT.SEVERITY.ERROR);
    }
    
   }
   deleteAttendanceProcess(actiontype){
    let selectedEmployeeIDs = this.selectedEmployees.map(e=>e.employeeID).join('~').toString();
    let employeeIdes = selectedEmployeeIDs.split('~');
    this.attProcessInfo.employeeIdes = employeeIdes.map(Number);
    if(this.requestRemark != undefined && this.attProcessInfo.employeeIdes!= null){
      
      // var month = new Date(`${this.month} 1, ${this.year}`).getMonth() + 1;
      // if(month <10){
      //  var monthNumber = '0'+month;
      // }
      //console.log(monthNumber)
      this.attProcessInfo.monthYear='01-'+this.month+'-'+this.year//this.year+'-'+monthNumber+'-01T00:00:00';
    this.attProcessInfo.remark = this.requestRemark;
    this.attProcessInfo.actionType = actiontype;
    
    // console.log(this.attProcessInfo);
    
      this.attendanceProcessServices.saveAttendanceUnProcess(this.attProcessInfo);
    
    }else{
      this.notificationService.showError("Please Enter the Remark or Select the employee", UI_CONSTANT.SEVERITY.ERROR);
    }
   }
}
