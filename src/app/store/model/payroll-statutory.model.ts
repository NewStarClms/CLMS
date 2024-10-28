export class PFSetting{
  employeePF: number
    pfOnGrossEarning: boolean
    pfOnGrossLimit: number
    proratePFGrossOnPaidDays: boolean
    prorateGrossLimitOnPaidDays: boolean
    employerPFAcc10: number
    employerPFAcc10Limit: number
    employerPFAcc1: number
    employerPFAcc1GrossEarning: boolean
    employerPFAcc1Limit: number
    pfAdminAcc2: number
    pfAdminAcc2MinimumCharge: number
    edliAcc21: number
    edliAcc21MinimumCharge: number
    edliAdminAcc22: number
    edliAdminAcc22MinimumCharge: number
    showOnChallanWithZeroPF: boolean
    pfPartOfCTC: boolean
    vpfAllow: boolean
    vpfOn: string | null
    vpfValue: number
    vpfOnGrossEarning: boolean
    vpfOnGrossLimit: number
    proratePensionWageLimit: boolean
    pensionAgeLimit: number
    pfRounding: number
    vpfRounding: number
    pfOnArrear: boolean
    minimumPFGrossLimit: number
    pfRecoveryOnFNF: boolean
  }
  export interface ESISetting{
    employeeESI: number,
    esiOnGrossEarning: boolean,
    esiOnGrossLimit: number,
    prorateOnPaidDays: boolean,
    employerESI: number,
    employeeESIRound: number,
    employerESIRound: number,
    esiOnArrear: boolean,
    esiOnOT: boolean,
    showOnChallanWithZeroESI: boolean,
    esiPartOfCTC: boolean,
    minimumESIGrossLimit: number,
    esiRecoveryOnFNF: boolean,
    otesiInclueInChallan: boolean
  }
  export interface LWFSetting{
    stateID: number,
  stateName: string | null,
  lwfDeductionRule: string | null,
  lwfDeductionRuleName: string | null,
  employeeLWF: number,
  maximumEmployeeLWF: number,
  lwfOnGrossSalary: true,
  prorateOnPaidDays: true,
  employerLWF: number,
  maximumEmployerLWF: number,
  employeeLWFRound: number,
  employerLWFRound: number,
  lwfOnArrear: true,
  showOnChallanWithZeroLWF: true,
  lwfPartOfCTC: true,
  apR_Amount: number,
  maY_Amount: number,
  juN_Amount: number,
  juL_Amount: number,
  auG_Amount: number,
  seP_Amount: number,
  ocT_Amount: number,
  noV_Amount: number,
  deC_Amount: number,
  jaN_Amount: number,
  feB_Amount: number,
  maR_Amount: number,
  apR_Amount_Employer: number,
  maY_Amount_Employer: number,
  juN_Amount_Employer: number,
  juL_Amount_Employer: number,
  auG_Amount_Employer: number,
  seP_Amount_Employer: number,
  ocT_Amount_Employer: number,
  noV_Amount_Employer: number,
  deC_Amount_Employer: number,
  jaN_Amount_Employer: number,
  feB_Amount_Employer: number,
  maR_Amount_Employer: number
  }
  export interface GratuitySetting{
    minimumYearFor6DayWorking: number,
    minimumMonthFor6DayWorking: number,
    minimumYearFor5DayWorking: number,
    minimumMonthFor5DayWorking: number,
    gratuityAmountLimit: number,
    gratuityMonthRound: number,
    gratuityFormula: string | null
  }
  export interface MinimumWagesSetting{
    stateID: number,
    stateName: string | null,
    minimumWagesMapping: Array<MinimumWagesSettingMapping>
    xmlMinimumWages: string
  }
  export interface MinimumWagesSettingMapping{
    stateID: number,
    employeeSkillTypeID: number,
    employeeSkillTypeName: string | null,
    minimumWagesAmount: number
  }
  export interface PTSetting{
    stateID: number
    stateName: string | null
    ptOnArrear: true,
    ptSlab: Array<ptSlab>
    xmlSlab: string
  }
  export interface ptSlab
    {
      stateID: number,
      minimumLimit: number,
      maximumLimit: number,
      taxAmount: number
    }
  export interface BonusSetting {
    bonusSettingID: number,
    bonusSettingName: string | null,
    bonusOnWhich:  string | null,
    minimumDaysForBonus: number,
    prorateOnPaidDays: Boolean,
    bonusPercentage: number,
    bonusAmountLimit: number,
    bonusOnArrear: Boolean,
    exgratiaAllow: Boolean,
    exgratiaAmountLimit: number,
    remarks:  string | null,
    bonusSlab: Array<BonusSlab>;
    xmlSlab:  string | null
  }

  export interface BonusSlab{
    bonusSettingID: number,
    ceilingFrom: number,
    ceilingTo: number,
    amountCalculatiOn: string | null,
    fixedAmount: number
  }