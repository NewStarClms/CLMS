import { Component, Input, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { ReportColumnDetails, ReportDetailsEntities, ReportUpdateModel } from 'src/app/store/model/report.model';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsService } from '../../../services/reports.service';
import { selectReportSetupState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { ReportModel } from '../../../store/model/report.model';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';

@Component({
  selector: 'app-report-configuration',
  templateUrl: './report-configuration.component.html',
  styleUrls: ['./report-configuration.component.scss']
})
export class ReportConfigurationComponent implements OnInit {

  @Input() reportData: ReportDetailsEntities;
  @Input() reportColData: ReportColumnDetails[];
  reportEntityInfo: ReportUpdateModel = {} as ReportUpdateModel;
  reportTypeIDOption = UI_CONSTANT.REPORT_CATEGORY;
  selectedColumns: any[];
  selectedMappedColumn: ReportColumnDetails[] = [];
  reportId: any;
  reportTypeId: any;
  reportSetupList: ReportModel[];
  reportModuleID: number;
  reportTypeList: Array<{ key: string, value: number }> = [{ key: "Please Select", value: -1 }];
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  divVisibleFor: boolean;
  public labelName:string="";
  public headerdialogName:string=" ";
//New Changes
public visibleForEmployee:Array<any>=[];
public employeeSerchList:Array<any>=[];
//End
  constructor(
    private router: Router,
    private _store: Store<any>,
    private ref: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private reportsService: ReportsService,
    private appSearchService: AppSearchCommonService
  ) { }
  availableItems: any[] = [];
  selectedItems: any[] = [];
  currentSelectItems: any[] = [];
  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }
  ngOnInit(): void {
    this.labelName="Save";
    this.headerdialogName="Add Report Detail";
    this.reportId = this.activatedRoute.snapshot.params.reportId;
    this.reportTypeId = this.activatedRoute.snapshot.params.reportTypeId;
    this.reportModuleID = this.activatedRoute.snapshot.params.reportModuleID;
    console.log('change', this.reportData);
    this.reportsService.fetchReportType(this.reportModuleID).subscribe(types => {
      const typeOption = AppUtil.deepCopy(types.reportTypes);
      this.reportTypeList = typeOption;
        //New Changes
        this.reportId = this.activatedRoute.snapshot.params.reportId;
        if(this.reportEntityInfo.visibleFor != null){
          let visibleForEmployee = this.reportEntityInfo.visibleFor.split('~').map(key => key);
          for(var i=0;i< visibleForEmployee.length;i++){
            this.visibleForEmployee.push({
             key:visibleForEmployee[i]     
            })
          }
        }else{
          this.visibleForEmployee=[]
        }
        console.log(this.visibleForEmployee);
         //End
      });
 
  


    if (this.reportId > 0) {
      this.labelName="Update";
      this.headerdialogName="Update Report Detail";
      this._store.select(selectReportSetupState).subscribe(res => {
        if (res && res.reportList) {
          this.reportSetupList = AppUtil.deepCopy(res.reportList);
          const reportEntityArr = this.reportSetupList.filter(c => c.reportModuleID === Number(this.reportModuleID))[0];
          console.log(reportEntityArr);
          const reportEntityTemp: ReportDetailsEntities = reportEntityArr.reportDetailsEntities.filter(v => v.reportID === Number(this.reportId))[0];
          this.reportEntityInfo.defaultReport = true;//reportEntityTemp.defaultReport;
          this.reportEntityInfo.description = reportEntityTemp.description;
          this.reportEntityInfo.linePerPage = reportEntityTemp.linePerPage;
          this.reportEntityInfo.reportCondition = reportEntityTemp.reportCondition;
          // this.reportEntityInfo.visibleFor = null;
           //New Changes
           this.reportEntityInfo.visibleFor = reportEntityTemp.visibleFor;
           //End
          this.reportEntityInfo.visibleToAll = true;
          this.divVisibleFor = true;
          // this.reportEntityInfo.xmlMappedColumn = null;
          this.reportEntityInfo.mappedColumns = reportEntityTemp.mappedColumns;
          this.reportEntityInfo.reportName = reportEntityTemp.reportName;
          this.reportEntityInfo.reportTypeID = reportEntityTemp.reportTypeID;
          this.reportEntityInfo.reportID = reportEntityTemp.reportID;

          this.reportsService.fetchReportDetails(this.reportId, this.reportTypeId).subscribe(res => {
            if (res) {
              this.reportColData = AppUtil.deepCopy(res);
              this.reportColData.map(s => {
                if (s.selected) {
                  this.selectedItems.push({
                    id: s.reportColumnID,
                    name: s.displayName
                  });
                } else {
                  this.availableItems.push({
                    id: s.reportColumnID,
                    name: s.displayName
                  });
                }
                const temCol = [];
                this.selectedItems.map(v => {
                  temCol.push({
                    value: v.id,
                    text: v.name
                  });
                });
                this.currentSelectItems = temCol;
                if (this.currentSelectItems) {
                  this.updateReportMappedCol();
                }
              });

            }
          });
        }
      });


    } else {
      this.reportEntityInfo = {} as ReportUpdateModel;
      this.reportEntityInfo.visibleToAll = true;
      this.reportEntityInfo.defaultReport = true;
      this.reportEntityInfo.defaultReport = true;//reportEntityTemp.defaultReport;
      this.reportEntityInfo.description = null;
      this.reportEntityInfo.linePerPage = 0;
      this.reportEntityInfo.reportCondition = null;
      this.reportEntityInfo.visibleFor = null;
      this.reportEntityInfo.visibleToAll = true;
      this.divVisibleFor = true;
      // this.reportEntityInfo.xmlMappedColumn = null;
      this.reportEntityInfo.mappedColumns = [];
      this.reportEntityInfo.reportName = '';
      this.reportEntityInfo.reportTypeID = -1;
      this.reportEntityInfo.reportID = 0;
    }
  }


  onItemsMoved(event): void {
    this.currentSelectItems = event.selected;
    this.updateReportMappedCol();
    console.log(this.currentSelectItems, '-----hhhhhh');
  }
  updateReportMappedCol() {
    const tempColumnData: ReportColumnDetails[] = [];
    this.currentSelectItems.forEach((item, i) => {
      if (tempColumnData.findIndex(v => v.reportColumnID === item.value) === -1) {
        tempColumnData.push({
          reportColumnID: item.value,
          displayName: item.text,
          sequenceNumber: i
        });
      }
    })
    this.reportEntityInfo.mappedColumns = tempColumnData;
  }

  keyPressNumbers(event) {
    AppUtil.validateNumbers(event);
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }

  saveReportColumnDetails() {
    console.log(this.reportEntityInfo);
    // New Changes
    if(this.visibleForEmployee != undefined){
      this.reportEntityInfo.visibleFor= this.visibleForEmployee.map(({key})=> key.split('-')[0]).join('~');
     // alert(this.reportEntityInfo.visibleFor);
      }
      // End
      
    if (this.reportEntityInfo.reportID === 0) {
      this.reportsService.saveReportDetailColumn(this.reportEntityInfo);
    } else {
      this.reportsService.updateReportDetailColumn(this.reportEntityInfo);
    }
  }

  cancelEdit() {
    this.router.navigate(['reports/report-setup']);
  }

  fngetVisibleToall(event) {
    console.log(event);
    this.reportEntityInfo.visibleToAll = event.value;
    if (event == true) {
      this.divVisibleFor = true;
    } else {
      this.divVisibleFor = false;
    }
  }

  fngetMappedCol(event) {
    console.log('evnt', event);
    this.reportEntityInfo.reportTypeID = event;
    this.reportsService.getMappedColumns(this.reportEntityInfo.reportTypeID, this.reportEntityInfo.reportID).subscribe(cols => {
      if (cols) {
        console.log('cols', cols)
        cols.map(s => {
          if (s.selected) {
            this.selectedItems.push({
              id: s.reportColumnID,
              name: s.displayName
            });
          } else {
            this.availableItems.push({
              id: s.reportColumnID,
              name: s.displayName
            });
          }
          const temCol = [];
          this.selectedItems.map(v => {
            temCol.push({
              value: v.id,
              text: v.name
            });
          });
          this.currentSelectItems = temCol;
          if (this.currentSelectItems) {

            this.updateReportMappedCol();
          }
        });
      }
    });
  }
//New Changes
searchData(event) {
  this.appSearchService.getFilteredEmployee(event.query).subscribe(data => {
    if(data && data.searchData){
    this.employeeSerchList = data.searchData;
    }
  });
}
//End
}
