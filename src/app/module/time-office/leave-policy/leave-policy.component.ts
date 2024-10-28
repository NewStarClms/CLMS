import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { Department, LeavePolicyDetail, organizationMapping, SubDepartment, Designation, Grade, Category, Level, Branch, Company, Contractor, Section, Organization } from 'src/app/store/model/master-data.model';
import { LeavePolicyService } from '../../../services/leave-policy.service';
import { selectBranchState, selectCategoryState, selectCompanyState, selectContractorState, selectDepartmentState, selectDesignationState, selectEmployeeMasterState, selectGradeState, selectLeavePolicyState, selectLevelState, selectOrganizationState, selectSectionState } from '../../../store/app.state';
import { ConfirmationService } from 'primeng/api';
import { selectSubDepartmentState } from 'src/app/store/app.state';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { AppCoreCommonService } from '../../../services/app.core-common.services';
@Component({
  selector: 'app-leave-policy',
  templateUrl: './leave-policy.component.html',
  styleUrls: ['./leave-policy.component.scss']
})
export class LeavePolicyComponent implements OnInit {
  readonly appUtil = AppUtil;
  public rowData: any[] = [];
  public leavePolicyInfo: LeavePolicyDetail = {} as LeavePolicyDetail;
  public columnDefs: any[];
  public isAddNewPolicy = false;
  public displayPolicyMapping =false;
  policyID: number;
  policyTypeID: number;

  
  public orgnaizationMappingInfo: organizationMapping = {} as organizationMapping;
  public orgUnitList = UI_CONSTANT.ORGANIZATIONLIST;
  public locationList = UI_CONSTANT.LOCATIONLIST;
  public displayOUMap: boolean = false;
  public selectedLocation: Array<number>;
  public LocationDataList: Array<{ key: string, value: number }> = [];
  public orgDataUnitList: Array<any> = [];
  selectedOrganiztion: any;
  public labelName:string;
  public headerdialogName:string;

  constructor(
    private _store: Store<any>,
    private leavePolicyService: LeavePolicyService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private confirmationService:ConfirmationService,
    private appCoreCommonService: AppCoreCommonService
  ) { 
    this.leavePolicyService.fetchLeavePolicyData();
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

    this.isAddNewPolicy = false;
    this._store.select(selectLeavePolicyState).subscribe(response => {
      if (response && response.policies) {
        this.rowData = response.policies;
      }
    });
    this.leavePolicyService.getVisiblity().subscribe(res => {
        this.isAddNewPolicy = res;
    })
    this.leavePolicyService.getOUVisiblity().subscribe(res => {
      this.displayOUMap = res;
    });
    this.leavePolicyService.getMappingVisiblity().subscribe(res => {
      this.displayPolicyMapping = res;
    });
    this.columnDefs = this.leavePolicyService.prepareColumnForGrid();
  }

  addNew() {
    this.labelName="Save";
    this.headerdialogName="Add Leave Policy";
    this.leavePolicyInfo = {} as LeavePolicyDetail;
    this.leavePolicyService.setVisibility(true);
  }

  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.leavePolicyInfo = params.data;
        this.labelName="Update";
        this.headerdialogName="Update Leave Policy";
        this.leavePolicyService.setVisibility(true);
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
            this.leavePolicyService.deleteCellFromRemote(params);
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
        this.leavePolicyService.setMappingVisiblity(true);
        this.policyID = params.data.policyID;
        this.policyTypeID = params.data.policyTypeID
       }
       if (action === UI_CONSTANT.ACTIONS.MAPOU) {
        this.orgnaizationMappingInfo.policyID = params.data.policyID;
        this.leavePolicyService.fetchMappedOUData(params.data.policyID).subscribe(res => {
          if (res) {
            this.leavePolicyService.setOUVisiblity(true);
            this.orgnaizationMappingInfo = res.mapping;
            this.orgnaizationMappingInfo.policyID = res.mapping.policyID;
            this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(res.mapping.organizationKeyID);
            this.LocationDataList = this.appCoreCommonService.preparelocationDataByOU(res.mapping.locationKeyID);
            this.selectedLocation = res.mapping.location;
            this.selectedOrganiztion= res.mapping.organization;
          }
        });
      }
    }
  }
  exportGridData() {
    this.leavePolicyService.getCSVReport(this.rowData , 'Leave_Policy');
  }
  saveLeavePolicy() {
    if(this.leavePolicyInfo.policyID > 0){
    this.leavePolicyService.updateStateOfCell(this.leavePolicyInfo);
    }else{
      this.leavePolicyInfo.policyTypeID = 2;
      this.leavePolicyInfo.policyID = 0;
      this.leavePolicyInfo.mappingStatus = null;
      this.leavePolicyInfo.mappedOnOrganization = true;
      this.leavePolicyService.SaveLeavePolicyData(this.leavePolicyInfo);
    }
    
  }

  cancelLeavePolicy() {
    this.leavePolicyService.setVisibility(false);
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
  CancelOrgnaizationMapping() {
    this.orgnaizationMappingInfo = {} as organizationMapping;
    this.leavePolicyService.setOUVisiblity(false);
  }
  SaveOrgnaizationMapping() {
    console.log('first mapping',this.orgnaizationMappingInfo);
    this.orgnaizationMappingInfo.policyTypeID = 1;
    this.orgnaizationMappingInfo.workFlowID = 0;
    this.orgnaizationMappingInfo.organization = ((this.selectedOrganiztion.map(x => x).join('~')).split('~')).map(i => Number(i));
    if(this.selectedLocation != null){
      this.orgnaizationMappingInfo.location = ((this.selectedLocation.map(x => x).join('~')).split('~')).map(i => Number(i));
    }
    
    // console.log(this.orgnaizationMappingInfo)
    this.leavePolicyService.SaveOrgnaizationMapping(this.orgnaizationMappingInfo);
     this.leavePolicyInfo.mappedOnOrganization=true;
  }

  cancelLeavemappingdiv(){
    this.policyID = null;
    this.policyTypeID =null;
    this.leavePolicyService.setMappingVisiblity(false);
}

}
