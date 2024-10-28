import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { VisitorAdminService } from 'src/app/services/visitor-admin.service';
import { selectEmployeeMasterState, selectGateState, selectVisitorAdminState, selectVisitorPassTemplateState, selectVisitorPurposeState, selectVisitorTypeState } from 'src/app/store/app.state';
import { VisitorAdmin, VisitorInOut } from 'src/app/store/model/visitorAdmin.model';
import * as moment from 'moment';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { Gate, VisitorPassTemplate, VisitorType, VisitPurpose } from '../../../store/model/master-data.model';
import { Router } from '@angular/router';
import { VisitorPassTemplateService } from 'src/app/services/visitor-pass-template.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { VisitorPurposeService } from 'src/app/services/visitor-purpose.service';
import { convertToObject } from 'typescript';
import { AuthService } from 'src/app/services/authentication.service';
import { SecureURLService } from 'src/app/services/secure-url.service';

@Component({
  selector: 'app-visitor-admin',
  templateUrl: './visitor-admin.component.html',
  styleUrls: ['./visitor-admin.component.scss'],
})
export class VisitorAdminComponent implements OnInit {
  public columnDefs!: any[];
  public gatepassTemplate: SafeHtml;
  public rowData: Array<VisitorAdmin> = [];
  public visitorAdminInfo: VisitorAdmin = {} as VisitorAdmin;
  public visitorInOutInfo: VisitorInOut = {} as VisitorInOut;
  public isCityActive = true;
  public genderList: Array<any> = [];
  public visitTypeList: Array<any> = [];
  public visitpurposeList: Array<any> = [];
  public visitorpriorityList = UI_CONSTANT.VISITOR_PRIORITY;
  public empList: Array<any> = [];
  public gateList: Array<any> = [];
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public displaygate: boolean = false;
  public displaygatepass: boolean = false;
  timepickerVisible = false;
  public displaygatePass: boolean = false;
  public gatePassID: number;
  public visitorPassTemplateList: Array<any> = [];
  fromtime: string;
  fromDate: string;
  toDate: string;
  totime: string;
  expIntime: string;
  expInDate: string;
  visitTime: string;
  visitEndTime: string;
  addVisitorRequest: boolean;
  loading = [false, false, false, false]
  filteredList: any[];
  visitorSerchList: any[];
  searchedvisitor: { key: string, value: string };
  currentdate = moment().toDate();

  public statusList = UI_CONSTANT.STATUSLIST;
  Vstatus: any[];
  public displayPosition: boolean;
  public display: boolean;
  public isEditable = false;
  searchedEmployee: string;
  public hideOnvisitorType:boolean=true;
  other: any;
  visitorMaster$: any;
  public elementType:any;
  public correctionLevel:any;
  public qrCodedetail:any;
  @ViewChild('parent') input: ElementRef<ElementRef>;
  private QrCodeImageUrl:string;

  constructor(
    private _store: Store<any>,
    private visitorAdminService: VisitorAdminService,
    private visitorpassService: VisitorPassTemplateService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private visitpurposeService:VisitorPurposeService,
    private authenticationService:AuthService,
    private secureURLService:SecureURLService
  ) {
    this.datepickerConfig = Object.assign({}, { containerClass: 'theme-default', adaptivePosition:true,dateInputFormat: 'DD-MMM-YYYY' });

  }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(true);
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();

    this.expInDate= moment(moment().toDate()).format('DD-MMM-YYYY');
  this.expIntime = moment(moment().toDate()).format('HH:mm');
  const datea =moment(moment().toDate()); 
  console.log('sssss', moment(new Date()).format('DD-MMM-YYYY')+'T'+moment(datea).format('HH:MM:ss'));
  this._store.select(selectVisitorPassTemplateState).subscribe(response => {
    if (response && response.visitorPassTemplateList) {

      const tempvisitorPassTemplateList: VisitorPassTemplate[] = AppUtil.deepCopy(response.visitorPassTemplateList);
      tempvisitorPassTemplateList.map(y => {
        if (y.gatePass) {
          this.visitorPassTemplateList.push({
            visitorPassID: y.templateID,
            visitorPassName: y.templateName
          });
        }
        
        if (this.visitorPassTemplateList.length > 0) {
          this.gatePassID = this.visitorPassTemplateList[0].visitorPassID;
        }
      });
    }
  });
    this.visitorAdminService.setVisibility(false);
    this.visitorAdminService.setNewReqVisibility(false)
    this.fromDate = moment(new Date()).format('DD-MMM-YYYY');
    this.toDate = moment(new Date()).format('DD-MMM-YYYY');
    this.fromtime = '00:00';
    this.totime = '23:59';
    this.Vstatus = UI_CONSTANT.VISITOR_STATUS;
    this.visitorAdminService.getVisiblity().subscribe(res => {
      this.display = res;
    });
    this.visitorAdminService.getNewReqVisibility().subscribe(result=>{
      this.addVisitorRequest = result;
      this.visitorMaster$ = combineLatest(
        this._store.select(selectEmployeeMasterState),
        this._store.select(selectVisitorTypeState),
        this._store.select(selectVisitorPurposeState),
        this._store.select(selectVisitorPassTemplateState),
        this._store.select(selectGateState)
      ).subscribe(([listEmpMaster, listVisType, listPurpose, listTemplateState, listGate]) => 
      {
        console.log('listEmpMaster, listVisType, listPurpose, listTemplateState, listGate', listEmpMaster, listVisType, listPurpose, listTemplateState, listGate);
  
        if (listEmpMaster.employeeMasterList && listVisType.visitorTypeList
          && listPurpose.visitorPurposeList && listTemplateState.visitorPassTemplateList
          && listGate.gateList) {
          const tempgenderList: EmployeeMaster[] = AppUtil.deepCopy(listEmpMaster.employeeMasterList.gender);
          this.genderList = tempgenderList;
  
          const tempvisitorTypeList: VisitorType[] = AppUtil.deepCopy(listVisType.visitorTypeList);
          tempvisitorTypeList.map( ({visitorTypeID, visitorTypeName}) => ({visitorTypeID, visitorTypeName}) );
          this.visitTypeList= AppUtil.deepCopy(listVisType.visitorTypeList);

          const tempvisitpurposeList: VisitPurpose[] = AppUtil.deepCopy(listPurpose.visitorPurposeList);
          tempvisitpurposeList.map( ({visitPurposeID, visitPurposeName}) => ({visitPurposeID, visitPurposeName}) );
          this.visitpurposeList= AppUtil.deepCopy(listPurpose.visitorPurposeList);
          
          const tempvisitorPassTemplateList: VisitorPassTemplate[] = AppUtil.deepCopy(listTemplateState.visitorPassTemplateList);
          console.log('gate pass',tempvisitorPassTemplateList);
          this.visitorPassTemplateList=[];
          tempvisitorPassTemplateList.map(y => {
            if (y.gatePass) {
              this.visitorPassTemplateList.push({
                visitorPassID: y.templateID,
                visitorPassName: y.templateName
              });
            }
            const tempgateList: Gate[] = AppUtil.deepCopy(listGate.gateList);
            // tempgateList.map( ({gateID, gateName}) => ({gateID, gateName}) );/
            this.gateList = AppUtil.deepCopy(listGate.gateList);;
            
            if (this.visitorPassTemplateList.length > 0) {
              this.gatePassID = this.visitorPassTemplateList[0].visitorPassID;
            }
          });
        }
  
      });
    });
    this.getVisitorData();
  }
  SaveVisitorData(){
    if(this.visitorAdminInfo.companyName == null){
      this.visitorAdminInfo.companyName ="none";
    }
    if (this.visitorAdminInfo.visitorID > 0) {
      console.log('edit', this.visitorAdminInfo);
      this.visitorAdminService.updateStateOfCell(this.visitorAdminInfo);
    } else {
      console.log('add', this.visitorAdminInfo);
      this.visitorAdminService.saveVisitorAdmin(this.visitorAdminInfo);
    }
  }
  CancelVisitorData(){
    this.visitorAdminService.setVisibility(false);
  }
  addNew(){
    this.visitorAdminService.setNewReqVisibility(true);
    this.visitorAdminInfo = {} as VisitorAdmin;
    this.display = true;
  }

  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {

        this.router.navigate(['/gate-user/edit-visitor-admin/' + params.data.visitorID + '/' + params.data.visitorLogID]);
      }
      if (action === UI_CONSTANT.ACTIONS.GATEPASS) {
        this.displaygate = true;
        this.visitorAdminInfo.visitorLogID = params.data.visitorLogID;
        this.visitorAdminInfo.visitorID = params.data.visitorID;
        this.fnGetQRCode();
      }
    }
  }

  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
  exportGridData(){
    this.visitorAdminService.getCSVReport(this.rowData, 'Visitor');
  }
  getTime(event){
    this.fromtime = moment(event).format("HH:mm");
  }
  gettoTime(event){
    this.totime = moment(event).format("HH:mm");
  }
  getExpInTime(event){
    this.expIntime = moment(event).format("HH:mm");
    this.visitorAdminInfo.expectedIn = moment(this.expInDate).format('yyyy-MM-DD') + 'T' + moment(event).format("HH:mm:ss");
  }
  getvisitTimeTime(event){
    this.visitorAdminInfo.visitTime = moment(event).format("HH:mm");
  }
  getvisitEndTimeTime(event){
    this.visitorAdminInfo.visitEndTime = moment(event).format("HH:mm");
  }
  getVisitorData(){
    let formdatetime: string;
    let todatetime: string;
    let resultstatus = this.Vstatus.map(({ value }) => value);
    let status = resultstatus.join('~');
    if (this.fromDate != null) {
      formdatetime = moment(this.fromDate).format("DD-MMM-YYYY") + ' ' + this.fromtime
    } else {
      formdatetime = null
    }
    if (this.toDate != null) {
      todatetime = moment(this.toDate).format("DD-MMM-YYYY") + ' ' + this.totime
    } else {
      todatetime = null
    }

    this.visitorAdminService.fetchVisitorAdminData(formdatetime, todatetime, status);
    this._store.select(selectVisitorAdminState).subscribe(res => {
      if (res && res.visitorAdminList) {
         this.rowData = AppUtil.deepCopy(res.visitorAdminList);
         this.rowData= this.secureURLService.generateSecureURLs(this.rowData,"profileImagePath");
      }
    });
    this.columnDefs = this.visitorAdminService.perpareColumnForGrid();
  }
  addNewVisitor(){
    this.visitorAdminInfo = {} as VisitorAdmin;
    this.visitorAdminService.setNewReqVisibility(false);
    const getDate = new Date();
    const expectedDateTime = moment(getDate).format('yyyy-MM-DD')+'T'+moment(getDate).format('HH:MM:ss')
    this.visitorAdminInfo.expectedIn = expectedDateTime;        
    
  }
  searchvisitor(){
    this.visitorAdminInfo = {} as VisitorAdmin;
    this.visitorAdminService.setNewReqVisibility(true);
    
  }
  keyPressNumeric(event) {
    AppUtil.validateNumbers(event);
  }
  onGetDetail(event){
    console.log(event)
    this.visitorAdminService.setNewReqVisibility(event.divevent);
    this.visitorAdminService.fetchVisitorRequestData(event.data).subscribe(vis => {
      this.visitorAdminInfo = AppUtil.deepCopy(vis.visitor);
      this.visitorAdminInfo.expectedIn = moment(this.expInDate).format('yyyy-MM-DD') + 'T' + moment(moment().toDate()).format("HH:mm:ss");
    });

  }
  onGetEmployeeDetail(event){
    this.visitorAdminInfo.employeeID = event.data;
    this.visitorAdminInfo.employeeDetail = event.column;
    var empData = event.column;
this.visitorAdminInfo.employeeName=empData.split("|")[0];
this.visitorAdminInfo.employeeDepartment=empData.split("|")[1];
this.visitorAdminInfo.employeeDesignation=empData.split("|")[2];
  }
  DownloadGatePass(){
    this.displaygate = false;
    this.displaygatepass = true;
    var qrCode
    this.visitorpassService.fetchVisitorPassTemplateDetail(this.gatePassID, this.visitorAdminInfo.visitorLogID).subscribe(res => {
      if (res) {
        this.QrCodeImageUrl=this.QRCodesaveAsImage(this.input)
        this.secureURLService.appendSecurityToken(this.QrCodeImageUrl);
         console.log(this.QrCodeImageUrl);
         qrCode="<img src='"+this.QrCodeImageUrl+"' width='100px' height='100px'>";
         var gatePassTemp:string=res.template;
         gatePassTemp=gatePassTemp.replace("[QR_CODE]",qrCode);
         var addTokenjpeg=this.secureURLService.appendSecurityToken(".jpeg");
         var addTokenpng=this.secureURLService.appendSecurityToken(".png");
         var addTokenjpg=this.secureURLService.appendSecurityToken(".jpg");
         gatePassTemp=gatePassTemp.replace(".jpeg",addTokenjpeg);
         gatePassTemp=gatePassTemp.replace(".png",addTokenpng);
         gatePassTemp=gatePassTemp.replace(".jpg",addTokenjpg);
         this.gatepassTemplate = this._sanitizer.bypassSecurityTrustHtml(gatePassTemp);
        
      }
    });
  }
  CancelGatePass(){
    this.displaygate = false
  }

  ngOnDestroy(){
    this.visitorMaster$.unsubscribe();
  }
  
  fngetvisitorType(id){
    if(id==2 || id == 1023 || id == 1024 || id == 1025){
      this.hideOnvisitorType=false;
    }else{
      this.hideOnvisitorType=true;
    }
  }
  fnGetQRCode(){
    this.elementType = NgxQrcodeElementTypes.URL;
    this.correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
    var purposeID;
    this.visitorAdminService.fetchVisitDetailData(this.visitorAdminInfo.visitorID, this.visitorAdminInfo.visitorLogID).subscribe(res => {
      if (res) {
       this.visitpurposeService.fetchVisitPurposeDetail(res.visitPurposeID).subscribe(result=>{
        if(result){
          this.qrCodedetail= 'Visitor Name : '+ res.visitor.visitorName +'\n ' +'\n ' +
          'Visitor Company Name : '+ res.visitor.companyName +'\n ' +'\n ' +
          'Visitor Mobile NO : ' +res.visitor.contactNumber +'\n ' +'\n ' +
          'Attendy Name : '+res.employeeDetail +'\n' +'\n ' +
          'Purpose : '+result.visitPurposeName;
           
        }
      });
      
      }
    });
    
  }
  QRCodesaveAsImage(parent) {
    const parentElement = parent.qrcElement.nativeElement.querySelector("img").src;
    let blobData = this.convertBase64ToBlob(parentElement);
//console.log(blobData)
const blob = new Blob([blobData], { type: "image/png" });
      const url = window.URL.createObjectURL(blob);
     
      return url;
   
  }

  private convertBase64ToBlob(Base64Image: any) {
    // SPLIT INTO TWO PARTS
    const parts = Base64Image.split(';base64,');
    // HOLD THE CONTENT TYPE
    const imageType = parts[0].split(':')[1];
    // DECODE BASE64 STRING
    const decodedData = window.atob(parts[1]);
    // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
    const uInt8Array = new Uint8Array(decodedData.length);
    // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // RETURN BLOB IMAGE AFTER CONVERSION
    return new Blob([uInt8Array], { type: imageType });
  }

  }
