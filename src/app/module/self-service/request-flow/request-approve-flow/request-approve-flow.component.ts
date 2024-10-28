import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { Store } from '@ngrx/store';
import { currentUserMenuItems, requestApproveState } from 'src/app/store/app.state';
import { Menu } from 'src/app/store/model/usermanage.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestFlowService } from 'src/app/services/request-flow.service';
import { RequestApproveModel, RequestDetailEntity, RequestFlowModel, RequestPostPayload } from 'src/app/store/model/request.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { User } from 'src/app/store/model/login.model';
import { Observable } from 'rxjs';
import { Workflow } from 'src/app/store/model/workflow.model';
import { NotificationService } from 'src/app/common/notification.service';
import { requestLeve } from '../../../../store/model/request.model';
import { LeaveRequest } from 'src/app/store/model/LeaveRequest.model';
@Component({
  selector: 'app-request-approve-flow',
  templateUrl: './request-approve-flow.component.html',
  styleUrls: ['./request-approve-flow.component.scss']
})
export class RequestApproveFlowComponent implements OnInit {

  
  public columnDefs!: any[];
  public labelName = 'Undo';
  public headerdialogName= 'Action on Request';
  public rowData: Array<any>= [];
  public menuItems:Menu[]=[];
  public reqMenuList:any[] = [];
  public selectedMenu:number ;
  public requestWorkflowList:RequestFlowModel[] = [];
  public filteredStatusList:{key:string, value:number}[]= UI_CONSTANT.REQUESTSTATUS;
  public selectedStatus:any[];
  public selectRequestInfo:RequestFlowModel={} as RequestFlowModel;
  public fromDate:string;
  public toDate:string;
  datepickerConfig:Partial<BsDatepickerConfig>;
  public workflowID:number;
  public remarkDisplay=false;
  public displayApproveflow=false;
  public displayLeaveRequest=false;
  public flowHeaderName="Request Flow Detail";
  public InfoHeaderName="Request Data";
  private _currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public selectedValue:string;
  public reqRemarks:string =null;
  public flowList:any[];
  public workFlowAppList: Array<RequestDetailEntity>=null;
  public approveRejectObj:RequestPostPayload[]= [];
  public selectMultipleRow:RequestApproveModel[]=[];
  // public employee/ID:any;
  public isMultiRow=false;
  public employeeID:number;  
  public requestID:number;  
  userInfo: User;
  requestType: Array<{key:string,value:number, ID:number[]}>=UI_CONSTANT.REQUEST_MENU;
  leaveRequestInfo: LeaveRequest;
  public transactionID:number=0;
  public leaveRequestDiv:boolean=false;
  public PostButton:boolean;
  public disabledTxt:boolean;
  public gatepassRequestDiv:boolean=false;
  public requestStatus:string;
  public displayInfo:boolean;
  public displayGatePass:boolean;
  public displayPunchRequest=false;
  public PunchRequestDiv=false;
  public requestFlowID: number;
  public MenuItemssId:any;
  public MenuItemss:{key:string,value:number}[]=UI_CONSTANT.LEAVE_APPROVED;

  constructor(
    private confirmationService: ConfirmationService,
    private _store: Store<any>,
    private activatedRoute:ActivatedRoute,
    private requestService: RequestFlowService,
    private notificationService: NotificationService,
    private router:Router,
  ) { 
    this._currentUserSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
        this.currentUser = this._currentUserSubject.asObservable();
    this.datepickerConfig = Object.assign({}, { containerClass: 'theme-default', adaptivePosition:true,dateInputFormat: 'DD-MMM-YYYY' });
  }
  private getUserFromLocalStorage(): User {
    try {
      return JSON.parse(localStorage.getItem(UI_CONSTANT.ConstValue.CurrentUser)!);
    } catch (error) {
      return null!;
    }
  }

  ngOnInit(): void {

    this.router.routeReuseStrategy.shouldReuseRoute=()=>false;
    this.requestFlowID = this.activatedRoute.snapshot.params.id;
    this.requestService.setPunchRequestVisiblity(false);
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.fromDate = moment(new Date(y, m, 1), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    this.toDate = moment( new Date(y, m + 1, 0), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    this.selectedStatus = UI_CONSTANT.REQUESTSTATUS.filter(x=>x.value === 0);
    this.workflowID=1;
    this.selectedStatus = UI_CONSTANT.REQUESTSTATUS.slice(0,1);
    const statusArr= this.selectedStatus.map(x=>x.value);
    const reqStatus = statusArr.join('~');
    this.columnDefs = this.requestService.prepareColumnApproveForGrid();
    this.displayLeaveRequest=false;
    this.requestService.getflowVisiblity().subscribe(res=>{
      this.displayApproveflow = res;
    });
    this.currentUser.subscribe(res=>{
      if(res){
        this.userInfo = res;
        this.employeeID=this.userInfo.logOnUserDetail.employeeID;
        // console.log(this.employeeID);
      }
    });
    this.requestService.getVisiblity().subscribe(res=>{
      this.displayLeaveRequest = res;
    });
    this.requestService.getDisplayVisiblity().subscribe(res=>{
      this.displayInfo = res;
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
    this._store.select(currentUserMenuItems).subscribe(response=>{
      if(response){
        this.menuItems =response?.currentMenuItemsList.menuItems;
        const requestMenu:Menu = this.menuItems.find(x=> x.childs.find(y=>y.menuId === Number(this.activatedRoute.snapshot.params.id)));
        this.reqMenuList = requestMenu.childs.filter(z=> z.menuId === Number(this.activatedRoute.snapshot.params.id))[0].childs;
        this.selectedMenu= this.reqMenuList[0].menuId;
    }
  });
  this._store.select(requestApproveState).subscribe(res=>{
    if(res && res.RequestAppList){
      this.rowData = AppUtil.deepCopy(res.RequestAppList);
    } else{
      console.log('dddd');
      this.requestService.fetchRequestApproveData(this.workflowID,reqStatus,this.fromDate,this.toDate);
    }
  });
  }
  actionPerform(){
    console.log(this.selectMultipleRow,'ssss');
    if(this.selectMultipleRow.length>0){
      this.remarkDisplay = true;
      this.isMultiRow = true;
    } else{
      this.notificationService.showWarning("Please select Employee",null);
    }
  }
  getDetail(menu:Menu){
 //  var menuID= menu? menu.menuId : this.requestFlowID;
 const fDate = moment(new Date(this.fromDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
 const tDate = moment(new Date(this.toDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
// const reqType = this.requestType.filter(x=> x.ID.includes(menu.menuId))[0];
 this.workflowID=1;
 this.MenuItemssId=menu;
// this.selectedMenu=menu.menuId;
 this.selectedStatus = UI_CONSTANT.REQUESTSTATUS.slice(0,2);
 const statusArr= this.selectedStatus.map(x=>x.value);
 const reqStatus = statusArr.join('~');
 this.requestService.fetchRequestApproveData(this.MenuItemssId,reqStatus,fDate,tDate);
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === UI_CONSTANT.ACTIONS.REQUESTEDIT) {
        console.log(params.data)
        if(this.selectedMenu===134){
          console.log(params.data);
          this.employeeID=params.data.employeeID;
          this.gatepassRequestDiv=true;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          this.PostButton=false;
      this.disabledTxt=true;
          this.requestService.setGatePassVisibility(true);
        }
        else if(this.selectedMenu===128){
          this.leaveRequestDiv=true;
          this.employeeID=params.data.employeeID;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          console.log(this.requestID,this.transactionID);
          this.PostButton=false;
          this.disabledTxt=true;
          this.requestService.setLeaveRequestVisiblity(true);
        }
        else if(this.selectedMenu===129){
          this.leaveRequestDiv=true;
          this.employeeID=params.data.employeeID;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          console.log(this.requestID,this.transactionID);
          this.PostButton=false;
          this.disabledTxt=true;
          this.requestService.setLeaveRequestVisiblity(true);
        }
        else if(this.selectedMenu===131){
          this.leaveRequestDiv=true;
          this.employeeID=params.data.employeeID;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          console.log(this.requestID,this.transactionID);
          this.PostButton=false;
          this.disabledTxt=true;
          this.requestService.setPunchRequestVisiblity(true);
        }else if(this.selectedMenu===130){
          this.leaveRequestDiv=true;
          this.employeeID=params.data.employeeID;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          console.log(this.requestID,this.transactionID);
          this.PostButton=false;
          this.disabledTxt=true;
          this.requestService.setPunchRequestVisiblity(true);
        }
        
      }
  
      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.bankID == params.data.bankID);
            temdata.splice(index,1);
            // this.bankService.deleteCellFromRemote(params);
            this.rowData = temdata;
  
          },
          reject: (type) => {
              switch(type) {
                  case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                      // this.notificationService.showError('Comfirmation Rejected', null);
                  break;
                  case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                    // this.notificationService.showWarning('Comfirmation Canceled');
                  break;
              }
          }
      });
      }
  
      if (action === UI_CONSTANT.ACTIONS.REQUESTFLOW) {
        // params.api.stopEditing(false);
        this.requestService.setflowVisibility(true);
        this.requestService.fetchWorkflowRequestData(params.data.transactionID,this.userInfo.logOnUserDetail.employeeID).subscribe(data => {
         if(data){
          this.workFlowAppList = data.requestDetails.sort((a, b) => a.levelNumber - b.levelNumber);
         }
        });
        console.log('requestFlow',params);
      }
      if (action === UI_CONSTANT.ACTIONS.REQUESTINFO) {
        this.requestService.setVisibility(true);
      this.employeeID = params.data.employeeID;
              console.log('requestinfo',params);
      }
      if (action === UI_CONSTANT.ACTIONS.CANCEL) {
        params.api.stopEditing(true);
      }
      if (action === UI_CONSTANT.ACTIONS.ADD_REMARK) {
        this.remarkDisplay = true;
        this.selectRequestInfo = params.data;
        console.log(params,'----',this.selectRequestInfo);
      }
    }
  }
  filterStatus(e){
    const statusArr:any[] = AppUtil.deepCopy(UI_CONSTANT.REQUESTSTATUS);
  return this.filteredStatusList = statusArr.filter(x=> x.key.toLowerCase().includes(e.query.toLowerCase()));
  }
  checkUnCheckEmpAllClicked(chbSelectAll){
    if(chbSelectAll.checked){
     this.selectMultipleRow= this.rowData;
    }
    else{
      this.selectMultipleRow=[];
    }
}
 
checkUnCheckEmpRowClicked(params){
    if(params.isSelected){
      this.selectMultipleRow.push(params.data);
    }
    else{
      this.selectMultipleRow=this.selectMultipleRow.filter(e=>e.requestID!=params.data.requestID);
    }
}
  getData(){
    const fDate = moment(new Date(this.fromDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    const tDate = moment(new Date(this.toDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    const statusArr= this.selectedStatus.map(x=>x.value);
    const reqStatus = statusArr.join('~');
    console.log(statusArr.join('~'),'status');
    this.requestService.fetchRequestApproveData(this.workflowID,reqStatus,fDate,tDate);
  }
  SaveRemarkData(actionval,multiDel){
    const fDate = moment(new Date(this.fromDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    const tDate = moment(new Date(this.toDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);

    if(!multiDel){
    const payload = {
      transactionID: this.selectRequestInfo.transactionID,
      requestStatusID: actionval,
      workFlowID: this.selectRequestInfo.workFlowID,
      remark: this.reqRemarks,
      employeeID: this.selectRequestInfo.employeeID
    }
    this.requestService.approveEssRequest(payload, this.selectedStatus,this.workflowID, fDate, tDate);
  } else{
    var requests = [];
    this.selectMultipleRow.forEach(row=>{
      const payload = {
        transactionID: row.transactionID,
        requestStatusID: actionval,
        workFlowID: row.workFlowID,
        remark: this.reqRemarks,
        employeeID: row.employeeID
      }
      requests.push(payload);
    });
    const statusArr= this.selectedStatus.map(x=>x.value);
    const reqStatus = statusArr.join('~');
    this.requestService.approveMultipleEssRequest(requests,0,reqStatus,this.workflowID, fDate, tDate);
  }
    this.remarkDisplay = false;
    this.isMultiRow= !false;
    this.selectMultipleRow=[];
    this.approveRejectObj=[];
  }
  CancelRemarkData(isMultiRow){
 this.remarkDisplay = false;
 this.reqRemarks = null;
 this.selectMultipleRow=[];
this.approveRejectObj=[];
  }
  
  closeFlowPopup(event){
    this.requestService.setflowVisibility(event);
  }
 
  CancelleavePost(event){
    // console.log(event)
    this.requestService.setLeaveRequestVisiblity(event);
    this.leaveRequestDiv=false;
    this.getData();
  }
  closePopups(event){
    this.gatepassRequestDiv=false;
    this.requestService.setGatePassVisibility(event);
    this.getData();
  }
   //New  Changes
   closePunchPopup(event){
    this.PunchRequestDiv=false;
    this.requestService.setPunchRequestVisiblity(false);
    this.getData();
  } 
  //End
}
