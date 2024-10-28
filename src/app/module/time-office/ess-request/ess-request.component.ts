import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { AuthService } from 'src/app/services/authentication.service';
import { RequestFlowService } from 'src/app/services/request-flow.service';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import { WorkflowService } from 'src/app/services/workflow.service';
import { User } from 'src/app/store/model/login.model';
import { RequestDetailEntity, RequestFlowModel } from 'src/app/store/model/request.model';
import { ESSRequestModel, Workflow, WorkFlowRequest } from 'src/app/store/model/workflow.model';

@Component({
  selector: 'app-ess-request',
  templateUrl: './ess-request.component.html',
  styleUrls: ['./ess-request.component.scss'],
})
export class EssRequestComponent implements OnInit {
  workflowOptionList: Array<{ key: string; value: number }> = [];
  requestTypeList: Array<WorkFlowRequest> = [];
  rowData: Array<ESSRequestModel> = [];
  columnDefs: Array<any> = [];
  moduleID: number = 1;
  //public workflowID:number;
  public selectedRequestType;
  public selectedWorkFlow;
  public workflowList: Array<Workflow> = [];
  public filteredStatusList:{key:string, value:number}[]= UI_CONSTANT.REQUESTSTATUS;
  public selectedStatus: number|0;
  public isPendingRequest: boolean|0;
  public fromDate:any;
  public toDate:any;
  datepickerConfig:Partial<BsDatepickerConfig>;
  private _currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public employeeID:number;  
  public requestID:number;  
  public transactionID: number;
  public requestStatus: any;
  public PostButton: boolean;
  public disabledTxt: boolean;
  userInfo: User;
  public workFlowAppList: Array<RequestDetailEntity>=null;
  public displayApproveFlow: boolean=false;
  public reqRemarks:string =null;
  public remarkDisplay=false;
  //public selectRequestInfo:RequestFlowModel={} as RequestFlowModel;
  public displayLeaveRequestInfo: boolean=false;
  public leaveRequestDiv:boolean=false;
  public gatepassRequestDiv: boolean=false;
  public displayGatePass:boolean;
  public displayPunchRequest=false;
  public displayLeaveRequest=false;
  public approveRejectRemarkDialog=false;
  public selectedRequests: Array<ESSRequestModel> = [];
  @Input() FromDate:string;
  @Input() ToDate:string;
  @Output() essRequestmultidiv = new EventEmitter<boolean>(false);

  constructor(
    private workflowService: WorkflowService,
    private _store: Store<any>,
    private notificationService: NotificationService,
    private router: Router,
    private authenticationService: AuthService,
    private requestService: RequestFlowService,
    public appCoreCommonService: AppCoreCommonService,
    private userAttendanceDetailService : UserAttendanceDetailService,
    private activatedRoute:ActivatedRoute,
  ) {
    this._currentUserSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
    this.currentUser = this._currentUserSubject.asObservable();
    //this.fromDate=new Date('Wed Feb 01 2017 09:57:51 GMT+0530 (India Standard Time)');
    //this.toDate=new Date('Mon Jul 31 2023 09:57:54 GMT+0530 (India Standard Time)');
  }

  ngOnInit(): void {

    //New Changes
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth()-1);
    var lastDay = new Date(date.getFullYear(), date.getMonth()-0, 0);
  //  this.fromDate=moment(firstDay).format('DD-MMM-YYYY');
  //  this.toDate=moment(lastDay).format('DD-MMM-YYYY') ;
    this.fromDate=moment(this.FromDate).format('DD-MMM-YYYY');
    this.toDate=moment(this.ToDate).format('DD-MMM-YYYY');
    //End

    this.datepickerConfig = Object.assign({}, { containerClass: 'theme-default', adaptivePosition:true,dateInputFormat: 'DD-MMM-YYYY' });
    this.columnDefs=this.userAttendanceDetailService.prepareColumnForESSRequestGrid();
    this.authenticationService.setGlobalFilterVisibility(true);
    this.workflowService
      .getWorkflowList(this.moduleID)
      .subscribe((flowList) => {
        if (flowList.workFlows) {
          this.workflowList = AppUtil.deepCopy(flowList.workFlows);
          this.workflowList.map((y) => {
            this.workflowOptionList.push({
              key: y.workFlowModuleName,
              value: y.workFlowModuleID,
            });
          });
          this.selectedWorkFlow=1;
          this.prepareRequestType(this.selectedWorkFlow);
        }
      });

      this.currentUser.subscribe(res=>{
        if(res){
          this.userInfo = res;
          this.employeeID=this.userInfo.logOnUserDetail.employeeID;
        }
      });
      this.requestService.getflowVisiblity().subscribe(res=>{
        this.displayApproveFlow = res;
      });
      this.requestService.getVisiblity().subscribe(res=>{
        this.displayLeaveRequestInfo = res;
      });
      this.requestService.getGatePassVisiblity().subscribe(res=>{
        this.displayGatePass = res;
      });
      this.requestService.getLeaveRequestVisiblity().subscribe(res=>{
        this.displayLeaveRequest = res;
      });
      this.requestService.getPunchRequestVisiblity().subscribe(res=>{
        this.displayPunchRequest = res;
      });
      this.requestService.getRemarkVisiblity().subscribe(res=>{
        this.approveRejectRemarkDialog = res;
      });
      this.userAttendanceDetailService.refreshESSRequestGrid().subscribe(res=>{
        this.rowData=res;
      });
  }
  private getUserFromLocalStorage(): User {
    try {
      return JSON.parse(localStorage.getItem(UI_CONSTANT.ConstValue.CurrentUser)!);
    } catch (error) {
      return null!;
    }
  }
  getRequesTypeList(e) {
    this.prepareRequestType(e);
  }
  prepareRequestType(modid) {
    this.requestTypeList = [];
    this.requestTypeList = this.workflowList.filter(
      (c) => c.workFlowModuleID === this.selectedWorkFlow
    )[0].workFlows;

  }
 
  onCellClicked(params){
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      this.leaveRequestDiv=false;
      this.gatepassRequestDiv=false;
      this.displayPunchRequest=false;
      this.displayLeaveRequest=false;
      this.displayGatePass=false;
      if (action === UI_CONSTANT.ACTIONS.REQUESTEDIT) {
        if(this.selectedRequestType===UI_CONSTANT.RequestType.GatePassRequest
          || this.selectedRequestType===UI_CONSTANT.RequestType.GatePassCancel ){
          this.employeeID=params.data.employeeID;
          this.gatepassRequestDiv=true;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.selectedRequestType=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          this.PostButton=false;
          this.disabledTxt=true;
          this.requestService.setGatePassVisibility(true);
        }
        else if(this.selectedRequestType===UI_CONSTANT.RequestType.LeaveRequest 
          || this.selectedRequestType===UI_CONSTANT.RequestType.LeaveCancel 
          ){
          this.leaveRequestDiv=true;
          this.employeeID=params.data.employeeID;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.selectedRequestType=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          console.log(this.requestID,this.transactionID);
          this.PostButton=false;
          this.disabledTxt=true;
          this.requestService.setLeaveRequestVisiblity(true);
        }
        else if(this.selectedRequestType===UI_CONSTANT.RequestType.PunchRegularization
          || this.selectedRequestType===UI_CONSTANT.RequestType.PunchCancel){
          this.leaveRequestDiv=true;
          this.employeeID=params.data.employeeID;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.selectedRequestType=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          console.log(this.requestID,this.transactionID);
          this.PostButton=false;
          this.disabledTxt=true;
          this.requestService.setPunchRequestVisiblity(true);
        }
        
      }

      if (action === UI_CONSTANT.ACTIONS.REQUESTFLOW) {
        this.requestService.setflowVisibility(true);
        this.requestService.fetchWorkflowRequestData(params.data.transactionID,this.userInfo.logOnUserDetail.employeeID).subscribe(data => {
         if(data) this.workFlowAppList = data.requestDetails.sort((a, b) => a.levelNumber - b.levelNumber);
        });
      }
      if (action === UI_CONSTANT.ACTIONS.REQUESTINFO) {
        this.requestService.setVisibility(true);
        this.employeeID = params.data.employeeID;
      }
    }
  }

  getWorkflowData() {
    this.selectedRequests=[];
    if(!this.fromDate || !this.toDate){
      this.notificationService.showError("From or To date is missing","Date not selected");
      return;
    }
    this.isPendingRequest= this.selectedStatus==0;
    if(!this.isPendingRequest){
     var columnDefs= AppUtil.deepCopy(this.userAttendanceDetailService.prepareColumnForESSRequestGrid());
     this.columnDefs=columnDefs.slice(1);
    } 
    else this.columnDefs=this.userAttendanceDetailService.prepareColumnForESSRequestGrid();
      //New Changes
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const fromDate= this.fromDate?moment(firstDay).format('DD-MMM-YYYY'):null;
      const toDate= this.toDate?moment(lastDay).format('DD-MMM-YYYY'):null;
      //End
   // const fromDate =this.fromDate? moment(this.fromDate, UI_CONSTANT.LONG_DATE_FORMAT).format("MM-DD-YYYY"):null;
   // const toDate =this.toDate? moment(this.toDate, UI_CONSTANT.LONG_DATE_FORMAT).format("MM-DD-YYYY"): null;
    //this.workflowID=this.workflowObj.workFlowID;
    this.userAttendanceDetailService.fetchESSRequestDataForAdmin(this.selectedRequestType,this.selectedStatus, fromDate,toDate);
  }
  closeFlowPopup(event){
    this.requestService.setflowVisibility(event);
  }
  closeRequestInfoPopup(event){
    this.requestService.setVisibility(event);
  }
  closePunchPopup(event){
    this.requestService.setPunchRequestVisiblity(false);
  } 
  closeGatePassPopup(event){
    this.requestService.setGatePassVisibility(event);
  }
  closeLeavePost(event){
    this.requestService.setLeaveRequestVisiblity(event);
  }
  closeApproveRejectDialog(){
    this.requestService.setRemarkVisibility(false);
  }
  goBack(){
    this.essRequestmultidiv.emit(false);
   // this.router.navigate(['/time-office/attendance-detail'+"/"+this.activatedRoute.snapshot.params.id]);
  }

  openActionPopup(){
    if(this.selectedRequests && this.selectedRequests.length>0)
        this.requestService.setRemarkVisibility(true);
    else
       this.notificationService.showWarning("Please select record(s) to approve first.", "No Record selected");
  }

  checkUnCheckAllClicked(chbSelectAll) {
    if (chbSelectAll.checked) {
      this.selectedRequests = this.rowData;
    } else {
      this.selectedRequests = [];
    }
  }

  checkUnCheckRowClicked(params) {
    if (params.isSelected) {
      this.selectedRequests.push(params.data);
    } else {
      this.selectedRequests = this.selectedRequests.filter(
        (e) => e.transactionID != params.data.transactionID
      );
    }
  }

  SaveRemarkData(actionval){
    const fromDate =this.fromDate? moment(this.fromDate, UI_CONSTANT.LONG_DATE_FORMAT).format("MM-DD-YYYY"):null;
    const toDate =this.toDate? moment(this.toDate, UI_CONSTANT.LONG_DATE_FORMAT).format("MM-DD-YYYY"): null;
    var requests = [];
    if(this.selectedRequests && this.selectedRequests.length > 0){
      this.selectedRequests.forEach(row=>{
        const payload = {
          transactionID: row.transactionID,
          requestStatusID: actionval,
          workFlowID: this.selectedRequestType,
          remark: this.reqRemarks,
          employeeID: row.employeeID
        }
        requests.push(payload);
      });
      this.userAttendanceDetailService.approveRejectESSRequestByAdmin(requests,0, this.selectedStatus, fromDate, toDate);
      this.selectedRequests=[];
      this.reqRemarks="";
    }
  }
}
