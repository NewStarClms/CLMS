export interface BusinessTypeModel {
    businessTypeList: BusinessType[]
}
export interface BusinessType {
    businessTypeID: number,
    businessTypeName: string | null
}

export interface BranchModel {
    branchList: Branch[]
}

export interface Branch {
    branchID: number,
    companyID: number,
    branchCode: string | null | null,
    branchName: string | null | null,
    address: string | null | null,
    countryID: number,
    stateID: number,
    cityID: number,
    branchHeadID: number,
    email: string | null | null,
    natureOfWorkID: number,
    pinCode: string | null,
    branchHeadDisplay : string | null,
    latitude: string | null,
    longitude: string | null
}
export interface CategoryModel {
  categoryList: Category[]
}
export interface Category {
        categoryID: number,
        categoryCode: string | null,
        categoryName: string | null,
        minimumWages: number
}

export interface Company{
        companyID: number,
        organizationID: number,
        companyCode: string | null,
        companyName: string | null,
        shortName: string | null,
        companyAddress: string | null,
        countryID: number,
        stateID: number,
        cityID: number,
        pinCode: string | null,
        phone: string | null,
        email: string | null,
        fax: string | null,
        webSite: string | null,
        companyLogoID: string | null,
        companyLogoUrl:string | null,
        panNo: string | null,
        tanNo: string | null,
        gstNo: string | null,
        pfNo: string | null,
        esiNo: string | null,
        licenseNo: string | null,
        registrationNo: string | null,
        viewNameOnReport: boolean | false,
        viewLogoOnReport: boolean | false,
        viewAddressOnReport: boolean | false
}
export interface Contractor{
    contractorID: number,
    contractorCode: string | null,
    contractorName: string | null,
    shortName: string | null,
    contractorAddress: string | null,
    countryID: number,
    stateID: number,
    cityID: number,
    pinCode: string | null,
    phone: string | null,
    email: string | null,
    fax: string | null,
    webSite: string | null,
    contractorLogo: string | null,
    panNo: string | null,
    tanNo: string | null,
    gstNo: string | null,
    pfNo: string | null,
    esiNo: string | null,
    licenseNo: string | null,
    registrationNo: string | null,
    contractorLogoID :string | null
    contractorLicenses:Array<contractorLicenses> | null
}
export interface contractorLicenses{
    contractorID: number,
licenseNo: string | null,
validityFromDate: string | null,
validityToDate: string | null,
coverage: string | null,
totalStrength: number,
maxNoofEmployees: number,
natureofWorkID: number,
locationofWorkID: number,
workStartDate: string | null,
workEndDate: string | null

}
export interface City{
  cityID: number,
  stateID: number,
  stateName: string | null,
  cityName: string | null,
  countryID: number,
  countryName: string | null
}

export interface Department{

  departmentID: number,
  departmentCode: string | null,
  departmentName: string | null,
  headOfDepartmentID: number,
  emailID: string | null
  headOfDepartmentDisplay: string | null
}

export interface Designation{
  designationID: number,
    designationCode: string | null,
    designationName: string | null
}

export interface Qualification{
  qualificationID: number,
    qualificationName: string | null
}

export interface SubDepartment{
  subDepartmentID: number,
  departmentID: number,
  subDepartmentCode: string | null,
  subDepartmentName: string | null,
  subDepartmentSupervisorID: number,
  emailID: string | null
  subDepartmentSupervisorDisplay: string | null
}

export interface Section{
  sectionID: number,
    sectionCode: string | null,
    sectionName: string | null,
    sectionSupervisorID: number,
    emailID: string | null,
    sectionSupervisorDisplay: string | null
}

export interface Bank{
  bankID: number,
    bankCode: string | null,
    bankName: string | null,
    address: string | null,
    countryID: number,
    stateID: number,
    cityID: number,
    ifscCode: string | null
}

export interface BankBranch{
  bankBranchID: number,
  bankID: number,
  bankBranchCode: string | null,
  bankBranchName: string | null,
  address: string | null,
  countryID: number,
  stateID: number,
  cityID: number,
  ifscCode: string | null
}

export interface Level{
    levelID: number,
    levelCode: string | null,
    levelName: string | null
}

export interface NatureOfWork{
  natureOfWorkID: number,
  natureOfWorkName: string | null
}

export interface Organization{
  organizationID: number,
      organizationCode: string | null,
      organizationName: string | null,
      organizationAddress: string | null,
      email: string | null,
      countryID: number,
      stateID: number,
      cityID: number,
      pinCode: string | null ,
      phone: string | null,
      fax: string | null,
      webSite: string | null,
      organizationLogo: string | null,
      businessTypeID: number,
      OrganizationLogoID:string | null
}
export interface Dispensary{
  dispensaryID:number,
      dispensaryName: string | null,
      phoneNumber: string | null,
      emailId: string | null,
      voipNumber: string | null,
      address: string | null,
      pinCode:number
}

export interface Grade{
  gradeID: number,
  gradeCode: string | null,
  gradeName: string | null,
}

export interface Gate{
      gateID: number,
      gateName: string | null,
      authorizedUser: string | null,
      emailID: string | null,
      authorizedUserDetails : string | null
}

export interface ItemTypes{
  itemTypeID: number,
  itemTypeName: string | null
}

export interface VisitorAreas{
  visitorAreaID: number,
  visitorAreaName: string | null
}
export interface VisitorType{
  visitorTypeID: number,
  visitorTypeName: string | null
}
export interface VisitPurpose{
  visitPurposeID: number,
  visitPurposeName: string | null
}

export interface DocumentTypes  {
  documentTypeID: number,
  documentCategoryID: number,
  documentTypeName: string | null,
  documentCategoryName: string | null
}
export interface VisitorPassTemplate{
  templateID: number,
      templateName: string | null,
      subject: string | null,
      template: string | null,
      alert: boolean,
      mail: boolean,
      gatePass: boolean,
      sms: boolean,
      sendToVisitor: boolean,
      sendToGateUser: boolean,
      sendToEmployee: boolean,
      requestStatusID: number
}
export interface documentCategory{
  key: string | null,
  value: number
}
export interface ShiftMaster{
  shift: Array<ShiftModel>;
}

export interface ShiftModel{
  minHoursToPresent: string | null,
      minHoursToHalfDay: string | null,
      maxHoursForSRT: string | null,
      maxWorkingHour: string | null,
      firstHalfConsiderUpto: string | null,
      permissibleLate: string | null,
      permissibleEarly: string | null,
      halfDayAfterLate: string | null,
      absentAfterLate: string | null,
      halfDayBeforeEarly: string | null,
      absentBeforeEarly: string | null,
      halfDayLateEarly: boolean| false,
      absentLateEarly: boolean| false,
      otMax: string | null,
      otMin: string | null,
      otStartAfter: string | null,
      otDeduction: string | null,
      otDutationForDinnerDeduction: string | null,
      otDinnerDeduction: string | null,
      otRemoveAfterLate: string | null,
      shiftAllowanceApplicable: boolean | false,
      minWorkingHourForShiftAllowance: string | null,
      lateMinuteForShiftAllowance: string | null,
      earlyMinuteForShiftAllowance: string | null,
      shiftAllowanceAmount: number | 0,
      viewOnOTProcess: boolean| false,
      shiftID: number | 0,
      shiftCode: string | null,
      shiftName: string | null,
      shiftType: number | 0,
      shiftStartTime: string | null,
      shiftEndTime: string | null,
      shiftDuration: string | null,
      lunchStartTime: string | null,
      lunchEndTime: string | null,
      lunchDuration: string | null,
      lunchIncludeInShiftDuration:boolean| false
}

export interface policyMasters
  {
    policyID: number,
    policyTypeID: number,
    policyName: string | null,
    description: string | null,
    mappedOnOrganization: boolean | true,
    mappingStatus: string | null 
  }
 
 export interface attendancepolicy {
    policyID: number,
    policyTypeID: number,
    policyName: string | null,
    description: string | null,
    mappedOnOrganization: boolean,
    mappingStatus: string | null,
    attendancePolicyID: number,
    cutOffDay: number,
    isOptimistic: boolean,
    maxBackDaysAR: number,
    maxCountInMonthAR: number,
    awAasAAA: boolean,
    ahAasAAA: boolean,
    minDayToHoliDayAsPaid: number,
    minDayToWeeklyOfAsPaid: number,
    maxWorkingHours: string | null,
    maxWorkingBasedOn: string | null,
    punchInShift: number,
    halfDayMarking: boolean,
    srtMarking: boolean,
    otosSetting: string | null,
    considerOutWork: boolean,
    deductOutWork: boolean,
    presentOnWeeklyOff: boolean,
    presentOnHoliday: boolean,
    missPunchAsAbsent: boolean,
    missPunchAsHalfDay: boolean,
    roundTheClockWorking: boolean,
    workingWithInOutMode: boolean,
    workingHoursStartFromShiftStart: boolean,
    workingHoursEndOnShiftEnd: boolean,
    workingHoursRound: number,
    statusBasedOnWorkingHoursInShift: boolean,
    gatePassCountInDay: number,
    maximumGatePassDuration: string | null,
    minimumGatePassDuration: string | null,
    gatePassCountMonth: number,
    maximumGatePassDurationInMonth: string | null,
    allowExceptionForGatePass: boolean,
    backDayGatePassAllow: boolean,
    maxBackDayGatePass: number,
    duplicateCheckMinute: string | null,
    endTimeForInPunch: string | null,
    endTimeForOutPunch: string | null,
    allowMaxWorkingHoursInMultiplePunch: boolean,
    fourPunchInNightShift: boolean,
    shiftType: string,
    defaultShiftId: number,
    allowShift: string | null,
    autoShift: boolean,
    earlyMinuteAutoShift: string | null,
    lateMinuteAutoShift: string | null,
    woIncludeInRotation: boolean,
    hldIncludeInRotation: boolean,
    shiftRotationDays: number,
    allowShiftOnWO: boolean,
    defaultShiftOnWO: number,
    weeklyOffSun: string | null,
    weeklyOffMon: string | null,
    weeklyOffTue: string | null,
    weeklyOffWed: string | null,
    weeklyOffThr: string | null,
    weeklyOffFri: string | null,
    weeklyOffSat: string | null,
    otFormula: number,
    otInMinus: boolean,
    allowOTOnHLD: boolean,
    deductOTOnHLD: string | null,
    maxOTOnHLD: string | null,
    allowOTOnWO: boolean,
    deductOTOnWO: string | null,
    maxOTOnWO: string | null,
    allowOTOnNHLD: boolean,
    deductOTOnNHLD: string | null,
    maxOTOnNHLD: string | null,
    minEarlyComingForOT: string | null,
    maxEarlyComingForOT: string | null,
    minLateGoingForOT: string | null,
    maxLateGoingForOT: string | null,
    otRound: boolean,
    otRoundFormula: number,
    roundValue1: number,
    roundValue2: number,
    secondHalfPresentAndRestOT: boolean,
    adminApprovalRequiredForOT: boolean,
    managerApprovalRequiredForOT: boolean,
    allowWorkFlowAprovalForOT: boolean,
    autoInitiateRequestForOT: boolean,
    allowCof: boolean,
    allowCofFor: string | null,
    minHoursForFullCof: string | null,
    minHoursForHalfCof: string | null,
    cofExpiredDays: string | null,
    workingDaysCof: boolean,
    weeklyOffCof: boolean,
    holidayCof: boolean,
    nationalHolidayCof: boolean,
    autoCredit: boolean,
    maxCreditInMonth: number,
    adminApprovalRequiredForCof: boolean,
    managerApprovalRequiredForCof: boolean,
    applicableFrom: string | null,
    workingHoursAccordingToShift: boolean,
    generateMultiple: boolean,
    lateEarlyDeductionApplicable: boolean,
    autoRunLateEarlyDeduction: boolean,
    webPunch: boolean,
    mobilePunch: boolean,
    numberOfPhoto: number,
    geoRadius: number,
    lateEarlyDeductionPolicies: Array<LateEarlyDeductionPolicies>;
   
  }


  export interface LateEarlyDeductionPolicies{
    policyID:number,
    policyBasedOnBased:string | null,
    attendanceStatus:string | null,
    eexemptDays:number,
    everyDays:number,
    deductFrom:string | null,
    deductValue:number,
    leaveList:string | null,
    lateEarlyCondition:string |null,
    lateFrom:number,
    lateTo:number,
    earlyFrom:number,
    earlyTo:number
  }

  export interface LateEarlyDeductionPoliciesModel{
    policyID:number,
    policyBasedOnBased:string | null,
    attendanceStatus:string | null,
    eexemptDays:number,
    everyDays:number,
    deductFrom:string | null,
    deductValue:number,
    leaveList:Array<number>,
    lateEarlyCondition:string |null,
    lateFrom:number,
    lateTo:number,
    earlyFrom:number,
    earlyTo:number
  }

  export interface organizationMapping {
      policyID: number,
      policyTypeID: number,
      workFlowID: number,
      organizationKeyID: number,
      locationKeyID: number,
      organization: Array<number>,
      location: Array<number>    
  }

  export interface ShiftMappingModel{
    mapping:Array<any>;
  }

  export interface ShiftMappedData{
      policyID: number ,
      shiftID: number,
      policyTypeID: number ,
      minHoursToPresent: string | null,
      minHoursToHalfDay: string | null,
      maxHoursForSRT: string | null,
      maxWorkingHour: string | null,
      firstHalfConsiderUpto: string | null,
      permissibleLate: string | null,
      permissibleEarly: string | null,
      halfDayAfterLate: string | null,
      absentAfterLate: string | null,
      halfDayBeforeEarly: string | null,
      absentBeforeEarly: string | null,
      halfDayLateEarly: boolean| false,
      absentLateEarly: boolean| false,
      otMax: string | null,
      otMin: string | null,
      otStartAfter: string | null,
      otDeduction: string | null,
      otDutationForDinnerDeduction: string | null,
      otDinnerDeduction: string | null,
      otRemoveAfterLate: string | null,
      shiftAllowanceApplicable: boolean | false,
      minWorkingHourForShiftAllowance: string | null,
      lateMinuteForShiftAllowance: string | null,
      earlyMinuteForShiftAllowance: string | null,
      shiftAllowanceAmount: number | 0,
      viewOnOTProcess: boolean| false,
      shiftCode?: string | null,
      shiftName?: string | null,
      shiftType?: number | 0,
      shiftStartTime?: string | null,
      shiftEndTime?: string | null,
      shiftDuration?: string | null,
      lunchStartTime?: string | null,
      lunchEndTime?: string | null,
      lunchDuration?: string | null,
      lunchIncludeInShiftDuration?:boolean| false 
  }

  export interface LeaveMasterList {
    leaveList: Array<LeaveModel>
  }

  export interface LeaveModel {
    leaveID: number | 0,
    leaveCode: string | null,
    leaveName: string,
    leaveType:string | null,
    leaveMapped: string | null,
    leaveCycle: string | null,
    halfDayAllowed: true,
    maxMonthlyRequestCount: 0,
    maxQuarterlyRequestCount:number | 0,
    maxHalfYearlyRequestCount:number | 0,
    maxYearlyRequestCount:number | 0,
    maxMonthlyLeaveCount:number | 0,
    maxQuarterlyLeaveCount:number | 0,
    maxHalfYearlyLeaveCount:number | 0,
    maxYearlyLeaveCount:number | 0,
    minLeavePerRequest:number | 0,
    maxLeavePerRequest:number | 0,
    advanceLeaveAllow: true,
    advanceLeaveCycle: string | null,
    woInclude: true,
    daysForWOInclude:number | 0,
    hoInclude: true,
    daysForHOInclude:number | 0,
    presentInclude: true,
    negativeAllowed: true,
    negativeLeaveLimit:number | 0,
    docRequired: true,
    docRequiredWhenLeaveMoreThan:number | 0,
    leaveRequestInAdvance: true,
    leaveRequestBeforeDays:number | 0,
    backDatedLeaveAllow: true,
    backDays:number | 0,
    backDatedLeaveAllowRM: true,
    backDaysRM:number | 0,
    backDatedLeaveAllowAdmin: true,
    backDaysAdmin:number | 0,
    leaveNotClub: true,
    leaveNotClubList: string | null,
    genderAllowed: string | null,
    applicableOnEmployeeStatus: true,
    employeeStatusAllowed: string | null,
    applicableOnEmployeeType: true,
    employeeTypeAllowed: string | null,
    minmumWorkForLeave: string | null,
    maxTimeDuration: string | null,
    encashable: true,
    encashableLimit:number | 0,
    balanceAfterEncashable:number | 0,
    carryForward: true,
    carryForwardLimit:number | 0,
    nhoInclude: true,
    leaveNotClubHalfDay: true,
    leaveNotClubListHalfDay: string | null,
    birthdayLeave: true,
    weddingAnniversaryLeave: true,
    accrual: true,
    accrualType: string | null,
    accrualOn: string | null,
    accrualOnDate:number | 0,
    fixed: true,
    leaveCreditNewJoineeRuleID:number | 0,
    daysOnAccrual:number | 0,
    leaveAccrued:number | 0,
    accrualDaysInclude: string | null,
    accrualDayFromPrevious: true,
    accrualOnEachAccrualDays: true,
    maxAccrualLimit:number | 0,
    maxAccrualLimitQuarterly:number | 0,
    maxAccrualLimitHalfYearly:number | 0,
    maxAccrualLimitYearly:number | 0,
    roundLeave:number | 0,
    employeeGenderForLeaveCredit: string | null,
    visibleToEmployee: boolean | true,
    mapped: boolean | false,

    leaveNotClubListSel:Array<number>|[],
    leaveNotClubListHalfDaySel: Array<number>|[],
    employeeStatusAllowedSel: Array<number>|[],
    employeeTypeAllowedSel: Array<number>|[],
    accrualDaysIncludeSel:Array<any>|[]

  }

  export interface LeavePolicyLst{
    policyes: Array<LeavePolicyDetail>
  }

  export interface LeavePolicyDetail {
      policyID: number | null,
      policyTypeID: number | null,
      policyName: string | null,
      description: string | null,
      mappedOnOrganization: boolean | false,
      mappingStatus: string | null
  }

  export interface leavePolicyMapping {
    leaveMappingList:Array<leaveCodeMappingModel>
  }
  
  export interface leaveCodeMappingModel
    {
      leaveID: number | 0,
      leaveCode: string | null,
      leaveName: string,
      leaveType:string | null,
      leaveMapped: string | null,
      leaveCycle: string | null,
      halfDayAllowed: true,
      maxMonthlyRequestCount: 0,
      maxQuarterlyRequestCount:number | 0,
      maxHalfYearlyRequestCount:number | 0,
      maxYearlyRequestCount:number | 0,
      maxMonthlyLeaveCount:number | 0,
      maxQuarterlyLeaveCount:number | 0,
      maxHalfYearlyLeaveCount:number | 0,
      maxYearlyLeaveCount:number | 0,
      minLeavePerRequest:number | 0,
      maxLeavePerRequest:number | 0,
      advanceLeaveAllow: true,
      advanceLeaveCycle: string | null,
      woInclude: true,
      daysForWOInclude:number | 0,
      hoInclude: true,
      daysForHOInclude:number | 0,
      presentInclude: true,
      negativeAllowed: true,
      negativeLeaveLimit:number | 0,
      docRequired: true,
      docRequiredWhenLeaveMoreThan:number | 0,
      leaveRequestInAdvance: true,
      leaveRequestBeforeDays:number | 0,
      backDatedLeaveAllow: true,
      backDays:number | 0,
      backDatedLeaveAllowRM: true,
      backDaysRM:number | 0,
      backDatedLeaveAllowAdmin: true,
      backDaysAdmin:number | 0,
      leaveNotClub: true,
      leaveNotClubList: string | null,
      genderAllowed: string | null,
      applicableOnEmployeeStatus: true,
      employeeStatusAllowed: string | null,
      applicableOnEmployeeType: true,
      employeeTypeAllowed: string | null,
      minmumWorkForLeave: string | null,
      maxTimeDuration: string | null,
      encashable: true,
      encashableLimit:number | 0,
      balanceAfterEncashable:number | 0,
      carryForward: true,
      carryForwardLimit:number | 0,
      nhoInclude: true,
      leaveNotClubHalfDay: true,
      leaveNotClubListHalfDay: string | null,
      birthdayLeave: true,
      weddingAnniversaryLeave: true,
      accrual: true,
      accrualType: string | null,
      accrualOn: string | null,
      accrualOnDate:number | 0,
      fixed: true,
      leaveCreditNewJoineeRuleID:number | 0,
      daysOnAccrual:number | 0,
      leaveAccrued:number | 0,
      accrualDaysInclude: string | null,
      accrualDayFromPrevious: true,
      accrualOnEachAccrualDays: true,
      maxAccrualLimit:number | 0,
      maxAccrualLimitQuarterly:number | 0,
      maxAccrualLimitHalfYearly:number | 0,
      maxAccrualLimitYearly:number | 0,
      roundLeave:number | 0,
      employeeGenderForLeaveCredit: string | null,
      visibleToEmployee: true,
      policyID: number |0,
      policyTypeID: number |0,

      leaveNotClubListSel:Array<number>|[],
      leaveNotClubListHalfDaySel: Array<number>|[],
      employeeStatusAllowedSel: Array<number>|[],
      employeeTypeAllowedSel: Array<number>|[],
      accrualDaysIncludeSel:Array<any>|[]
    
  }
