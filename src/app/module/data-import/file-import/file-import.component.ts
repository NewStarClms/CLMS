import { Component, OnInit } from '@angular/core';
import { ImportService } from '../../../services/import.service';
import { ImportModuleModel } from '../../../store/model/import.model';
import { AppUtil } from '../../../common/app-util';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import * as XLSX from 'xlsx';
import { NotificationService } from '../../../common/notification.service';
import { UserAttendanceDetailService } from 'src/app/services/user-attendance-detail.service';
import * as moment from 'moment';
import { BsDatepickerConfig, DatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PayGroupModel } from 'src/app/store/model/pay-component.model';
import { PayGroupService } from '../../../services/pay-group.service';
import { AuthService } from 'src/app/services/authentication.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';
type AOA = any[][];
@Component({
  selector: 'app-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss']
})
export class FileImportComponent implements OnInit {

  public fileTemplateObj = {
    moduleId: null,
    importId: null,
    importName: null,
    action: null,
    extraValue1: null,
    extraValue2: null
  };
  public toMonth;
  public monthList=UI_CONSTANT.MONTH_LIST;
  month: string = null;
  year: string = null;
  monthTo: string = null;
  yearTo: string = null;
  leaveAccType: string = null;
  validateNote: any[] = [];
  rowData: any[] = [];
  cols: any[] = [];
  data: AOA = [];
  importFile: File;
  labelText = "Select File"
  importMasterData: ImportModuleModel[] = [];
  moduleListOption: Array<{ key: string, value: number }> = [];
  importListOption: Array<{ key: string, value: number }> = [];
  actionListOption: Array<{ key: string, value: string }> = [];
  accrualTypeOption: Array<{ key: string; value: string }> = UI_CONSTANT.LEAVE_ACCRUAL_TYPE;
  contents: string | ArrayBuffer;
  filename: string;
  arrayBuffer: any;
  filelist: any[];
  selectedFile: string;
  years: Array<any>;
  months: Array<any>;
  public payGroupList: Array<PayGroupModel> = [];
  public datepickerConfig: Partial<BsDatepickerConfig>;;
  public shiftDaterange: string;
  public paygroupID: number;
  public importName: string;
  public visibles:boolean=false;
  public filtertypevale:string='';
  public appliedfilter:boolean=false;
  public visibleAppliedfilter:boolean=false;
  public insertUpdateActionID:string;
  constructor(
    private importService: ImportService,
    private notificationService: NotificationService,
    private attendanceService: UserAttendanceDetailService,
    private payGroupService: PayGroupService,
    private authenticationService:AuthService,
    private coreService: AppCoreCommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appSearchService: AppSearchCommonService,
  ) {
    this.datepickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      rangeInputFormat: 'DD-MMM-YYYY',
      adaptivePosition: true,
      initCurrentTime: false
    });
  }

  ngOnInit(): void {
 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    let importModuleID=this.activatedRoute.snapshot.params.importModuleID;
    this.fileTemplateObj.moduleId=Number(importModuleID);
    this.validateNote = [];
    this.years = this.attendanceService.fetchYears();
    this.months = this.attendanceService.fetchMonths();
   // this.month=this.coreService.getDefaultMonthNumberForReport().toString();
   // this.year=this.coreService.getDefaultYearForReport();
    this.authenticationService.setGlobalFilterVisibility(true);
    this.importService.fetchImportMasterData().subscribe(response => {
      if (response && response.imports) {
        this.moduleListOption = [];
        this.actionListOption = [];
        this.importListOption = [];
        this.importMasterData = AppUtil.deepCopy(response.imports);
        console.log('import', response.imports);
        this.importMasterData.map(x => {
          this.moduleListOption.push({ key: x.importModuleName, value: x.importModuleID });
        });
        this.fngetMappedimport(Number(importModuleID));
      }
    });
    this.payGroupService.getPayGroupList().subscribe(res => {
      console.log('res', res);
      if (res && res.policyes) {
        this.payGroupList = AppUtil.deepCopy(res.policyes);
        console.log('payGroupList', this.payGroupList);
      }
    });
  }
  fngetMappedimport(e) {
    console.log('event', e);
    console.log('event-1', e, this.fileTemplateObj);
    this.fileTemplateObj.importId=null;
    this.importListOption = [];
    const moduleData: ImportModuleModel = this.importMasterData.filter(x => x.importModuleID === e)[0];
    this.importName=moduleData?.importModuleName;
    moduleData.importModuleMasters.map(y => {
      this.importListOption.push({ key: y.importName, value: y.importID });
    });
    console.log('importListOption', this.importListOption);
  }
  fngetMappedAction(e) {
    this.validateNote = [];
    this.data = [];
    this.cols = [];
    this.rowData = [];
    console.log('event', e, this.fileTemplateObj);
    this.actionListOption = [];
    const moduleData = this.importMasterData.filter(x => x.importModuleID === this.fileTemplateObj.moduleId)[0];
    const importType = moduleData.importModuleMasters.filter(x => x.importID === this.fileTemplateObj.importId)[0].importType;
    const importName = moduleData.importModuleMasters.filter(x => x.importID === this.fileTemplateObj.importId)[0].importName;
    const importNote: string = moduleData.importModuleMasters.filter(x => x.importID === this.fileTemplateObj.importId)[0].importNote;
    this.fileTemplateObj.importName = importName;
    this.fileTemplateObj.importId = e;
    this.validateNote = (importNote) ? importNote.split('~') : null;
    if (importType === 'I') {
      this.fileTemplateObj.action = importType;
      this.actionListOption.push(UI_CONSTANT.IMPORT_ACTIONS[0]);
    } else if (importType === 'U') {
      this.fileTemplateObj.action = importType;
      this.actionListOption.push(UI_CONSTANT.IMPORT_ACTIONS[1]);
    } else {
      this.fileTemplateObj.action = 'I';
      this.actionListOption = UI_CONSTANT.IMPORT_ACTIONS;
    }
    // if(this.fileTemplateObj.importId === 21 && this.fileTemplateObj.moduleId === 3){
    // this.leaveAccType = this.accrualTypeOption[0].key;
    // }
    console.log('actionListOption', this.actionListOption);

    if((this.fileTemplateObj.importId==12 || this.fileTemplateObj.importId==13 || this.fileTemplateObj.importId==14 || this.fileTemplateObj.importId==15 || this.fileTemplateObj.importId==16) && this.fileTemplateObj.action=="U"){
      this.visibleAppliedfilter=true;
   }else if((this.fileTemplateObj.importId==17 || this.fileTemplateObj.importId==18 || this.fileTemplateObj.importId==20 || this.fileTemplateObj.importId==21 || this.fileTemplateObj.importId==22 || this.fileTemplateObj.importId==23) && this.fileTemplateObj.action=="U") {
    this.visibleAppliedfilter=true;
   }else if(this.fileTemplateObj.importId==28 && this.fileTemplateObj.action=="U"){
    this.visibleAppliedfilter=true;
   }
    else{
      this.visibleAppliedfilter=false;
    }

  }

  fnInsertUpdateAction(e){
    let params=e;
    this.insertUpdateActionID=params;
    if(this.insertUpdateActionID=="U"){
      this.visibleAppliedfilter=true;
    }else{
      this.appSearchService.deleteCellFromRemoteTemp();
      this.appliedfilter=false;
      this.visibleAppliedfilter=false;
    }
   }

  downloadTemplate() {
    var frmDate= new Date(Number(this.year),Number(this.month)-1,1);
    var toDate= new Date(Number(this.yearTo),Number(this.monthTo)-1,1);
    if (this.fileTemplateObj.importId === 20) {
      this.fileTemplateObj.extraValue1 = moment(frmDate).format('DD-MMM-YYYY');
      this.fileTemplateObj.extraValue2 = null;
    } else if (this.fileTemplateObj.importId === 21) {
      this.fileTemplateObj.extraValue1 = this.leaveAccType;
      this.fileTemplateObj.extraValue2 = moment(frmDate).format('DD-MMM-YYYY');;
    } else if (this.fileTemplateObj.importId === 17) {
      console.log('range');
      if (this.shiftDaterange != null) {
        this.fileTemplateObj.extraValue1 = moment(this.shiftDaterange[0], UI_CONSTANT.SHORT_DATE_FORMAT).format("DD-MMM-YYYY");
        this.fileTemplateObj.extraValue2 = moment(this.shiftDaterange[1], UI_CONSTANT.SHORT_DATE_FORMAT).format("DD-MMM-YYYY");
      }
    } else if (this.fileTemplateObj.importId === 18) {
      this.fileTemplateObj.extraValue1 = moment(frmDate).format('DD-MMM-YYYY');
      this.fileTemplateObj.extraValue2 = null;
    } else if (this.fileTemplateObj.importId === 24) {
      this.fileTemplateObj.extraValue1 = moment(frmDate).format('DD-MMM-YYYY');
      this.fileTemplateObj.extraValue2 = null;
    }
    else if (this.fileTemplateObj.importId === 25) {
      this.fileTemplateObj.extraValue1 = moment(frmDate).format('DD-MMM-YYYY');
      this.fileTemplateObj.extraValue2 = moment(toDate).format('DD-MMM-YYYY');
    } else if (this.fileTemplateObj.importId === 27) {
      this.fileTemplateObj.extraValue1 = this.paygroupID;
      this.fileTemplateObj.extraValue2 = null;
    } else if (this.fileTemplateObj.importId === 28) {
      this.fileTemplateObj.extraValue1 = this.paygroupID;
      this.fileTemplateObj.extraValue2 = moment(toDate).format('DD-MMM-YYYY');
    } else {
      this.fileTemplateObj.extraValue1 = null;
      this.fileTemplateObj.extraValue2 = null;
    }
    if (this.fileTemplateObj.importId > 0 && this.fileTemplateObj.action && this.fileTemplateObj.importName) {
      this.importService.getTemplate(this.fileTemplateObj.importId, this.fileTemplateObj.action, this.fileTemplateObj.importName, this.fileTemplateObj.extraValue1, this.fileTemplateObj.extraValue2);
    } else {

      this.notificationService.showError('Please Provide Import Name and Action', 'Import Error');
    }
  }
  saveImportData(f) {
    var frmDate= new Date(Number(this.year),Number(this.month)-1,1);
    var toDate= new Date(Number(this.yearTo),Number(this.monthTo)-1,1);
    if (this.fileTemplateObj.importId === 20) {
      this.fileTemplateObj.extraValue1 =  moment(frmDate).format('DD-MMM-YYYY');
      this.fileTemplateObj.extraValue2 = null;
    } else if (this.fileTemplateObj.importId === 21) {
      this.fileTemplateObj.extraValue1 = this.leaveAccType;
      this.fileTemplateObj.extraValue2 = moment(frmDate).format('DD-MMM-YYYY');
    } else if (this.fileTemplateObj.importId === 17) {
      console.log('range');
      if (this.shiftDaterange != null) {
        this.fileTemplateObj.extraValue1 = moment(this.shiftDaterange[0], UI_CONSTANT.SHORT_DATE_FORMAT).format('DD-MMM-YYYY');
        this.fileTemplateObj.extraValue2 = moment(this.shiftDaterange[1], UI_CONSTANT.SHORT_DATE_FORMAT).format('DD-MMM-YYYY');
      }
    } else if (this.fileTemplateObj.importId === 18) {
      this.fileTemplateObj.extraValue1 = moment(frmDate).format('DD-MMM-YYYY');
      this.fileTemplateObj.extraValue2 = null;
    } else if (this.fileTemplateObj.importId === 24) {
     
      this.fileTemplateObj.extraValue1 = moment(frmDate).format('DD-MMM-YYYY');
      this.fileTemplateObj.extraValue2 = null;
    }
    else if (this.fileTemplateObj.importId === 25) {
      this.fileTemplateObj.extraValue1 = moment(frmDate).format('DD-MMM-YYYY');
      this.fileTemplateObj.extraValue2 = moment(toDate).format('DD-MMM-YYYY');
    } else if (this.fileTemplateObj.importId === 27) {
      this.fileTemplateObj.extraValue1 = this.paygroupID;
      this.fileTemplateObj.extraValue2 = null;
    } else if (this.fileTemplateObj.importId === 28) {
      this.fileTemplateObj.extraValue1 = this.paygroupID;
      this.fileTemplateObj.extraValue2 = moment(toDate).format('DD-MMM-YYYY');
    } else {
      this.fileTemplateObj.extraValue1 = null;
      this.fileTemplateObj.extraValue2 = null;
    }
    if (this.importFile) {
      this.importService.uploadFileMethod(this.fileTemplateObj, this.importFile);
      // this.fileTemplateObj = null;
    } else {
      this.notificationService.showError('Please Select File', null);
    }
    return;
  }
  cancelEdit() {

  }
  getFile(e) {
    this.rowData = [];
    this.cols = [];
    this.importFile = e.currentFiles[0];
    this.notificationService.showWarning('Please verify data.', 'Verify Data');
    console.log('file data', e, this.importFile);
  }
  cancelHandler(e) {
    this.cols = [];
    this.rowData = [];
    this.importFile = null;
  }

  cancelRHandler(e) {
    console.log(e, 'remove');
  }
  uplodHandler(e) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(e);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log("data:", this.data);
      // this.selectedFile = target.files[0].fileName;
      this.rowData = AppUtil.deepCopy(this.data);
      this.cols = this.data[0];
      this.rowData.shift();
      console.log('Data', this.data);
      console.log('rowData', this.rowData);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  displayGlobalFilter(){
    this.visibles=true;
   }
 
   cancelGlobalFiltter(){
     this.visibles=false;
   }
 
   onGetFilterDetail(){
     this.filtertypevale=localStorage.getItem('lStorageData');
     console.log(this.filtertypevale)
     if(this.filtertypevale == '1'){
       this.appliedfilter=true;
     }else{
       this.appliedfilter=false;
     }
   }

}
