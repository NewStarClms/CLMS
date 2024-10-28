import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectReportSetupState } from '../../../store/app.state';
import { ReportModel, ReportDetailsEntities, ReportColumnDetails, ReportGenerateModel } from '../../../store/model/report.model';
import { AppUtil } from '../../../common/app-util';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { ReportsService } from '../../../services/reports.service';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/authentication.service';
import { ConfirmationService } from 'primeng/api';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';

@Component({
  selector: 'app-report-setup',
  templateUrl: './report-setup.component.html',
  styleUrls: ['./report-setup.component.scss']
})
export class ReportSetupComponent implements OnInit {

  readonly UICONSTANT = UI_CONSTANT;
  readonly acceptFormate = 'YYYY-MM-DDTHH:mm:ss';
  reportSetupList:Array<ReportModel> =[];
  reportDetailsEntities: Array<ReportDetailsEntities>=[];
  displayReportDetailsEntities: Array<ReportDetailsEntities>=[];
  reportModuleList:Array<any>;
  activeModule:any;
  color= "#"+Math.floor(Math.random()*16777215).toString(16);
  isActive=false;
  selectedModule = null;
  displaySettings=false;
  reportEntityInfo=null;
  showByDate =  true;
  showByFromMonthYear = false;
  showByToMonthYear = false;
  fromDate = new Date();
  toDate = new Date();
  defaultIndex = 0;
  reportGeneratPayload:ReportGenerateModel = {} as ReportGenerateModel;
  reportDownLoadInfo = {
    fileType:'',
    toMonth:"",
    fromMonth:"",
    toYear:0,
    fromYear:0,
    fromDate:'',
    todate:'',
    reportHeader: true,
    extraValue1:null,
    extraValue2:null,
    extraValue3:null
  };
  public includesList: Array<{key: string, value: string}>=UI_CONSTANT.INCLUDES_OPTION;
  public datepickerConfig: Partial<BsDatepickerConfig>;
  fileTypeList:Array<any> = [];
  fileTypeConstList:Array<any> = UI_CONSTANT.FileType;
  reportConfigData:Array<ReportColumnDetails> = [];  
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  monthList : Array<any>= ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  yearList:Array<Number> = AppUtil.generateArrayOfYears();
  reportTypeID: number;
  constructor(
    private _store:Store<any>,
    private reportService:ReportsService,
    private router: Router,
    private authenticationService:AuthService,
    private confirmationService: ConfirmationService,
    private coreService: AppCoreCommonService
  ) { 
    this.datepickerConfig = Object.assign({},{ containerClass:'theme-default',
    adaptivePosition:true,
    dateInputFormat:'DD-MMM-YYYY'});
  }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(true);
    this.reportService.getVisiblity().subscribe(res=>{
      this.displaySettings = res;
    });
    this._store.select(selectReportSetupState).subscribe(res=>{
      if(res && res.reportList){
      this.reportSetupList = AppUtil.deepCopy(res.reportList);
      // this.reportModuleList= this.reportSetupList.map( ({reportModuleID, reportModuleName}) => ({reportModuleID, reportModuleName}) );
      this.reportService.setActiveModule(this.reportSetupList[0]);
      this.selectedModule  = this.reportSetupList[0].reportModuleID;
      }
    });
    
    this.reportService.getActiveModule().subscribe(report=>{
      if(report){
      this.activeModule = report.reportModuleID;
      this.reportDetailsEntities= AppUtil.deepCopy(report.reportDetailsEntities);
      this.displayReportDetailsEntities = this.reportDetailsEntities.filter(k=> k.reportCategory === 'D');
      console.log('entity',this.activeModule,this.displayReportDetailsEntities );
      }
    })
    
  }
  getReportDetail(report:any){
    console.log('reportDas',report);
  this.isActive = !this.isActive;  
  this.defaultIndex = 0;
  this.selectedModule  = report.reportModuleID; 
    this.reportService.setActiveModule(report);
  }

  addNew(){
    this.router.navigate(['reports/report-detail/'+0+'/'+1+'/'+this.selectedModule]);    
  }

  goBack(){
    this.router.navigate(['/']);    
  }
  performEdit(reportEntity: ReportDetailsEntities){
    const url = 'report-detail/'+reportEntity.reportID+'/'+reportEntity.reportTypeID;
    this.router.navigate(['reports/report-detail/'+reportEntity.reportID+'/'+reportEntity.reportTypeID+'/'+reportEntity.reportModuleID]);    
  }

  handleChange(e){
    const cat = UI_CONSTANT.REPORT_CATEGORY[e.index].value;
    this.displayReportDetailsEntities = this.reportDetailsEntities.filter(k=> k.reportCategory === cat);
    console.log('event',e);
  }
  
  downloadPopup(reportDetail: ReportDetailsEntities) {
    const currentReportEntity: ReportDetailsEntities = reportDetail;
    this.reportGeneratPayload.reportCategory = currentReportEntity.reportCategory;
    this.reportGeneratPayload.reportID = currentReportEntity.reportID; 
    this.reportTypeID=currentReportEntity.reportTypeID;
    if(this.reportTypeID === 13 || this.reportTypeID === 14){
      this.reportDownLoadInfo.extraValue1 = 3;
      this.reportDownLoadInfo.extraValue3 = ['HLD','WO'];
    }
    if(this.reportTypeID === 15 || this.reportTypeID === 16){
      this.reportDownLoadInfo.extraValue1 = 1;
      this.reportDownLoadInfo.extraValue2 = 1;
    }
    if(this.reportTypeID === 18){
      this.reportDownLoadInfo.extraValue1 = 1024;
      this.reportDownLoadInfo.extraValue2 = 240;
    }
   
    if(currentReportEntity.duration === 'D'){
      this.fromDate = new Date();
      this.toDate = new Date();
    } 
    else if(currentReportEntity.duration === 'M'){
      const date = new Date();
      this.fromDate = new Date(date.getFullYear(), date.getMonth()-1);
      this.toDate = new Date(date.getFullYear(), date.getMonth()-0,0);
    } 
    else if(currentReportEntity.duration === 'Y'){
      const currentYear = new Date().getFullYear();
      this.fromDate = new Date(currentYear, 0, 1);
      this.toDate = new Date(currentYear, 11, 31);
    }
    if(currentReportEntity.dateControlType === 'D'){
      this.showByDate = true;
      this.showByFromMonthYear = false;
      this.showByToMonthYear=false;
      this.reportDownLoadInfo.fromDate = moment(this.fromDate).format(this.acceptFormate)+'Z';
      this.reportDownLoadInfo.todate = moment(this.toDate).format(this.acceptFormate)+'Z';
    } 
    else {
      this.showByDate = false;
      this.showByFromMonthYear = true;
      this.showByToMonthYear=true;
      if(currentReportEntity.dateControlType === 'M' && currentReportEntity.duration==='D'){
        this.showByToMonthYear = false;
       // this.reportDownLoadInfo.fromMonth = this.coreService.getDefaultMonthForReport();
       // this.reportDownLoadInfo.fromMonth =this.monthList[this.fromDate.getMonth()-1];
       this.reportDownLoadInfo.fromMonth =this.coreService.getfetMonthYearForReport().toLocaleString('default',{ month: 'short' });
       this.reportDownLoadInfo.fromYear =this.coreService.getfetMonthYearForReport().getFullYear();
       this.reportDownLoadInfo.toYear =this.coreService.getfetMonthYearForReport().getFullYear();
      }
      else{
        this.reportDownLoadInfo.fromMonth =this.monthList[this.fromDate.getMonth()];
        this.reportDownLoadInfo.toMonth =this.monthList[this.toDate.getMonth()]
        this.reportDownLoadInfo.fromYear =this.fromDate.getFullYear();
        this.reportDownLoadInfo.toYear =this.toDate.getFullYear();
      }
     
      // this.reportDownLoadInfo.fromYear =this.fromDate.getFullYear()-1;
      // this.reportDownLoadInfo.toYear =this.toDate.getFullYear()-1;
    }
    if(currentReportEntity.generateType === 'B')
    {
      this.fileTypeList = this.fileTypeConstList.filter(i=> i.key != 'P');
    }
    else if(currentReportEntity.generateType === 'E')
    {
      this.fileTypeList = this.fileTypeConstList.filter(i=> i.key === 'E');
    }
    else if(currentReportEntity.generateType === 'H')
    {
      this.fileTypeList = this.fileTypeConstList.filter(i=> i.key === 'H');
    }
    else if(currentReportEntity.generateType === 'P')
    {
      this.fileTypeList = this.fileTypeConstList.filter(i=> i.key != 'E');
    }
    else
    {
      this.fileTypeList = AppUtil.deepCopy(this.fileTypeConstList);
    }
    this.reportDownLoadInfo.fileType = this.fileTypeList[0]?.key;
    this.displaySettings = true;
  }
  cancel(){
    this.displaySettings= false;
  }
  getDate(event, action) {
    
    if(action === 'toDate'){
      this.reportDownLoadInfo.todate = moment(event).format(this.acceptFormate)+'Z';
    }
    if(action === 'fromDate'){
      this.reportDownLoadInfo.fromDate = moment(event).format(this.acceptFormate)+'Z';
    }

    console.log(this.reportDownLoadInfo , 'ddd');
  }
  downloadReport(){
    this.reportGeneratPayload.reportHeaderRequired = this.reportDownLoadInfo.reportHeader;
    this.reportGeneratPayload.extraValue1 = this.reportDownLoadInfo.extraValue1?.toString();
    if(this.reportTypeID === 13 || this.reportTypeID === 14){
      this.reportGeneratPayload.extraValue2 = this.reportDownLoadInfo.extraValue3.join('~');
    } else{
      this.reportGeneratPayload.extraValue2 = this.reportDownLoadInfo.extraValue2?.toString();
    }
    if(this.showByDate){
    this.reportGeneratPayload.fromDate = this.reportDownLoadInfo.fromDate;
    this.reportGeneratPayload.toDate = this.reportDownLoadInfo.todate;
    }
    else{
      let fromDT=this.reportDownLoadInfo.fromYear.toString()+'-'+ (this.monthList.indexOf(this.reportDownLoadInfo.fromMonth)+1) +'-'+'01';
      this.reportGeneratPayload.fromDate= moment(fromDT).format(this.acceptFormate);
      if(this.showByToMonthYear){
       // let toDT=this.reportDownLoadInfo.toYear.toString()+'-'+ (this.monthList.indexOf(this.reportDownLoadInfo.toMonth)+1) +'-'+(new Date(this.reportDownLoadInfo.toYear, this.monthList.indexOf(this.reportDownLoadInfo.toMonth)+1, 0)).getDate();
        let toDT=this.reportDownLoadInfo.fromYear.toString()+'-'+ (this.monthList.indexOf(this.reportDownLoadInfo.toMonth)+1) +'-'+(new Date(this.reportDownLoadInfo.toYear, this.monthList.indexOf(this.reportDownLoadInfo.toMonth)+1, 0)).getDate();
        this.reportGeneratPayload.toDate=moment(toDT).format(this.acceptFormate);
      }
    }
    this.reportGeneratPayload.reportGenerateType = this.reportDownLoadInfo.fileType;
    console.log(this.reportGeneratPayload,'download');
    this.reportService.downlodReport(this.reportGeneratPayload);
    // this.displaySettings = false;
  }

      // New Changes
   deleteReported(params)
   {
      // let tempData = AppUtil.deepCopy(this.displayReportDetailsEntities);
      // const temdata = AppUtil.deepCopy(this.displayReportDetailsEntities);
      // let index = this.displayReportDetailsEntities.findIndex((item)=>item.reportID == params.reportID);
      // temdata.splice(index,1);
      // this.reportService.deleteReport(params.reportID,params.reportTypeID);
      // this.displayReportDetailsEntities = temdata;


      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          let tempData = AppUtil.deepCopy(this.displayReportDetailsEntities);
          const temdata = AppUtil.deepCopy(this.displayReportDetailsEntities);
          let index = this.displayReportDetailsEntities.findIndex((item)=>item.reportID == params.reportID);
          temdata.splice(index,1);
          this.reportService.deleteReport(params.reportID,params.reportTypeID);
          this.displayReportDetailsEntities = temdata;
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
    
    //End
  

  
}
