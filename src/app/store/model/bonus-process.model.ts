export interface BonusProcessPayload{
    employeeIdes:Array<number>,
    financialYearID:number,
    fromDate: string,
    toDate: string,
    remark: string|"",
    payMonthYear: string,
    payWithSalary:boolean | true,
    flag: string |"",
    bonusDetailID:number | 0
    
}

export interface BonusProcessEmployee{
    bonusDetailID: number | 0,
    totalDays: number | 0,
    earnedBasic: number | 0,
    wagesForBonus: number | 0,
    bonusPercentage: number | 0,
    bonusAmount: number | 0,
    exgratiaAmount: number | 0,
    employeeID: number | 0,
    employeeCode: string | "",
    employeeName: string | "",
    company: string | "",
    department: string | "",
    designation: string | "",
    branch: string | "",
    displayName: string | ""
}