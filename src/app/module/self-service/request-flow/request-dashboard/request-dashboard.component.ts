import { Component, OnInit } from '@angular/core';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { Store } from '@ngrx/store';
import { currentUserMenuItems, requestState, selectLeaveMasterState } from 'src/app/store/app.state';
import { Menu } from 'src/app/store/model/usermanage.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestFlowService } from 'src/app/services/request-flow.service';
import { RequestDetailEntity, RequestFlowModel, requestLeve } from 'src/app/store/model/request.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { User } from 'src/app/store/model/login.model';
import { Observable } from 'rxjs';
import { LeaveModel } from '../../../../store/model/master-data.model';

@Component({
  selector: 'app-request-dashboard',
  templateUrl: './request-dashboard.component.html',
  styleUrls: ['./request-dashboard.component.scss']
})
export class RequestDashboardComponent implements OnInit {

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
  public employeeID:number;
  public remarkDisplay=false;
  public displayflow=false;
  public displayInfo=false;
  public displayGatePass=false;
 // public flowHeaderName="Request Flow Detail";
  public InfoHeaderName="Request Data";
  private _currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public selectedValue:string;
  public leaveRequest:requestLeve={} as requestLeve;
  public reqRemarks:string = null;
  public workFlowList:Array<RequestDetailEntity>=null;
  public transactionID:number=0;
  public requestID:number=0;
  public leaveRequestDiv:boolean=false;
  public PostButton:boolean;
  public disabledTxt:boolean;
  userInfo: User;
  public leaveDetail:LeaveModel[];
  public leaveTypeList:Array<{key:string;value:string}>=[];
  public requestType: Array<{key:string;value:number, ID:number[]}>=UI_CONSTANT.REQUEST_MENU;
  public displayLeaveRequest=false;
  public displayPunchRequest = false;
  public gatepassRequestDiv:boolean=false;
  public requestStatus:string;
  public addNewBtn:boolean=true;

  public flowHeaderName:string;
  public requestFlowID: number;


  constructor(
    private confirmationService: ConfirmationService,
    private _store: Store<any>,
    private activatedRoute:ActivatedRoute,
    private requestService: RequestFlowService,
    private router: Router,
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

    this.requestService.setflowVisibility(false);
    this.requestService.setPunchRequestVisiblity(false);
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.fromDate = moment(new Date(y, m, 1), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    this.toDate = moment( new Date(y, m + 1, 0), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    this.workflowID=1;
    this.selectedStatus =UI_CONSTANT.REQUESTSTATUS.filter(x=>x.value === 0);
    const statusArr= this.selectedStatus.map(x=>x.value);
    const reqStatus = statusArr.join('~');
    this.columnDefs = this.requestService.prepareColumnForGrid();
    this.requestService.getflowVisiblity().subscribe(res=>{
      this.displayflow = res;
    });
    this.currentUser.subscribe(res=>{
      if(res){
        this.userInfo = res;
        this.employeeID=this.userInfo.logOnUserDetail.employeeID;
        // console.log(this.employeeID);
      }
    });
    this.requestService.getPunchRequestVisiblity().subscribe(res=>{
      this.displayPunchRequest = res;
    });
    this.requestService.getDisplayVisiblity().subscribe(res=>{
      this.displayInfo = false;
    });
    this.requestService.getGatePassVisiblity().subscribe(res=>{
      this.displayGatePass = false;
    });
    this.requestService.getLeaveRequestVisiblity().subscribe(res=>{
      this.displayLeaveRequest = false;
    });
    this._store.select(selectLeaveMasterState).subscribe(res => {
      if (res && res.leavelList) {
        this.leaveDetail = AppUtil.deepCopy(res.leavelList);
        this.leaveDetail.map(x=>{
          this.leaveTypeList.push({key:x.leaveName,value:x.leaveCode});
        })
        this.getDetail(null);
      }
    });
    this._store.select(currentUserMenuItems).subscribe(response=>{
      if(response){
        // console.log(response)
        this.menuItems =response?.currentMenuItemsList.menuItems;
        const requestMenu:Menu = this.menuItems.find(x=> x.childs.find(y=>y.menuId === Number(this.activatedRoute.snapshot.params.id)));
        this.reqMenuList = requestMenu.childs.filter(z=> z.menuId === Number(this.activatedRoute.snapshot.params.id))[0].childs;
        this.selectedMenu= this.reqMenuList[0].menuId;
    }
  });
  this._store.select(requestState).subscribe(res=>{
    if(res && res.RequestList){
      this.rowData = AppUtil.deepCopy(res.RequestList);
    } else{
      this.requestService.fetchRequestData(this.workflowID,reqStatus,this.fromDate,this.toDate);
    }
  });
  }
  addNew(){
    this.transactionID=0;
    console.log(this.selectedMenu);
    if(this.selectedMenu==3){
      this.flowHeaderName='Gate Pass Request Flow Detail';
      this.gatepassRequestDiv=true;
      this.PostButton=true;
      this.disabledTxt=false;
      this.displayGatePass=true;
    //  this.requestService.setGatePassVisibility(true);
    }
    else if(this.selectedMenu==1){
       this.flowHeaderName='Leave Request Flow Detail';
       this.PostButton=true;
       this.leaveRequestDiv=true;
       this.disabledTxt=false;
       this.displayLeaveRequest=true;
     //  this.requestService.setLeaveRequestVisiblity(true);
    }
    else if(this.selectedMenu==5){
      this.flowHeaderName='Punch Regularization Request Flow Detail';
      this.PostButton=true;
      this.disabledTxt=false;
      this.requestService.setPunchRequestVisiblity(true);
    }

  }
  getDetail(menu:Menu){
    var menuID= menu? menu.menuId : this.requestFlowID;
    const fDate = moment(new Date(this.fromDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    const tDate = moment(new Date(this.toDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    const reqType = this.requestType.filter(x=> x.ID.includes(menuID))[0];
  
    if(menuID==1 && reqType==undefined){
      this.workflowID=1;
    }
    else if(menuID==2 && reqType==undefined)
    {
      this.workflowID=2;
    }
    else if(menuID==3 && reqType==undefined){
      this.workflowID=3;
    }
    else if(menuID==4 && reqType==undefined){
      this.workflowID=4;
    }

    else if(menuID==5 && reqType==undefined){
      this.workflowID=5;
    }
    else if(menuID==6 && reqType==undefined){
      this.workflowID=6;
    }
    else if(menuID==7 && reqType==undefined){
      this.workflowID=7;
    }
    else{
      this.workflowID=reqType.value;
    }

   // this.workflowID= reqType.value;
    this.selectedMenu= menuID;
    this.selectedStatus = UI_CONSTANT.REQUESTSTATUS.slice(0,1);
    const statusArr= this.selectedStatus.map(x=>x.value);
    const reqStatus = statusArr.join('~');
  // this.workflowID=this.selectedMenu;
    console.log(this.selectedMenu);
    this.requestService.fetchRequestData(this.workflowID,reqStatus,fDate,tDate);
    if(this.selectedMenu==2 || this.selectedMenu==4 || this.selectedMenu==6){
      this.addNewBtn=false;
    }else{
      this.addNewBtn=true;
    }
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      if (action === UI_CONSTANT.ACTIONS.REQUESTEDIT) {
        if(this.selectedMenu===63){
          this.flowHeaderName='Leave Request Flow Detail';
          this.leaveRequestDiv=true;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          console.log(this.requestID,this.transactionID);
          this.PostButton=false;
          this.disabledTxt=true;
          this.displayLeaveRequest=true;
         // this.requestService.setLeaveRequestVisiblity(true);
        }
        else if(this.selectedMenu===64){
          this.flowHeaderName='Leave Request Flow Detail';
          this.leaveRequestDiv=true;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          console.log(this.requestID,this.transactionID);
          this.PostButton=false;
          this.disabledTxt=true;
          this.displayLeaveRequest=true;
        }
        else  if(this.selectedMenu===65){
          console.log(params.data);
          this.flowHeaderName='Gate Pass Request Flow Detail';
          this.gatepassRequestDiv=true;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          this.PostButton=false;
          this.disabledTxt=true;
          this.displayGatePass=true;
          //this.requestService.setGatePassVisibility(true);
        }

        else  if(this.selectedMenu===66){
          console.log(params.data);
          this.flowHeaderName='Gate Pass Request Flow Detail';
          this.gatepassRequestDiv=true;
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          this.PostButton=false;
          this.disabledTxt=true;
          this.displayGatePass=true;
          //this.requestService.setGatePassVisibility(true);
        }

        else if(this.selectedMenu ===67){
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          this.PostButton=false;
          this.disabledTxt=true;
          this.flowHeaderName='Punch Regularization Request Flow Detail';
          this.requestService.setPunchRequestVisiblity(true);
        }
      
        else if(this.selectedMenu ===68){
          this.requestID = params.data.requestID;
          this.transactionID=params.data.transactionID;
          this.workflowID=params.data.workFlowID;
          this.requestStatus=params.data.requestStatus;
          this.PostButton=false;
          this.disabledTxt=true;
          this.flowHeaderName='Punch Regularization Request Flow Detail';
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
         if(data && data.requestDetails){
          this.workFlowList = data.requestDetails.sort((a, b) => a.levelNumber - b.levelNumber);
         }
        });
     
      }
      if (action === UI_CONSTANT.ACTIONS.REQUESTINFO) {
        // params.api.stopEditing(false);
        this.requestService.setDisplayVisibility(true);
      }
      if (action === UI_CONSTANT.ACTIONS.CANCEL) {
          params.api.stopEditing(true);
      }
      if (action === UI_CONSTANT.ACTIONS.ADD_REMARK) {
          this.remarkDisplay = true;
          this.selectRequestInfo = params.data;
          this.labelName = (params.data.cancelRequestID === 1)?'Cancel':'Undo';
          console.log(params,'----',this.selectRequestInfo);
    }
    }
  }
  filterStatus(e){
    const statusArr:any[] = AppUtil.deepCopy(UI_CONSTANT.REQUESTSTATUS);
  return this.filteredStatusList = statusArr.filter(x=> x.key.toLowerCase().includes(e.query.toLowerCase()));
  }
  getData(){
    const fDate = moment(new Date(this.fromDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    const tDate = moment(new Date(this.toDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    const statusArr= this.selectedStatus.map(x=>x.value);
    const reqStatus = statusArr.join('~');
    // console.log(statusArr.join('~'),'status',fDate,tDate,this.workflowID);
    this.requestService.fetchRequestData(this.workflowID,reqStatus,fDate,tDate);
  }

  recallAllLeaveRefreshDeatil(){
    console.log('okkk');
    setTimeout( ()=>{
      this.getData();
      }, 1000)
  }


  SaveRemarkData(frm){
    this.reqRemarks='';
    const payload = {
      transactionID: this.selectRequestInfo.transactionID,
      requestStatusID: this.selectRequestInfo.finalRequestStatusID,
      workFlowID: this.selectRequestInfo.workFlowID,
      remark: this.reqRemarks,
      employeeID: this.userInfo.logOnUserDetail.employeeID
    }
    this.requestService.undoRequest(payload);
    this.recallAllLeaveRefreshDeatil();
    this.remarkDisplay = false;
  }
  CancelRemarkData(){
    this.remarkDisplay = false;
  }
  closePopups(event){
    this.gatepassRequestDiv=false;
    this.displayGatePass=false;
    this.displayPunchRequest=false;
    this.displayLeaveRequest=false;
    //this.requestService.setGatePassVisibility(event);
  }
  closePopup(){
    this.requestService.setflowVisibility(false);
    this.requestService.setPunchRequestVisiblity(false);
  }
  CancelleavePost(event){
    // console.log(event)
    // console.log(event)
    //this.requestService.setLeaveRequestVisiblity(event);
    this.displayLeaveRequest=false;
    this.leaveRequestDiv=false;
  }
  postSaveAction(e){
    const fDate = moment(new Date(this.fromDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    const tDate = moment(new Date(this.toDate), UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    const statusArr= this.selectedStatus.map(x=>x.value);
    const reqStatus = statusArr.join('~');
    this.requestService.fetchRequestData(this.workflowID,reqStatus,fDate,tDate);
  }

}
