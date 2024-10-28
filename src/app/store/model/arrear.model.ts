export interface ArrearProcessModel{
    employeeID: number | 0,
    employeeCode: string | "",
    employeeName: string | "",
    department: string | "",
    designation: string | "",
    category: string| "",
    branch: string| "",
    arrearMonth: string| "",
    arrearDays: number | 0,
    present: number | 0,
    leave: number | 0,
    abscent: number | 0,
    weeklyoff: number | 0,
    holiday: number | 0,
    workingHours: number | 0,
    overTime: number | 0,
    datasource: string| "",
    salaryMonthYear: string| ""
}
export interface ArrearPendingModel{
    employeeID: number | 0,
    employeeCode: string | "",
    employeeName: string | "",
    department: string | "",
    designation: string | "",
    category: string| "",
    branch: string| "",
    arrearMonthYear: string| "",
    arrearDays: number | 0,
    pf: number | 0,
    esi: number | 0,
    lwf: number | 0,
    pt: number | 0,
    earing: number | 0,
    deduction: number | 0,
    netPay: number | 0,
    salaryMonthYear: string| ""
}
export interface ArrearDetail{
    arrearDetailID:  number | 0,
    employeeID:  number | 0,
    monthYear: string | "",
    arrearType: string | "",
    payGroup: string | "",
    dividingFactor:  number | 0,
    paidDays:  number | 0,
    ctc:  number | 0,
    grossRate:  number |  0,
    arrearEaring:  number |  0,
    arrearDeduction:  number |  0,
    arrearPay:  number |  0,
    netPayWords: string | "",
    pf:  number |  0,
    vpf:  number |  0,
    esi:  number |  0,
    pt:  number |  0,
    lwf:  number |  0,
    pfGross:  number |  0,
    vpfGross:  number |  0,
    esiGross:  number |  0,
    ptGross:  number |  0,
    lwfGross:  number |  0,
    epsGross:  number |  0,
    edliGross:  number |  0,
    epfAcc1:  number |  0,
    epsAcc1 : number |  0,
    epfAcc10:  number |  0,
    epsAcc10 : number |  0,
    pfAdminChargesAcc2:  number |  0,
    edliAcc21:  number |  0,
    edliAdminChargesAcc22:  number |  0,
    paymentMode: boolean | true,
    lwfEmployer: string | "",
    esiEmployer:  number |  0,
    remark: string | ""
}
export interface ArrearSalaryPaidDetails{
    payCode: string,
    payComponentName: string,
    payRate: number,
    payAmount: number,
    arrearAmount: number,
    totalPaidAmount: number,
    payComponentType: string,
    sequenceNumber: number

}
export interface ArrearSalaryTotalDetails{
payRateTotal: number,
payAmountTotal: number,
arrearAmountTotal: number,
paidAmountTotal: number
}

export interface ArrearRequest{
    employeeList: string,
    monthYear: string,
    arrearType: string,
    actionType: string,
    executeManual: boolean | false,
    remark: string | ""
}
export interface UnProcessArrearRequest{
    employeeList: string,
    monthYear: string,
    arrearType: string,
    dataChangeStageID: number
}