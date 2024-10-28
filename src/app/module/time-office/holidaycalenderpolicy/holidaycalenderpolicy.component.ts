import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { HolidayCalenderPolicyService } from 'src/app/services/holiday-calender-policy.service';
import { selectBranchState, selectCategoryState, selectCompanyState, selectContractorState, selectDepartmentState, selectDesignationState, selectEmployeeMasterState, selectGradeState, selectHolidayCaldenderPolicyState, selectLevelState, selectOrganizationState, selectSectionState, selectSubDepartmentState } from 'src/app/store/app.state';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { HolidayCalenderPolicy } from 'src/app/store/model/holidaycalenderpolicy.model';
import { Branch, Category, Company, Contractor, Department, Designation, Grade, Level, Organization, organizationMapping, Section, SubDepartment } from 'src/app/store/model/master-data.model';
import { AppCoreCommonService } from '../../../services/app.core-common.services';

@Component({
  selector: 'app-holidaycalenderpolicy',
  templateUrl: './holidaycalenderpolicy.component.html',
  styleUrls: ['./holidaycalenderpolicy.component.scss']
})
export class HolidaycalenderpolicyComponent implements OnInit {

  public columnDefs!: any[];
  public rowData: Array<HolidayCalenderPolicy> = [];
  public holidayCalenderPolicyInfo = {} as HolidayCalenderPolicy;
  public displayOUMap: boolean = false;
  public orgDataUnitList: Array<any> = [];
  public locationDataList: Array<{ key: string, value: number }> = [];
  public selectedLocation: Array<number>;
  public selectedOrganiztion: Array<number>;
  public orgnaizationMappingInfo: organizationMapping = {} as organizationMapping;
  public display:boolean=false;
  stateOptions=UI_CONSTANT.stateOptions;
  public labelName:string="";
  public headerdialogName:string="Add";
  public orgUnitList = UI_CONSTANT.ORGANIZATIONLIST;
  public locationList = UI_CONSTANT.LOCATIONLIST;
  
  
  constructor(
    private _store: Store<any>,
    private holidayCalenderPolicyService: HolidayCalenderPolicyService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private appCoreCommonService: AppCoreCommonService
  ) {
  this.holidayCalenderPolicyService.fetchHolidayCalenderPolicyData();
  }  
  ngOnInit(): void {
    this._store.select(selectHolidayCaldenderPolicyState).subscribe(response => {
      if (response && response.holidayCalenderPolicyList) {
        this.rowData = response.holidayCalenderPolicyList;
      }
    });
    this.columnDefs = this.holidayCalenderPolicyService.prepareColumnForGrid();
    
    this.holidayCalenderPolicyService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
    this.holidayCalenderPolicyService.getOUVisiblity().subscribe(res =>{
      this.displayOUMap = res;
    });
  }
  addNew() {
    this.holidayCalenderPolicyInfo = {} as HolidayCalenderPolicy;
    this.holidayCalenderPolicyService.setVisibility(true);
    this.labelName="Save";
this.headerdialogName="Add Holiday Calendar";
  }

  SaveholidayPolicy() {
    if(this.holidayCalenderPolicyInfo.policyID >0){
      this.holidayCalenderPolicyService.updateStateOfCell(this.holidayCalenderPolicyInfo);
    }else{
      this.holidayCalenderPolicyService.saveHolidayCalenderPolicy(this.holidayCalenderPolicyInfo);
    }
  }
  CancelholidayPolicy() {
    this.holidayCalenderPolicyInfo = {} as HolidayCalenderPolicy;
    this.holidayCalenderPolicyService.setVisibility(false);
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.holidayCalenderPolicyService.setVisibility(true);
        this.holidayCalenderPolicyService.fetchHolidayCalenderPolicyDetail(params.data.policyID).subscribe(res=>{
          if(res){
            this.holidayCalenderPolicyInfo = res;
            // console.log('edit policy',this.holidayCalenderPolicyInfo );
          }
        });
        if(this.holidayCalenderPolicyInfo.policyID !== 0 ){
         this.labelName="Update";
         this.headerdialogName="Update Holiday Calendar Policy";
        }
      }

      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item) => item.policyID == params.data.policyID);
            temdata.splice(index, 1);
            this.holidayCalenderPolicyService.deleteCellFromRemote(params);
            this.rowData = temdata;

          },
          reject: (type) => {
            switch (type) {
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
      if (action === UI_CONSTANT.ACTIONS.SHIFMAPPING) {
        this.router.navigate(['/time-office/holiday-calender/holiday-calender-policy-mapping/' + params.data.policyID]);
      }
     
      if (action === UI_CONSTANT.ACTIONS.MAPOU) {
        this.orgnaizationMappingInfo.policyID = params.data.policyID;
        this.holidayCalenderPolicyService.fetchPolicyMappingDetail(params.data.policyID).subscribe(res => {
          if (res) {
            this.holidayCalenderPolicyService.setOUVisiblity(true);
            this.orgnaizationMappingInfo = res.mapping;
            this.orgnaizationMappingInfo.policyID = res.mapping.policyID;
            this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(res.mapping.organizationKeyID);
            this.locationDataList = this.appCoreCommonService.preparelocationDataByOU(res.mapping.locationKeyID);
            this.selectedLocation = res.mapping.location;
            this.selectedOrganiztion= res.mapping.organization;
          }
        });
      }
    }
  }
  
  exportGridData() {
    this.holidayCalenderPolicyService.getCSVReport(this.rowData, 'Holiday Calender Policy');
  }
  prepareOrgListByOU(params) {
    console.log(params);
    this.selectedOrganiztion = [];
    this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(params);
  }
  preparelocationDataByOU(params) {
  this.selectedLocation = [];
  this.locationDataList = this.appCoreCommonService.preparelocationDataByOU(params);
}
  
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
  keyPressNumeric(event) {
    AppUtil.validateNumbers(event);
  }
  CancelOrgnaizationMapping() {
    this.orgnaizationMappingInfo = {} as organizationMapping;
    this.holidayCalenderPolicyService.setOUVisiblity(false);
  }
  SaveOrgnaizationMapping() {
    // console.log('first mapping',this.orgnaizationMappingInfo);
    this.orgnaizationMappingInfo.policyTypeID = 3;
    this.orgnaizationMappingInfo.workFlowID = 0;
    this.orgnaizationMappingInfo.organization = ((this.selectedOrganiztion.map(x => x).join('~')).split('~')).map(i => Number(i));
    if(this.selectedLocation != null){
      this.orgnaizationMappingInfo.location = ((this.selectedLocation.map(x => x).join('~')).split('~')).map(i => Number(i));
    }
    this.holidayCalenderPolicyService.SaveOrgnaizationMapping(this.orgnaizationMappingInfo);
     this.holidayCalenderPolicyInfo.mappedOnOrganization=true;
    
  }
}
