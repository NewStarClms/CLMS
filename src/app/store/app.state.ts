import { createFeatureSelector } from "@ngrx/store";
import * as MasterReducers from './reducers/master.reducer';
import * as branchReducers from './reducers/branch.reducer';
import * as categoryReducer from './reducers/category.reducer';
import * as companyReducer from './reducers/company.reducer';
import * as contractorReducer from './reducers/contractor.reducer';
import * as cityReducer from './reducers/city.reducer';
import * as departmentReducer from './reducers/department.reducer';
import * as designationReducer from './reducers/designation.reducer';
import * as qualificationReducer from './reducers/qualification.reducer';
import * as subdepartmentReducer from './reducers/subdepartment.reducer';
import * as sectionReducer from './reducers/section.reducer';
import * as bankReducer from './reducers/bank.reducer';
import * as bankbranchReducer from './reducers/bankbranch.reducer';
import * as levelReducer from './reducers/level.reducer';
import * as natureofworkReducer from './reducers/natureofwork.reducer';
import * as organizationReducer from './reducers/orgnaization.reducer';
import * as dispensaryReducer from './reducers/dispensary.reducer';
import * as gradeReducer from './reducers/grade.reducer';
import * as gateReducer from './reducers/gate.reducer';
import * as itemTypeReducer from './reducers/itemtype.reducer';
import * as VisitorAreasReducer from './reducers/visitorarea.reducer';
import * as VisitorTypeReducer from './reducers/visitortype.reducer';
import * as VisitorPurposeReducer from './reducers/visitorpurpose.reducer';
import * as EmployeeReducer from './reducers/employee.reducer';
import * as EmployeeMasterReducer from './reducers/employeeMaster.reducer';
import * as AutoCodeReducer from './reducers/autocode.reducer';
import * as UserGroupReducer from './reducers/usergroup.reducer';
import * as AppDataReducer from './reducers/appData.reducer';
import * as fileUploadReducer from './reducers/fileUpload.reducer';
import * as globalsettingReducer from './reducers/globalsetting.reducer';
import * as UserGroupTypeReducer from './reducers/usergroupType.reducer';
import * as DocumentTypeReducer from './reducers/documentType.reducer';
import * as visitorPassTemplateReducer from './reducers/visitorPassTemplate.reducer';
import * as documentCategoryReducer from './reducers/documentCategory.reducer';
import * as tagMasterReducer from './reducers/tagMaster.reducer';
import * as VisitorAdminReducer from './reducers/visitorAdmin.reducer';
import * as globalEmployeeFilterReducer from './reducers/globalEmployeefilter.reducer';
import * as shiftReducer from './reducers/shift.reducer';
import * as EmployeeUserGroupReducer from './reducers/employeeusergroup.reducer';
import * as MenuItemReducer from './reducers/menuitem.reducer';
import * as CurrentMenuItemReducer from './reducers/menuitem.reducer';
import * as UserMenuItemReducer from './reducers/menuitem.reducer';
import * as AttendancePolicyMasterReducer from './reducers/attendancepolicy.reducer';
import * as MailServerReducer from './reducers/mailserver.reducer';
import * as SmsServerReducer from './reducers/smsServer.reducer';
import * as EmployeeOUReducer from './reducers/employeeou.reducer';
import * as LeaveReducer from './reducers/leave.reducer';
import * as GeneralSettingsReducer from './reducers/VisitorGeneralSetting.reducer';
import * as HolidayMasterReducer from './reducers/holidayMaster.reducer';
import { expressionType } from "@angular/compiler/src/output/output_ast";
import * as HolidayCalender from './reducers/holidayCalenderPolicy.reducer';
import * as ReportMaster from './reducers/report.reducer';
import * as UserAttendanceDetailReducer from './reducers/userattendanceDetail.reducer';
import * as UserPunchDetailReducer from './reducers/userPunchDetail.reducer';
import * as WorkflowRule from './reducers/workflow.reducer';
import * as employeeDashboardSettingReducer from './reducers/globalEmployeefilter.reducer';
import * as reqReducer from './reducers/request-flow.reducer';
import { payrollAppReducers } from './payroll.app.state';
// Reducers Imports



export interface AppState {
    BusinessTypeList: MasterReducers.BusinessState;
    branchList: branchReducers.BranchState;
    categoryList: categoryReducer.CategoryState;
    companyList: companyReducer.CompanyState;
    contractorList: contractorReducer.ContractorState;
    cityList: cityReducer.CityState;
    departmentList: departmentReducer.DepartmentState;
    designationList: designationReducer.DesignationState;
    qualificationList: qualificationReducer.QualificationState;
    subdepartmentList: subdepartmentReducer.SubDepartmentState;
    sectionList: sectionReducer.SectionState;
    bankList: bankReducer.BankState;
    bankbranchList: bankbranchReducer.BankBranchState;
    levelList: levelReducer.LevelState;
    natureofworkList: natureofworkReducer.NatureofworkState;
    orgnaizationList: organizationReducer.OrganizationState;
    dispensaryList: dispensaryReducer.DispensaryState;
    gradeList: gradeReducer.GradeState;
    gateList: gateReducer.GateState;
    itemTypesList: itemTypeReducer.ItemTypesState;
    visitorAreasList:VisitorAreasReducer.VisitorAreasState;
    visitorTypeList:VisitorTypeReducer.VisitorTypeState;
    visitorPurposeList:VisitorPurposeReducer.VisitorPurposeState;
    employeeList:EmployeeReducer.EmployeeState;
    employeeMasterList:EmployeeMasterReducer.EmployeeMasterState;
    autocodeList:AutoCodeReducer.AutoCodeState;
    orgList:AutoCodeReducer.AutoCodeOrgState
    userGroupList:UserGroupReducer.UserGroupState;
    appDataList:AppDataReducer.AppDataState;
    fileuploadList:fileUploadReducer.FileUploadState;
    globalsettingList:globalsettingReducer.GlobalSettingeState;
    userGroupTypeList:UserGroupTypeReducer.UserGroupTypeState;
    documentTypeList:DocumentTypeReducer.DocumentTypeState;
    visitorPassTemplateList:visitorPassTemplateReducer.VisitorPassTemplateState;
    documentCategoryList:documentCategoryReducer.DocumentCategoryState;
    tagMasterList:tagMasterReducer.TagMasterState,
    visitorAdminList:VisitorAdminReducer.VisitorAdminState,
    globalEmployeeFilterList:globalEmployeeFilterReducer.GlobalEmployeeFilterState,
    shiftMasterList: shiftReducer.ShiftState,
    employeeUserGroupList: EmployeeUserGroupReducer.EmployeeUserGroupState,
    menuItemsList: MenuItemReducer.UserGroupMenuTypeState,
    currentMenuItemsList: CurrentMenuItemReducer.CurrentUserMenuState,
    userMenuItemList: UserMenuItemReducer.UserAccessMenuState,
    attendancePolicyMasterList: AttendancePolicyMasterReducer.AttendancePolicyMasterState,
    shiftMappingList: shiftReducer.ShiftMappedState,
    leaveMasterList: LeaveReducer.LeaveState,
    mailserverList:MailServerReducer.MailserverState,
    smsServerList:SmsServerReducer.SmsServerState,
    employeesOUStatusList : EmployeeOUReducer.EmployeeOUStatusState,
    generalSettingsList : GeneralSettingsReducer.GeneralSettingsState,
    leavePolicyList: LeaveReducer.LeavePolicyState,
    leavePolicyMappingList: LeaveReducer.LeavePolicyMapingState,
    holidayMasterList : HolidayMasterReducer.HolidayMasterState,
    holidayCalenderPolicyList : HolidayCalender.HolidayCalenderPolicyState,
    reportList: ReportMaster.ReportState,
    userAttendanceDeatilList:UserAttendanceDetailReducer.UserAttendanceDetailState,
    userPunchDeatilList:UserPunchDetailReducer.UserPunchDetailState,
    workflowRuleList: WorkflowRule.WorkflowState,
    employeeDashboardSettingList: employeeDashboardSettingReducer.EmployeeDashboardSettingState,
    requestflowList:reqReducer.RequestState,
    requestflowAppList:reqReducer.RequestAppState,
}

export const appReducers = {
  businessType: MasterReducers.businessTypeReducer,
  branchData: branchReducers.branchReducer,
  categoryData: categoryReducer.categoryReducer,
  companyData: companyReducer.companyReducer,
  contractorData: contractorReducer.contractorReducer,
  cityData: cityReducer.CityReducer,
  departmentData: departmentReducer.DepartmentReducer,
  designationData: designationReducer.DesignationReducer,
  qualificationData: qualificationReducer.QualificationReducer,
  subdepartmentData: subdepartmentReducer.SubDepartmentReducer,
  sectionData: sectionReducer.SectionReducer,
  bankData: bankReducer.bankReducer,
  bankbranchData: bankbranchReducer.bankbranchReducer,
  levelData: levelReducer.levelReducer,
  natureofworkData: natureofworkReducer.natureofworkReducer,
  organizationData: organizationReducer.organizationReducer,
  dispensaryData : dispensaryReducer.DispensaryReducer,
  gradeData : gradeReducer.gradeReducer,
  gateData:gateReducer.GateReducer,
  itemtypeData:itemTypeReducer.ItemTypesReducer,
  visitorareaData:VisitorAreasReducer.VisitorAreasReducer,
  visitortypeData:VisitorTypeReducer.VisitorTypeReducer,
  visitorpurposeData:VisitorPurposeReducer.VisitorPurposeReducer,
  employeeData:EmployeeReducer.employeeReducer,
  employeeMasterData:EmployeeMasterReducer.employeeMasterReducer,
  autocodeData:AutoCodeReducer.autocodeReducer,
  autocodeOrgData:AutoCodeReducer.autocodeOrgReducer,
  userGroupData:UserGroupReducer.userGroupReducer,
  appdataData:AppDataReducer.appDataReducer,
  fileUploadTypeData:fileUploadReducer.fileuploadReducer,
  globalsettingData:globalsettingReducer.globalsettingReducer,
  userGroupTypeData:UserGroupTypeReducer.userGroupTypeReducer,
  documentTypeData:DocumentTypeReducer.DocumentTypeReducer,
  visitorPassTemplateData:visitorPassTemplateReducer.visitorPassTemplateReducer,
  dcoumentCategoryData:documentCategoryReducer.documentCategoryReducer,
  tagMasterData:tagMasterReducer.tagMasterReducer,
  visitorAdminData:VisitorAdminReducer.VisitorAdminReducer,
  shiftDataList:shiftReducer.ShiftMasterReducer,
  globalEmployeeFilterData:globalEmployeeFilterReducer.globalEmployeeFilterReducer,
  employeeUserGroupData: EmployeeUserGroupReducer.employeeUserGroupReducer,
  menuItemsData : MenuItemReducer.menuItemReducer,
  currentMenuItemsData :  CurrentMenuItemReducer.currentMenuItemReducer,
  userMenuItemData: UserMenuItemReducer.userAccessMenuItemReducer,
  attendancePolicyMasterData : AttendancePolicyMasterReducer.AttendancePolicyMasterReducer,
  shiftMappedDataList:shiftReducer.ShiftMappedReducer,
  leaveDataList: LeaveReducer.LeaveMasterReducer,
  mailserverData:MailServerReducer.MailserverReducer,
  smsServerData:SmsServerReducer.SmsServerReducer,
  employeesOUStatusData : EmployeeOUReducer.employeeOUStatusReducer,
  visitorgeneralSettingsData : GeneralSettingsReducer.GeneralsettingsReducer,
  leavePolicyList: LeaveReducer.LeavePolicyReducer,
  leavePolicyMappingList: LeaveReducer.LeavePolicyMappingReducer,
  holidayMasterData : HolidayMasterReducer.HolidayMasterReducer,
  holidayCalenderPolicyData : HolidayCalender.HolidayCalenderPolicyReducer,
  reportData : ReportMaster.ReportReducer,
  userAttendanceDeatilData : UserAttendanceDetailReducer.UserAttendanceDetailReducer,
  userPunchDeatilData : UserPunchDetailReducer.UserPunchDetailReducer,
  workflowRuleData: WorkflowRule.WorkflowReducer,
  employeeDashboardSettingData: employeeDashboardSettingReducer.employeeDashboardSettingReducer,
  requestFlowData:reqReducer.RequestReducer,
  requestFlowAppData:reqReducer.RequestApproveReducer,  
};

export const selectBusinessTypeState = createFeatureSelector<any>('businessType');
export const selectBranchState = createFeatureSelector<any>('branchData');
export const selectCategoryState = createFeatureSelector<any>('categoryData');
export const selectCompanyState = createFeatureSelector<any>('companyData');
export const selectContractorState = createFeatureSelector<any>('contractorData');
export const selectCityState = createFeatureSelector<any>('cityData');
export const selectDepartmentState = createFeatureSelector<any>('departmentData');
export const selectDesignationState = createFeatureSelector<any>('designationData');
export const selectQualificationState = createFeatureSelector<any>('qualificationData');
export const selectSubDepartmentState = createFeatureSelector<any>('subdepartmentData');
export const selectSectionState = createFeatureSelector<any>('sectionData');
export const selectBankState = createFeatureSelector<any>('bankData');
export const selectBankBranchState = createFeatureSelector<any>('bankbranchData');
export const selectLevelState = createFeatureSelector<any>('levelData');
export const selectNatureofworkState = createFeatureSelector<any>('natureofworkData');
export const selectOrganizationState = createFeatureSelector<any>('organizationData');
export const selectDispensaryState = createFeatureSelector<any>('dispensaryData');
export const selectGradeState = createFeatureSelector<any>('gradeData');
export const selectGateState = createFeatureSelector<any>('gateData');
export const selectItemTypeState = createFeatureSelector<any>('itemtypeData');
export const selectVisitorAreaState = createFeatureSelector<any>('visitorareaData');
export const selectVisitorTypeState = createFeatureSelector<any>('visitortypeData');
export const selectVisitorPurposeState = createFeatureSelector<any>('visitorpurposeData');
export const selectEmployeeState = createFeatureSelector<any>('employeeData');
export const selectEmployeeMasterState = createFeatureSelector<any>('employeeMasterData');
export const selectAutoCodeState = createFeatureSelector<any>('autocodeData');
export const selectAutoCodeOrgState = createFeatureSelector<any>('autocodeOrgData');
export const selectUserGroupState = createFeatureSelector<any>('userGroupData');
export const selectAppDataState = createFeatureSelector<any>('appdataData');
export const selectFileUploadState = createFeatureSelector<any>('fileUploadTypeData');
export const selectGlobalSettingState = createFeatureSelector<any>('globalsettingData');
export const selectUserGroupTypeState = createFeatureSelector<any>('userGroupTypeData');
export const selectDocumentTypeState = createFeatureSelector<any>('documentTypeData');
export const selectVisitorPassTemplateState = createFeatureSelector<any>('visitorPassTemplateData');
export const selectDocumentCategoryState = createFeatureSelector<any>('dcoumentCategoryData');
export const selectTagMasterState = createFeatureSelector<any>('tagMasterData');
export const selectVisitorAdminState = createFeatureSelector<any>('visitorAdminData');
export const selectGlobalEmployeeFilterState = createFeatureSelector<any>('globalEmployeeFilterData');
export const selectShiftState = createFeatureSelector<any>('shiftDataList');
export const selectEmployeeUserGroupState = createFeatureSelector<any>('employeeUserGroupData');
export const selectUserMenuItems = createFeatureSelector<any>('menuItemsData');
export const currentUserMenuItems = createFeatureSelector<any>('currentMenuItemsData');
export const userAccessMenuItems = createFeatureSelector<any>('userMenuItemData');
export const selectAttendancePolicyMasterState = createFeatureSelector<any>('attendancePolicyMasterData');
export const selectShiftMaappedState = createFeatureSelector<any>('shiftMappedDataList');
export const selectMailServerState = createFeatureSelector<any>('mailserverData');
export const selectsmsServerState =  createFeatureSelector<any>('smsServerData');
export const selectEmployeesOUStatusState= createFeatureSelector<any>('employeesOUStatusData');
export const selectGeneralSettingsState= createFeatureSelector<any>('visitorgeneralSettingsData');
export const selectLeaveMasterState = createFeatureSelector<any>('leaveDataList');
export const selectLeavePolicyState = createFeatureSelector<any>('leavePolicyList');
export const selectLeavePolicyMappingState = createFeatureSelector<any>('leavePolicyMappingList');
export const selectHolidayMasterState = createFeatureSelector<any>('holidayMasterData');
export const selectHolidayCaldenderPolicyState = createFeatureSelector<any>('holidayCalenderPolicyData');
export const selectReportSetupState = createFeatureSelector<any>('reportData');
export const selectUserAttendanceDetailState = createFeatureSelector<any>('userAttendanceDeatilData');
export const selectUserPunchDetailState = createFeatureSelector<any>('userPunchDeatilData');
export const selectWorkflowRuleState = createFeatureSelector<any>('workflowRuleData');
export const employeeDashboardSettingState = createFeatureSelector<any>('employeeDashboardSettingData');
export const requestState = createFeatureSelector<any>('requestFlowData');
export const requestApproveState = createFeatureSelector<any>('requestFlowAppData');
