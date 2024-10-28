export interface Notification {
    groupID: number
    process: string | null
    sequenceNo: number
    massgaeText: string | null
    countNo: number
  }
export interface AttendanceProcessEmployeeDetail{
  data:Array<EmployeeDetailList>,
    totalRecords:number
}
export interface EmployeeDetailList{
  employeeID: number,
  employeeCode: string | null,
  employeeName: string | null,
  department: string | null,
  designation: string | null,
  category: string | null,
  branch: string | null,
  present: number,
  leave: number,
  absent: number,
  weeklyOff: number,
  holiday: number,
  paidDays: number,
  workingHours: string | null,
  overTime: string | null,
  arrearDays: number,
  actulaPaidDays: number,
  salaryProcess: true,
  dataSource: string | null,
  remark: string | null
}
export interface AttendanceProcess{
  employeeIdes: Array<number>,
  monthYear: string |  null,
  actionType: string | null,
  flag: string | null,
  remark: string | null
}

export interface SalaryProcess{
  employeeIdes: Array<number>
  monthYear: string | null,
  actionType: string | null,
  executeManual: true,
  remark: string | number
}
export interface SalaryHoldRelease{
  employeeID: number,
  employeeCode: string,
  employeeName: string,
  department: string,
  designation: string,
  category: string,
  branch: string,
  paidDays: number,
  pf: number,
  esi: number,
  lwf: number,
  pt: number,
  salaryDeduction: number,
  salaryEaring: number,
  salaryPay: number,
  arrearPay: number,
  netPay: number,
  monthYear: string
}
export interface SaveHoldRelease{
  employeeIdes:Array<number>,
  monthYear: string,
  actionType: string,
  releaseType: string,
  remark: string,
  salaryHoldPayMonthYear: string
}
export interface EmployeeSalarySummaryDetail{
  monthlySalaryDetails: {
    employeeID: number,
    monthYear: string,
    payGroup: string,
    dividingFactor: number,
    paidDays: number,
    arrearDays: number,
    actulaPaidDays: number,
    ctc: number,
    grossRate: number,
    salaryEaring: number,
    salaryDeduction: number,
    salaryPay: number,
    arrearEaring: number,
    arrearDeduction: number,
    arrearPay: number,
    netEaring: number,
    netDeduction: number,
    netPay: number,
    netPayWords: string,
    pf: number,
    vpf: number,
    esi: number,
    pt: number,
    lwf: number,
    pfGross: number,
    vpfGross: number,
    esiGross: number,
    ptGross: number,
    lwfGross: number,
    epsGross: number,
    edliGross: number,
    epfAcc1: number,
    epsAcc1number: number,
    pfAdminChargesAcc2: number,
    edliAcc21: number,
    edliAdminChargesAcc22: number,
    esiEmployer: number,
    lwfEmployer: number,
    arrearGrossRate: number,
    arrearPayWord: string,
    arrearPF: number,
    arrearVPF: number,
    arrearESI: number,
    arrearPT: number,
    arrearLWF: number,
    arrearPFGross: number,
    arrearVPFGross: number,
    arrearESIGross: number,
    arrearPTGross: number,
    arrearLWFGross: number,
    arrearEPSGross: number,
    arrearEDLIGross: number,
    arrearEPFAcc1: number,
    arrearEPSAcc1number: number,
    arrearPFAdminChargesAcc2: number,
    arrearEDLIAcc21: number,
    arrearEDLIAdminChargesAcc22: number,
    arrearESIEmployer: number,
    arrearLWFEmployer: number,
    arrearShowOnSalarySlip: true,
    paymentMode: string,
    bankBranchID: number,
    bankName: string,
    branchName: string,
    ifscCode: string,
    accountNumber: string,
    remark: string
  },
  monthlySalaryPaidDetails:Array<monthlySalaryPaidDetails>,
  montylySalaryTotalDetails: {
    payRateTotal: number,
    payAmountTotal: number,
    arrearAmountTotal: number,
    paidAmountTotal: number
  },
  montylySalaryTotalDetails1: {
    payRateTotal: number,
    payAmountTotal: number,
    arrearAmountTotal: number,
    paidAmountTotal: number
  }
}
export interface monthlySalaryPaidDetails{
    payCode: string,
    payComponentName: string,
    payRate: number,
    payAmount: number,
    arrearAmount: number,
    totalPaidAmount: number,
    payComponentType: string,
    sequenceNumber: number
}
export interface saveLeaveEncashmentTimeoffice{
  remark: string,
  payMonthYear: string,
  leaveYear: number,
  leaveEncashes: Array<LeaveEncashesTimeoffice>
}
export interface LeaveEncashesTimeoffice {
employeeID: number,
leaveID: number,
encash: number
}
export interface LeaveCarryForword{
  remark: string,
  leaveYear: number,
  carryForwardEntities: Array<LeaveCarryForwordEntities>
}
export interface LeaveCarryForwordEntities{
  employeeID: number,
  leaveID: number,
  carryForwardLeave: number
}
