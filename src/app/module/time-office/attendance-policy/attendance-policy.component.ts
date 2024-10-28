import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AttendancePolicyMasterService } from 'src/app/services/attendance-policy-master.service';
import { selectAttendancePolicyMasterState, selectAutoCodeOrgState, selectBranchState, selectCategoryState, selectCompanyState, selectContractorState, selectDepartmentState, selectDesignationState, selectEmployeeMasterState, selectGradeState, selectLevelState, selectOrganizationState, selectSectionState, selectSubDepartmentState } from 'src/app/store/app.state';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { attendancepolicy, Branch, Category, Company, Contractor, Department, Designation, Grade, Level, Organization, organizationMapping, policyMasters, Section, ShiftMappedData, SubDepartment } from 'src/app/store/model/master-data.model';
import { ShiftService } from '../../../services/shift.service';
import { saveShiftMappingData } from '../../../store/actions/master.action';
import { AppCoreCommonService } from '../../../services/app.core-common.services';

@Component({
  selector: 'app-attendance-policy',
  templateUrl: './attendance-policy.component.html',
  styleUrls: ['./attendance-policy.component.scss']
})
export class AttendancePolicyComponent implements OnInit {

  public columnDefs!: any[];
  mappedShiftList:Array<ShiftMappedData> = [];
  public LocationDataList: Array<any> = [];
  public orgDataUnitList: Array<any> = [];
  public rowData: Array<policyMasters> = [];
  public attendancePolicyInfo: policyMasters = {} as policyMasters;
  public attendancePolicymasterInfo: attendancepolicy = {} as attendancepolicy;
  public orgnaizationMappingInfo: organizationMapping = {} as organizationMapping;
  public orgUnitList = UI_CONSTANT.ORGANIZATIONLIST;
  public locationList = UI_CONSTANT.LOCATIONLIST;
  public displayOUMap: boolean = false;
  public selectedLocation: Array<number>;
  public displayshiftMap = false;
  public shiftPolicyID;
  shiftPolicyTypeID: any;
  selectedOrganiztion: Array<number>;
  constructor(
    private _store: Store<any>,
    private attendancePolicyMasterService: AttendancePolicyMasterService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private shiftService: ShiftService,
    private appCoreCommonService: AppCoreCommonService
  ) {
  this.attendancePolicyMasterService.fetchAttendancePolicyMasterData();
  }

  addNew() {
    this.router.navigate(['/time-office/add-edit-attendance-policy-master/' + 0]);
  }

  ngOnInit(): void {
      // New Changes

  this.LocationDataList = [];
  this._store.select(selectEmployeeMasterState).subscribe(response=>
    {
      if (response && response.employeeMasterList) {
        const tempempStatusList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeStatus);
        this.LocationDataList=tempempStatusList;
    }
  });
  this._store.select(selectEmployeeMasterState).subscribe(response=>
    { 
      if (response && response.employeeMasterList) {
        const tempempTypeList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeType);
        this.LocationDataList=tempempTypeList;
      }
    });
  
      this._store.select(selectBranchState).subscribe(res => {
        if (res && res.branchList) {
          const tempbranchList:Branch[] = AppUtil.deepCopy(res.branchList);
          tempbranchList.map(x => {
            this.LocationDataList.push({
              value: x.branchID,
              key: x.branchName
            });
           console.log(this.LocationDataList);
          });
         
        }
     
      });
     
 // End

    this._store.select(selectAttendancePolicyMasterState).subscribe(response => {
      if (response && response.attendancePolicyMasterList) {
        this.rowData = response.attendancePolicyMasterList;
      }
    });
    this.columnDefs = this.attendancePolicyMasterService.prepareColumnForGrid();
    this.shiftService.getMappingVisiblity().subscribe(res => {
      this.displayshiftMap = res;
    });
    this.attendancePolicyMasterService.getVisiblity().subscribe(res => {
      this.displayOUMap = res;
    });
   
  }


  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.router.navigate(['/time-office/add-edit-attendance-policy-master/' + params.data.policyID]);
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
            this.attendancePolicyMasterService.deleteCellFromRemote(params);
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
        this.mappedShiftList = [];
        this.shiftService.fetchShiftMapping(params.data.policyID).subscribe(data=>{
          if(data.mapping){
            this._store.dispatch(new saveShiftMappingData(data.mapping));
            // this.mappedShiftList = AppUtil.deepCopy(data.mapping);
            this.shiftPolicyID = params.data.policyID;
            this.shiftPolicyTypeID = params.data.policyTypeID;
            this.shiftService.setMappingVisiblity(true);
          }
        });
        //this.router.navigate(['/gate-user/edit-visitor-admin/' + params.data.visitorID +'/'+ params.data.visitorLogID]);
      }

      if (action === UI_CONSTANT.ACTIONS.UPDATE) {
        params.api.stopEditing(false);
        console.log('update', params);
        this.attendancePolicyMasterService.updateStateOfCell(params);
      }

      if (action === UI_CONSTANT.ACTIONS.CANCEL) {
        params.api.stopEditing(true);
      }
      if (action === UI_CONSTANT.ACTIONS.MAPOU) {
        this.orgnaizationMappingInfo.policyID = params.data.policyID;
        this.attendancePolicyMasterService.fetchPolicyMappingDetail(params.data.policyID).subscribe(res => {
          if (res) {
            this.attendancePolicyMasterService.setVisibility(true);
            this.orgnaizationMappingInfo = res.mapping;
            this.orgnaizationMappingInfo.policyID = res.mapping.policyID;
            this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(res.mapping.organizationKeyID);
            this.LocationDataList = this.appCoreCommonService.preparelocationDataByOU(res.mapping.locationKeyID);
            this.selectedLocation = res.mapping.location;
            this.selectedOrganiztion= res.mapping.organization;
            console.log(this.selectedLocation,'----',this.selectedOrganiztion);
            console.log(this.LocationDataList,'----',this.orgDataUnitList);
          }
        });
      }
    }
  }
  prepareOrgListByOU(params) {
    console.log(params);
    this.selectedOrganiztion = [];
    this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(params);
  }
  preparelocationDataByOU(params) {
  this.selectedLocation = [];
  this.LocationDataList = this.appCoreCommonService.preparelocationDataByOU(params);
}
  
  exportGridData() {
    this.attendancePolicyMasterService.getCSVReport(this.rowData, 'Attendance_Policy');
  }
 
  CancelOrgnaizationMapping() {
    this.orgnaizationMappingInfo = {} as organizationMapping;
    this.attendancePolicyMasterService.setVisibility(false);
  }
  SaveOrgnaizationMapping() {
    //console.log('first mapping',this.orgnaizationMappingInfo);
    console.log(this.selectedLocation)
    console.log(this.selectedLocation)
    this.orgnaizationMappingInfo.policyTypeID = 1;
    this.orgnaizationMappingInfo.workFlowID = 0;
    this.orgnaizationMappingInfo.organization = ((this.selectedOrganiztion.map(x => x).join('~')).split('~')).map(i => Number(i));
    if(this.selectedLocation != null){
      this.orgnaizationMappingInfo.location = ((this.selectedLocation.map(x => x).join('~')).split('~')).map(i => Number(i));
    }
   this.attendancePolicyMasterService.SaveOrgnaizationMapping(this.orgnaizationMappingInfo);
     this.attendancePolicyInfo.mappedOnOrganization=true;
  }
  cancelShiftmappingdiv(){
      this.shiftService.setMappingVisiblity(false);
  }
  
}

