import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NotificationService } from 'src/app/common/notification.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { ChallanService } from 'src/app/services/challan.service';
import { DownloadService } from 'src/app/services/download.service';
import { EmployeeDetailList } from 'src/app/store/model/attendance-process.model';
import { Challan } from 'src/app/store/model/challan.model';

@Component({
  selector: 'app-challan',
  templateUrl: './challan.component.html',
  styleUrls: ['./challan.component.scss']
})
export class ChallanComponent implements OnInit {
 
  public month;
  public year;
  public columnDefs!: any[];
  public rowData: Array<Challan> = [];
  public monthList = UI_CONSTANT.MONTH_LIST;
  public yearList = UI_CONSTANT.YEAR_LIST;
  public challanTypes = UI_CONSTANT.CHALLAN_TYPE_LIST;
  public fileTypes =[{value:"CSV",key:"CSV File"},{value:"EXCEL",key:"Excel File"},{value:"TXT",key:"Text File"}];
  public fileType:string;
  public challanType;
  public message:string;
  public showGrid: boolean;
  public viewPFDialog: boolean;
  public viewESIDialog: boolean;
  public viewLWFDialog: boolean;
  public viewPTDialog: boolean;
  public downloadChallanDialog:boolean;
  public currentChallan: Challan;
  public generateLabel:string="Regenerate";

  constructor(private challanService: ChallanService,
    private notificationService:NotificationService,
    private downloadService: DownloadService,
    private coreService: AppCoreCommonService) { }

  ngOnInit(): void {
    this.challanService.getGridVisiblity().subscribe(res =>{
      this.showGrid = res;
    });
    this.ngOnChanges(null);
  }
  ngOnChanges(changes: SimpleChanges) {
  
    this.challanService.getPFDialogVisiblity().subscribe(res =>{
      this.viewPFDialog = res;
    });
    this.challanService.getESIDialogVisiblity().subscribe(res =>{
      this.viewESIDialog = res;
    });
    this.challanService.getLWFDialogVisiblity().subscribe(res =>{
      this.viewLWFDialog = res;
    });
    this.challanService.getPTDialogVisiblity().subscribe(res =>{
      this.viewPTDialog = res;
    });
    this.challanService.getDownloadDialogVisiblity().subscribe(res =>{
      this.downloadChallanDialog = res;
    });
    this.columnDefs=this.challanService.prepareColumnForGrid();
   
    this.year = this.coreService.getDefaultYearForReport();
    this.month =this.coreService.getDefaultMonthForReport();
  }

  loadChallanData(){
    var datetime = '01-' + this.month + '-' + this.year;
   
    if(this.challanType!=''){
    this.challanService.setGridVisibility(true);
    this.challanService.fetchChallanList(this.challanType, datetime).subscribe((res) => {
        if (res && res.challans) {
           this.rowData= res.challans;
        }
      });
    }
    else{
      this.message="Please select Challan Type first.";
      this.notificationService.showError(this.message,UI_CONSTANT.SEVERITY.ERROR);
    }
  }

  generateNewChallan(){
    var monthyear = '01-' + this.month + '-' + this.year;
    var monthyearDateString = moment(monthyear, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
   
    this.challanService.getChallanDetails(this.challanType,monthyearDateString).subscribe((res)=>{
        if(res && res.challan){
          this.currentChallan=res.challan[0];
          if(this.challanType=="PF") this.challanService.setPFDialogVisibility(true);
          else if(this.challanType=="ESI") this.challanService.setESIDialogVisibility(true);
          else if(this.challanType=="LWF") this.challanService.setLWFDialogVisibility(true);
          else if(this.challanType=="PT") this.challanService.setPTDialogVisibility(true);
          this.generateLabel="Generate";
        }
    });
    
  }

  regenerateChallan(){
    if(this.currentChallan && this.currentChallan.challanID> 0){
      this.generateChallan(this.currentChallan.challanID,false);
    }
    else if(this.currentChallan && this.currentChallan.challanID== 0){
      this.generateChallan(this.currentChallan.challanID,true);
    }
    else{
      this.message="Please select Challan to regenerate.";
      this.notificationService.showError(this.message,UI_CONSTANT.SEVERITY.ERROR);
    }
  }

  generateChallan(challanID:number, isNewChallan:boolean){

    var monthyear = '01-' + this.month + '-' + this.year;
    var monthyearDateString = moment(monthyear, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    this.challanService.generateChallan(challanID,isNewChallan,this.currentChallan.challanType,"",monthyearDateString);
   
  }

  onCellClicked(params){
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === "view") {
        if(this.challanType=="PF") this.challanService.setPFDialogVisibility(true);
        else if(this.challanType=="ESI") this.challanService.setESIDialogVisibility(true);
        else if(this.challanType=="LWF") this.challanService.setLWFDialogVisibility(true);
        else if(this.challanType=="PT") this.challanService.setPTDialogVisibility(true);
        this.currentChallan = params.data;
        this.generateLabel="Regenerate";
      }
      else if(action==="download"){
        this.currentChallan = params.data;
        this.challanService.setDownloadDialogVisibility(true);
      }
    }
  }
  closeDialog(){
    this.challanService.setPFDialogVisibility(false);
    this.challanService.setESIDialogVisibility(false);
    this.challanService.setLWFDialogVisibility(false);
    this.challanService.setPTDialogVisibility(false);
  }
  hideDownloadChallanPopup(){
    this.challanService.setDownloadDialogVisibility(false);
  }
  StartDownloading(){
    if(this.currentChallan && this.fileType){
      this.challanService.downloadChallan(this.currentChallan.challanID).subscribe((res) => {
        if (res && res.challan) {
          var fileName=this.challanType+ this.year + this.month + this.fileType;
          var columns =res.challan.columnNames;
           var data=res.challan.dataSet.table1;
           if(this.fileType=="EXCEL")  this.downloadService.downloadExcel([columns],data,fileName);
           else if(this.fileType=="CSV") this.downloadService.downloadCSV(columns,data,fileName);
           else if(this.fileType=="TXT") this.downloadService.downloadTXT(columns,data,fileName);
        }
      });
    }
  }
}
