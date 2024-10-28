import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColDef } from 'ag-grid-community';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import {  selectEmployeeMasterState,  selectGateState, selectVisitorAdminState, selectVisitorPassTemplateState, selectVisitorPurposeState, selectVisitorTypeState } from 'src/app/store/app.state';
import { VisitorAdmin, VisitorInOut } from 'src/app/store/model/visitorAdmin.model';
import * as moment from 'moment';
import {  EmployeeMaster } from 'src/app/store/model/employee.model';
import { Gate, VisitorPassTemplate, VisitorType, VisitPurpose } from '../../../store/model/master-data.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/store/model/login.model';
import { VisitorEssService } from 'src/app/services/visitor-ess.service';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-visitor-admin',
  templateUrl: './visitor-admin.component.html',
  styleUrls: ['./visitor-admin.component.scss'],
})
export class VisitorAdminComponent implements OnInit {
  public columnDefs!: any[];
  public rowData: Array<VisitorAdmin>= [];
  public visitorAdminInfo: VisitorAdmin = {} as VisitorAdmin;
  public visitorInOutInfo: VisitorInOut = {} as VisitorInOut;
  public isCityActive = true;
  public genderList:Array<any>=[];
  public visitTypeList:Array<any>=[];
  public visitpurposeList:Array<any>=[];
  public visitorpriorityList=UI_CONSTANT.VISITOR_PRIORITY;
  public empList:Array<any>=[];
  public gateList:Array<any>=[];
  public datepickerConfig : Partial<BsDatepickerConfig>;
  public displaygate:boolean = false;
  timepickerVisible = false;
  private _currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  gatePassID:number;
  public visitorPassTemplateList:Array<any>=[];
  fromtime: string;
  fromDate:string;
  toDate:string;
  totime:string;
  expIntime:string;
  expInDate:string;
  visitTime:string;
  visitEndTime :string;
  addVisitorRequest:boolean;
  gatepassTemplate:string;
  loading = [false, false, false, false]
  filteredList: any[];
  visitorSerchList:any[];
  public hideOnvisitorType:boolean=true;
  searchedvisitor:{key:string, value:string};
    currentdate=moment().toDate();

  public statusList=UI_CONSTANT.STATUSLIST;
  Vstatus:any[];
  public displayPosition: boolean;
  public display:boolean;
  public isEditable = false;
  searchedEmployee: string;
  other: any;
constructor(
  private _store: Store<any>,
  private visitorEssService: VisitorEssService,
  private router: Router,
  private authenticationService:AuthService
) {
  this.datepickerConfig = Object.assign({},{containerClass:'theme-default', 
  adaptivePosition:true,
  dateInputFormat:'DD-MMM-YYYY'});
  this._currentUserSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  this.currentUser = this._currentUserSubject.asObservable();
}

 ngOnInit(): void {
  this.authenticationService.setGlobalFilterVisibility(false);
  this.display = false;
  this.addVisitorRequest=false;
  this.expInDate= moment(moment().toDate()).format('DD-MMM-YYYY');
  this.expIntime = moment(moment().toDate()).format('HH:mm');
  this.fromDate = moment(this.currentdate).format('DD-MMM-YYYY');
  this.toDate = moment(this.currentdate).format('DD-MMM-YYYY');
  this.fromtime ='00:00';
  this.totime = '23:59';
  this.Vstatus= [{key: 'Pending', value: 0},{key:'In',value:9}];
  
  this.visitorEssService.getVisiblity().subscribe(res =>{
    this.display = res;
  });
  this._store.select(selectEmployeeMasterState).subscribe(response=>
    {
      if (response && response.employeeMasterList) {
       this.genderList = AppUtil.deepCopy(response.employeeMasterList.gender);
      }
    });
    this._store.select(selectVisitorTypeState).subscribe(response=>
      {
        if (response && response.visitorTypeList) {
          this.visitTypeList = AppUtil.deepCopy(response.visitorTypeList);
        }
      });
      this._store.select(selectVisitorPurposeState).subscribe(response=>
        {
          if (response && response.visitorPurposeList) {
            this.visitpurposeList = AppUtil.deepCopy(response.visitorPurposeList);
          }
        });
        this._store.select(selectVisitorPassTemplateState).subscribe(response=>
          {
            if (response && response.visitorPassTemplateList) {
  
              this.visitorPassTemplateList = AppUtil.deepCopy(response.visitorPassTemplateList);
            //  tempvisitorPassTemplateList.map(y => {
            //    this.visitorPassTemplateList.push({
            //     visitorPassID: y.templateID,
            //     visitorPassName: y.templateName
            //    });
            //  });
            }
          });
          this._store.select(selectGateState).subscribe(response=>
            {
              if (response && response.gateList) {
                this.gateList = AppUtil.deepCopy(response.gateList);
              }
            });
          this.getVisitorData();
}
SaveVisitorData(){
  this.visitorAdminInfo.expectedIn =this.expInDate+' '+this.expIntime;
  this.currentUser.subscribe(res=>{
    if(res){
      this.visitorAdminInfo.employeeID = res.logOnUserDetail.employeeID;
    }
  });
  if(this.visitorAdminInfo.companyName==null)
{
  this.visitorAdminInfo.companyName="none";
}  if(this.visitorAdminInfo.visitorID >0){
    console.log('edit',this.visitorAdminInfo);
    this.visitorEssService.updateStateOfCell(this.visitorAdminInfo);
  }else{
    console.log('add',this.visitorAdminInfo);
    this.visitorEssService.saveVisitorAdminESS(this.visitorAdminInfo);
  }
}
CancelVisitorData(){
  this.visitorEssService.setVisibility(false);
}
addNew(){
  this.addVisitorRequest=true;
  this.visitorAdminInfo = {} as VisitorAdmin;
  const getDate = new Date();
  const expectedDateTime = moment(getDate).format('yyyy-MM-DD')+'T'+moment(getDate).format('HH:MM:ss')
  this.visitorAdminInfo.expectedIn = expectedDateTime;
  this.display=true;
}


keyPressAlphanumeric(event) {
AppUtil.validateAlphanumeric(event);
}
exportGridData(){
this.visitorEssService.getCSVReport(this.rowData , 'Visitor');
}
getTime(event){
  this.fromtime = moment(event).format("HH:mm");
}
gettoTime(event){
  this.totime = moment(event).format("HH:mm");
}
getExpInTime(event){
  this.expIntime = moment(event).format("HH:mm");
    this.visitorAdminInfo.expectedIn = moment(this.expInDate).format('yyyy-MM-DD')+'T'+moment(event).format("HH:mm:ss");
}
getvisitTimeTime(event){
  this.visitorAdminInfo.visitTime = moment(event).format("HH:mm");
}
getvisitEndTimeTime(event){
  this.visitorAdminInfo.visitEndTime = moment(event).format("HH:mm");
}
getVisitorData(){
 // 01-Apr-2021 00:00
  let formdatetime:string;
  let todatetime:string;
  let resultstatus = this.Vstatus.map(({ value }) => value);
  let status;
  //console.log(this.Vstatus);
    status = resultstatus.join('~');

  // console.log(status);
  if(this.fromDate !=null){
    formdatetime= moment(this.fromDate).format("DD-MMM-YYYY")+' '+this.fromtime
  }else{
    formdatetime=null
  }
  if(this.toDate !=null){
    todatetime= moment(this.toDate).format("DD-MMM-YYYY")+' '+this.totime
  }else{
    todatetime=null
  }

  this.visitorEssService.fetchVisitorAdminESSData(formdatetime,todatetime,status);
  this._store.select(selectVisitorAdminState).subscribe(res =>{
    if(res && res.visitorAdminList)  {
      this.rowData = res.visitorAdminList;
    }
   });
   this.columnDefs = this.visitorEssService.perpareColumnForGrid();
}
addNewVisitor(){
  this.visitorAdminInfo = {} as VisitorAdmin;
  this.addVisitorRequest=false;
}
searchvisitor(){
  this.addVisitorRequest=true;
}
keyPressNumeric(event) {
  AppUtil.validateNumbers(event);
}
onGetDetail(event){
  console.log(event)
  this.addVisitorRequest = event.divevent;
 this.visitorEssService.fetchVisitorRequestESSData(event.data).subscribe(vis =>{
  this.visitorAdminInfo=AppUtil.deepCopy(vis.visitor);
  this.visitorAdminInfo.expectedIn = moment(this.expInDate).format('yyyy-MM-DD') + 'T' + moment(moment().toDate()).format("HH:mm:ss");
 });

}

private getUserFromLocalStorage(): User {
  try {
    return JSON.parse(localStorage.getItem(UI_CONSTANT.ConstValue.CurrentUser)!);
  } catch (error) {
    return null!;
  }
}

DownloadGatePass(){

}
CancelGatePass(){
  
}

fngetvisitorType(id){
  if(id==2 || id == 1023 || id == 1024 || id == 1025){
    this.hideOnvisitorType=false;
  }else{
    this.hideOnvisitorType=true;
  }
}
}


