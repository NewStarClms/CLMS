import { Component, OnInit,HostListener } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { selectEmployeeMasterState, selectGateState,  selectVisitorPurposeState, selectVisitorTypeState } from 'src/app/store/app.state';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { AppUtil } from 'src/app/common/app-util';
import { Gate, VisitorType, VisitPurpose } from 'src/app/store/model/master-data.model';
import { SelfVisitor } from 'src/app/store/model/selfVisitor.model';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { VisitorAdminService } from 'src/app/services/visitor-admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GuestVisitorService } from 'src/app/services/guest-visitor.service';
import { VisitorAdmin } from 'src/app/store/model/visitorAdmin.model';

@Component({
  selector: 'app-self-visitor-resquest',
  templateUrl: './self-visitor-resquest.component.html',
  styleUrls: ['./self-visitor-resquest.component.scss']
})
@HostListener('window:popstate', ['$event'])
export class SelfVisitorResquestComponent implements OnInit {
  
  public selfvisitorInfo: SelfVisitor = {} as SelfVisitor;
  public genderList:Array<any>=[];
  public visitTypeList:Array<any>=[];
  public visitpurposeList:Array<any>=[];
  public visitorpriorityList=UI_CONSTANT.VISITOR_PRIORITY;
  public gateList:Array<any>=[];
  public datepickerConfig : Partial<BsDatepickerConfig>;
  public visitorstatusList = UI_CONSTANT.STATUSLIST;
  public profilefilePath: string = "../../../../assets/img/default_image.png";
  public openTakeAphoto: boolean = false;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public videoOptions: MediaTrackConstraints = {};
  generatedImage: string;
  profileToUpload: any;
  timepickerVisible = false;
  expIntime:string;
  expInDate:string;
  loading = [false, false, false, false]
  filteredList: any[];
  searchedEmployee: string;
  addVisitorRequest=true;
  visitorAdminInfo: any;
  public hideOnvisitorType:boolean=true;
  constructor(
  private _store: Store<any>,
  private router:Router,
  private routeParams:ActivatedRoute,
  private guestService: GuestVisitorService,
  private location: LocationStrategy,
  private visitorAdminService: VisitorAdminService
) {
  
  history.pushState(null, null, window.location.href);  
  this.location.onPopState(() => {
    history.pushState(null, null, window.location.href);
  });  
  this.datepickerConfig = Object.assign({},{ containerClass:'theme-default',
  adaptivePosition:true,
  dateInputFormat:'DD-MMM-YYYY'});

}
onPopState(event) {
  console.log('Back button pressed');
  window.location.reload();
}
 ngOnInit(): void {
  this.expInDate= moment(moment().toDate()).format('DD-MMM-YYYY');
  this.expIntime = moment(moment().toDate()).format('HH:mm');
  // this.selfvisitorInfo.expectedIn = moment(this.expInDate).format('yyyy-MM-DD')+'T'+ this.expIntime;
  this.routeParams.queryParams.subscribe(data=>{
    if(data){
      this.guestService.setParamsData(data);
    }
  })
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  this._store.select(selectEmployeeMasterState).subscribe(response=>
    {
      if (response && response.employeeMasterList) {

       const tempgenderList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.gender);
       this.genderList = tempgenderList;
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
          //  const tempvisitpurposeList: VisitPurpose[] = AppUtil.deepCopy(response.visitpurposeList);
           this.visitpurposeList = AppUtil.deepCopy(response.visitorPurposeList);
          }
        });
        this._store.select(selectGateState).subscribe(response=>
          {
            if (response && response.gateList) {
              this.gateList = AppUtil.deepCopy(response.gateList);
            }
          });
}
SaveselfVisitorData(){
  this.selfvisitorInfo.visitStatusID = 0;

  if(this.selfvisitorInfo.companyName == null){
    this.selfvisitorInfo.companyName = "none";
  }
  console.log(this.selfvisitorInfo);
    this.guestService.saveSelfVisitorAdmin(this.selfvisitorInfo);
    this.selfvisitorInfo = {} as VisitorAdmin;
    this.addVisitorRequest=true;
    
}
keyPressAlphanumeric(event) {
AppUtil.validateAlphanumeric(event);
}
getExpInTime(event){
  this.expIntime = moment(event).format("HH:mm");
  this.selfvisitorInfo.expectedIn = moment(this.expInDate).format('yyyy-MM-DD')+'T'+ moment(event).format("HH:mm:ss");
}

keyPressNumeric(event) {
  AppUtil.validateNumbers(event);
}

onGetEmployeeDetail(event){
  console.log('event',event);
  this.selfvisitorInfo.employeeID=event.data;
  this.selfvisitorInfo.employeeDetail=event.column;
  var empData = event.column;
  this.selfvisitorInfo.employeeName=empData.split("|")[0];
  this.selfvisitorInfo.employeeDepartment=empData.split("|")[1];
  this.selfvisitorInfo.employeeDesignation=empData.split("|")[2];
}
onGetDetail(event){
  console.log(event)
  this.addVisitorRequest = event.divevent;
 this.visitorAdminService.fetchVisitorRequestData(event.data).subscribe(vis =>{
  this.selfvisitorInfo=AppUtil.deepCopy(vis.visitor);
  this.selfvisitorInfo.expectedIn = moment(this.expInDate).format('yyyy-MM-DD') + 'T' +   moment(moment().toDate()).format('HH:mm:ss');;
 });

}
addNewVisitor(){
  console.log(new Date());
  this.selfvisitorInfo = {} as VisitorAdmin;
  const getDate = new Date();
  const expectedDateTime = moment(getDate).format('yyyy-MM-DD')+'T'+moment(getDate).format('HH:MM:ss')
  this.selfvisitorInfo.expectedIn = expectedDateTime;
  this.addVisitorRequest=false;
}
cancelRequest(){
  this.selfvisitorInfo = {} as VisitorAdmin;
  this.addVisitorRequest=true;
}
fngetvisitorType(id){
  const typeName = this.visitTypeList?.filter(i=> i.visitorTypeID === id)[0].visitorTypeName;
  if(typeName.toLowerCase() === 'friend' || typeName.toLowerCase()  === 'relative' || typeName.toLowerCase()  === 'interviewer' || typeName.toLowerCase()  === 'other'){
    this.hideOnvisitorType=false;
  }else{
    this.hideOnvisitorType=true;
  }
}
}
