import { Action } from '@ngrx/store';
import { HolidayCalenderPolicy } from '../model/holidaycalenderpolicy.model';
import { HolidayMaster } from '../model/holidayMaster.model';
import { Bank, BankBranch, Branch, BusinessTypeModel, Category, 
  City, Company, Contractor, Department, Designation, Dispensary, 
  DocumentTypes, Gate, Grade, ItemTypes, Level, NatureOfWork, Organization, 
  Qualification, Section, SubDepartment, VisitorAreas, VisitorPassTemplate,
  VisitorType, VisitPurpose, ShiftMaster, policyMasters, attendancepolicy, ShiftMappingModel, LeaveModel, leavePolicyMapping } from '../model/master-data.model';

export const SAVE_BUSINESS_TYPE = '[SL_UI] SAVE BUSINESS TYPE';
export const UPDATE_BUSINESS_TYPE = '[SL_UI] UPDATE BUSINESS TYPE';
export const SAVE_BRANCH = '[SL_UI] SAVE BRANCH';
export const UPDATE_BRANCH = '[SL_UI] UPDATE BRANCH';
export const SAVE_CATEGORY = '[SL_UI] SAVE CATEGORY';
export const UPDATE_CATEGORY = '[SL_UI] UPDATE CATEGORY';
export const SAVE_COMPANY = '[SL_UI] SAVE COMPANY';
export const UPDATE_COMPANY = '[SL_UI] UPDATE COMPANY';
export const SAVE_DEPARTMENT = '[SL_UI] SAVE DEPARTMENT';
export const UPDATE_DEPARTMENT = '[SL_UI] UPDATE DEPARTMENT';
export const SAVE_DESIGNATION = '[SL_UI] SAVE DESIGNATION';
export const UPDATE_DESIGNATION = '[SL_UI] UPDATE DESIGNATION';
export const SAVE_CONTRACTOR = '[SL_UI] SAVE CONTRACTOR';
export const UPDATE_CONTRACTOR = '[SL_UI] UPDATE CONTRACTOR';
export const SAVE_CITY = '[SL_UI] SAVE CITY';
export const UPDATE_CITY = '[SL_UI] UPDATE CITY';
export const SAVE_QUALIFICATION = '[SL_UI] SAVE QUALIFICATION';
export const UPDATE_QUALIFICATION = '[SL_UI] UPDATE QUALIFICATION';
export const SAVE_SUBDEPARTMENT = '[SL_UI] SAVE SUBDEPARTMENT';
export const UPDATE_SUBDEPARTMENT = '[SL_UI] UPDATE SUBDEPARTMENT';
export const SAVE_BANK = '[SL_UI] SAVE BANK';
export const UPDATE_BANK = '[SL_UI] UPDATE BANK';
export const SAVE_BNKBRANCH = '[SL_UI] SAVE BANKBRANCH';
export const UPDATE_BANKBRANCH = '[SL_UI] UPDATE BANKBRANCH';
export const SAVE_LEVEL = '[SL_UI] SAVE LEVEL';
export const UPDATE_LEVEL = '[SL_UI] UPDATE LEVEL';
export const SAVE_NATUREOFWORK = '[SL_UI] SAVE NATUREOFWORK';
export const UPDATE_NATUREOFWORK = '[SL_UI] UPDATE NATUREOFWORK';
export const SAVE_SECTION = '[SL_UI] SAVE SECTION';
export const UPDATE_SECTION = '[SL_UI] UPDATE SECTION';
export const SAVE_ORGANIZATION = '[SL_UI] SAVE ORGANIZATION';
export const UPDATE_ORGANIZATION = '[SL_UI] UPDATE ORGANIZATION';
export const SAVE_DISPENSARY = '[SL_UI] SAVE DISPENSARY';
export const UPDATE_DISPENSARY = '[SL_UI] UPDATE DISPENSARY';
export const SAVE_GRADE = '[SL_UI] SAVE GRADE';
export const UPDATE_GRADE = '[SL_UI] UPDATE GRADE';
export const SAVE_GATE = '[SL_UI] SAVE GATE';
export const UPDATE_GATE = '[SL_UI] UPDATE GATE';
export const SAVE_ITEM_TYPE = '[SL_UI] SAVE ITEM_TYPE';
export const UPDATE_ITEM_TYPE = '[SL_UI] UPDATE ITEM_TYPE';
export const SAVE_VISITOR_AREA = '[SL_UI] SAVE VISITOR_AREA';
export const UPDATE_VISITOR_AREA = '[SL_UI] UPDATE VISITOR_AREA';
export const SAVE_VISITOR_TYPE = '[SL_UI] SAVE VISITOR_TYPE';
export const UPDATE_VISITOR_TYPE = '[SL_UI] UPDATE VISITOR_TYPE';
export const SAVE_VISITOR_PURPOSE = '[SL_UI] SAVE VISITOR_PURPOSE';
export const UPDATE_VISITOR_PURPOSE = '[SL_UI] UPDATE VISITOR_PURPOSE';
export const SAVE_DOCUMENT_TYPE = '[SL_UI] SAVE DOCUMENT_TYPE';
export const UPDATE_DOCUMENT_TYPE = '[SL_UI] UPDATE DOCUMENT_TYPE';
export const SAVE_VISITOR_PASS_TEMPLATE = '[SL_UI] SAVE VISITOR_PASS_TEMPLATE';
export const UPDATE_VISITOR_PASS_TEMPLATE = '[SL_UI] UPDATE VISITOR_PASS_TEMPLATE';
export const GET_SHIFT_DATA = '[SL_UI] GET SHIFT DATA';
export const UPDTE_SHIFT_DATA = '[SL_UI] UPDATE SHIFT DATA';
export const GET_ATTENDANCE_POLICY_DATA = '[SL_UI] GET ATTENDANCE POLICY DATA';
export const UPDATE_ATTENDANCE_POLICY_DATA = '[SL_UI] UPDATE ATTENDANCE POLICY DATA';
export const GET_SHIFT_MAPPED_DATA = '[SL_UI] GET SHIFT MAPPED DATA';
export const UPDATE_SHIFT_MAPPED_DATA = '[SL_UI] UPDATE SHIFT MAPPED DATA';
export const GET_LEAVE_DATA = '[SL_UI] GET LEAVE DATA';
export const UPDTE_LEAVE_DATA = '[SL_UI] UPDATE LEAVE DATA';
export const GET_LEAVE_POLICY_DATA ='[SL_UI] GET LEAVE POLICY DATA';
export const UPDATE_LEAVE_POLICY_DATA ='[SL_UI] UPDATE LEAVE POLICY DATA';
export const GET_LEAVE_MAPPED_DATA = '[SL_UI] GET LEAVE MAPPED DATA';
export const UPDATE_LEAVE_MAPPED_DATA = '[SL_UI] GET LEAVE MAPPED DATA';
export const GET_HOLIDAY_MASTER = '[SL_UI] GET HOLIDAY MASTER ';
export const UPDTE_HOLIDAY_MASTER = '[SL_UI] UPDATE HOLIDAY MASTER';
export const SAVE_HOLIDAY_CALENDER_POLICY = '[SL_UI] SAVE HOLIDAY CALENDER POLICY ';
export const UPDTE_HOLIDAY_CALENDER_POLICY = '[SL_UI] UPDATE HOLIDAY CALENDER POLICY';
//start bussiness Type

export class saveBusinessTypeAction implements Action {
    readonly type = SAVE_BUSINESS_TYPE;
    constructor(public payload: BusinessTypeModel) { }
}

export class updateBusinessTypeAction implements Action {
  readonly type = UPDATE_BUSINESS_TYPE;
  constructor(public payload: BusinessTypeModel) { }
}
//end Bussiness Type

//Start Branch Type
export class saveBranchAction implements Action {
  readonly type = SAVE_BRANCH;
  constructor(public payload: Branch) { }
}

export class updateBranchAction implements Action {
readonly type = UPDATE_BRANCH;
constructor(public payload: Branch) { }
}
//End Branch Type
//Start Category Type
export class saveCategoryAction implements Action{
  readonly type = SAVE_CATEGORY;
  constructor(public payload:Category){}
}
export class updateCategoryAction implements Action{
  readonly type = UPDATE_CATEGORY;
  constructor(public payload:Category){}
}
//End Category Type
//Start Company Type
export class saveCompanyAction implements Action{
  readonly type = SAVE_COMPANY;
  constructor(public payload:Company){}
}
export class updateCompanyAction implements Action{
  readonly type = UPDATE_COMPANY;
  constructor(public payload:Company){}
}
//End Company Type
//Start Contractor Type
export class saveContractorAction implements Action{
  readonly type = SAVE_CONTRACTOR;
  constructor(public payload:Contractor){}
}
export class updateContractorAction implements Action{
  readonly type = UPDATE_CONTRACTOR;
  constructor(public payload:Contractor){}
}
//End Contractor Type
//Start City Type
export class saveCityAction implements Action{
  readonly type = SAVE_CITY;
  constructor(public payload:City){}
}
export class updateCityAction implements Action{
  readonly type = UPDATE_CITY;
  constructor(public payload:City){}
}
//End City Type
//Start Department Type
export class saveDepartmentAction implements Action{
  readonly type = SAVE_DEPARTMENT;
  constructor(public payload:Department){}
}
export class updateDepartmentAction implements Action{
  readonly type = UPDATE_DEPARTMENT;
  constructor(public payload:Department){}
}
//End Department Type
//Start Designation Type
export class saveDesignationAction implements Action{
  readonly type = SAVE_DESIGNATION;
  constructor(public payload:Designation){}
}
export class updateDesignationAction implements Action{
  readonly type = UPDATE_DESIGNATION;
  constructor(public payload:Designation){}
}
//End Designation Type
//Start Qualification Type
export class saveQualificationAction implements Action{
  readonly type = SAVE_QUALIFICATION;
  constructor(public payload:Qualification){}
}
export class updateQualificationAction implements Action{
  readonly type = UPDATE_QUALIFICATION;
  constructor(public payload:Qualification){}
}
//End Qualification Type
//Start SubDepartment Type
export class saveSubDepartmentAction implements Action{
  readonly type = SAVE_SUBDEPARTMENT;
  constructor(public payload:SubDepartment){}
}
export class updateSubDepartmentAction implements Action{
  readonly type = UPDATE_SUBDEPARTMENT;
  constructor(public payload:SubDepartment){}
}
//End SubDepartment Type
//Start Section Type
export class saveSectionAction implements Action{
  readonly type = SAVE_SECTION;
  constructor(public payload:Section){}
}
export class updateSectionAction implements Action{
  readonly type = UPDATE_SECTION;
  constructor(public payload:Section){}
}
//End Section Type
//Start Babk Type
export class saveBankAction implements Action{
  readonly type = SAVE_BANK;
  constructor(public payload:Bank){}
}
export class updateBankAction implements Action{
  readonly type = UPDATE_BANK;
  constructor(public payload:Bank){}
}
//End bank Type
//Start BankBranch Type
export class saveBankBranchAction implements Action{
  readonly type = SAVE_BNKBRANCH;
  constructor(public payload:BankBranch){}
}
export class updateBankBranchAction implements Action{
  readonly type = UPDATE_BANKBRANCH;
  constructor(public payload:BankBranch){}
}
//End BankBranch Type
//Start level Type
export class saveLevelAction implements Action{
  readonly type = SAVE_LEVEL;
  constructor(public payload:Level){}
}
export class updateLevelAction implements Action{
  readonly type = UPDATE_LEVEL;
  constructor(public payload:Level){}
}
//End Level Type
//Start Nature of Work Type
export class saveNatureofWorkAction implements Action{
  readonly type = SAVE_NATUREOFWORK;
  constructor(public payload:NatureOfWork){}
}
export class updateNatureofWorkAction implements Action{
  readonly type = UPDATE_NATUREOFWORK;
  constructor(public payload:NatureOfWork){}
}
//End Nature of Work Type
//Start Organization
export class saveOrganizationAction implements Action{
  readonly type = SAVE_ORGANIZATION;
  constructor(public payload:Organization){}
}
export class updateOrganizationAction implements Action{
  readonly type = UPDATE_ORGANIZATION;
  constructor(public payload:Organization){}
}
//End Organization
//Start Dispensary
export class saveDispensaryAction implements Action{
  readonly type = SAVE_DISPENSARY;
  constructor(public payload:Dispensary){}
}
export class updateDispensaryAction implements Action{
  readonly type = UPDATE_DISPENSARY;
  constructor(public payload:Dispensary){}
}
//End Dispensary
//Start Grade
export class saveGradeAction implements Action{
  readonly type = SAVE_GRADE;
  constructor(public payload:Grade){}
}
export class updateGradeAction implements Action{
  readonly type = UPDATE_GRADE;
  constructor(public payload:Grade){}
}
//End Grade
//Start Gate
export class saveGateAction implements Action{
  readonly type = SAVE_GATE;
  constructor(public payload:Gate){}
}
export class updateGateAction implements Action{
  readonly type = UPDATE_GATE;
  constructor(public payload:Gate){}
}
//End Gate
//Start Item Type
export class saveItemTypeAction implements Action{
  readonly type = SAVE_ITEM_TYPE;
  constructor(public payload:ItemTypes){}
}
export class updateItemTypeAction implements Action{
  readonly type = UPDATE_ITEM_TYPE;
  constructor(public payload:ItemTypes){}
}
//End Item Type
//Start VisitorArea
export class saveVisitorAreaAction implements Action{
  readonly type = SAVE_VISITOR_AREA;
  constructor(public payload:VisitorAreas){}
}
export class updateVisitorAreaAction implements Action{
  readonly type = UPDATE_VISITOR_AREA;
  constructor(public payload:VisitorAreas){}
}
//End VisitorArea
//Start VisitorType
export class saveVisitorTypeAction implements Action{
  readonly type = SAVE_VISITOR_TYPE;
  constructor(public payload:VisitorType){}
}
export class updateVisitorTypeAction implements Action{
  readonly type = UPDATE_VISITOR_TYPE;
  constructor(public payload:VisitorType){}
}
//End VisitorType
//Start Visitor Purpose
export class saveVisitorPurposeAction implements Action{
  readonly type = SAVE_VISITOR_PURPOSE;
  constructor(public payload:VisitPurpose){}
}
export class updateVisitorPurposeAction implements Action{
  readonly type = UPDATE_VISITOR_PURPOSE;
  constructor(public payload:VisitPurpose){}
}
//End Visitor Purpose
//Start Document Type
export class saveDocumentTypeAction implements Action{
  readonly type = SAVE_DOCUMENT_TYPE;
  constructor(public payload:DocumentTypes){}
}
export class updateDocumentTypeAction implements Action{
  readonly type = UPDATE_DOCUMENT_TYPE;
  constructor(public payload:DocumentTypes){}
}
//End Document Type
//Start Visitor Pass Template
export class saveVisitorPassTemplateAction implements Action{
  readonly type = SAVE_VISITOR_PASS_TEMPLATE;
  constructor(public payload:VisitorPassTemplate){}
}
export class updateVisitorPassTemplateAction implements Action{
  readonly type = UPDATE_VISITOR_PASS_TEMPLATE;
  constructor(public payload:VisitorPassTemplate){}
}
//End Visitor Pass Template

/**
 * get Shift data 
 */
 export class saveShiftData implements Action{
  readonly type = GET_SHIFT_DATA;
  constructor(public payload:ShiftMaster){}
}
export class saveShiftMappingData implements Action{
  readonly type = GET_SHIFT_MAPPED_DATA;
  constructor(public payload:ShiftMappingModel){}
}

export class updateShiftMappingData implements Action{
  readonly type = UPDATE_SHIFT_MAPPED_DATA;
  constructor(public payload:ShiftMappingModel){}
}

//Start Attendance Policy
export class saveAttendancePolicyAction implements Action{
  readonly type = GET_ATTENDANCE_POLICY_DATA;
  constructor(public payload:attendancepolicy){}
}
export class updateAttendancePolicyAction implements Action{
  readonly type = UPDATE_ATTENDANCE_POLICY_DATA;
  constructor(public payload:attendancepolicy){}
}
//End Attendance Policy

/**
 * get Leave data 
 */
 export class saveLeaveData implements Action{
  readonly type = GET_LEAVE_DATA;
  constructor(public payload:LeaveModel){}
}
//Start Holiday Master
export class saveHolidayMasterAction implements Action{
  readonly type = GET_HOLIDAY_MASTER;
  constructor(public payload:HolidayMaster){}
}
export class updateHolidayMasterAction implements Action{
  readonly type = UPDTE_HOLIDAY_MASTER;
  constructor(public payload:HolidayMaster){}
}
//End Holiday Master

//Start leave Policy
export class saveLeavePolicyAction implements Action{
  readonly type = GET_LEAVE_POLICY_DATA;
  constructor(public payload:attendancepolicy){}
}
export class updateLeavePolicyAction implements Action{
  readonly type = UPDATE_LEAVE_POLICY_DATA;
  constructor(public payload:attendancepolicy){}
}

export class saveLeaveMappingData implements Action{
  readonly type = GET_LEAVE_MAPPED_DATA;
  constructor(public payload:leavePolicyMapping){}
}

export class updateLeaveMappingData implements Action{
  readonly type = UPDATE_LEAVE_MAPPED_DATA;
  constructor(public payload:leavePolicyMapping){}
}
//End leave Policy
//Start Holiday Calender Policy
export class saveHolidayCalenderPolicyAction implements Action{
  readonly type = SAVE_HOLIDAY_CALENDER_POLICY;
  constructor(public payload:HolidayCalenderPolicy){}
}
export class updateHolidayCalenderPolicyAction implements Action{
  readonly type = UPDTE_HOLIDAY_CALENDER_POLICY;
  constructor(public payload:HolidayCalenderPolicy){}
}
//End Holiday Calender Policy

  export type Actions = saveBusinessTypeAction | updateBusinessTypeAction
                        | saveBranchAction | updateBranchAction
                        | saveCategoryAction | updateCategoryAction
                        | saveCompanyAction | updateCompanyAction
                        | saveContractorAction | updateContractorAction
                        | saveCityAction | updateCityAction
                        | saveDepartmentAction | updateDepartmentAction
                        | saveDesignationAction | updateDesignationAction
                        | saveQualificationAction | updateQualificationAction
                        | saveSubDepartmentAction | updateSubDepartmentAction
                        | saveSectionAction | updateSectionAction
                        | saveBankAction | updateBankAction
                        | saveBankBranchAction | updateBankBranchAction
                        | saveLevelAction | updateLevelAction
                        | saveNatureofWorkAction | updateNatureofWorkAction
                        | saveOrganizationAction | updateOrganizationAction
                        | saveDispensaryAction | updateDispensaryAction
                        | saveGradeAction | updateGradeAction
                        | saveGateAction | updateGateAction
                        | saveItemTypeAction | updateItemTypeAction
                        | saveVisitorAreaAction | updateVisitorAreaAction
                        | saveVisitorTypeAction | updateVisitorTypeAction
                        | saveVisitorPurposeAction | updateVisitorPurposeAction
                        | saveDocumentTypeAction | updateDocumentTypeAction
                        | saveVisitorPassTemplateAction |  updateVisitorPassTemplateAction
                        | saveShiftData 
                        | saveAttendancePolicyAction | updateAttendancePolicyAction
                        | saveShiftMappingData | updateShiftMappingData
                        | saveLeaveData | saveLeavePolicyAction | updateLeavePolicyAction 
                        | saveLeaveMappingData | updateLeaveMappingData
                        | saveLeaveData | saveHolidayMasterAction | updateHolidayMasterAction
                        | saveHolidayCalenderPolicyAction | updateHolidayCalenderPolicyAction
