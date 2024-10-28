export interface LeaveAccrualList
{
  employeeID:number,
  leaveID:number,
  leaveCode:string | null,
  accrualMonth:number,
  accrualYear:number,
  accrualValue:string | null,
  daysOnAccrual:string | null
  accrualType:string | null,
 leaveYear:number,
 financial:boolean,
  accrualOn:string | null,
  actionSource:string | null,
}
export interface LeaveAccrual{
  employeeID: number,
  accrualDate: string | null,
  accrualType: string | null,
  xmlLeaveAccrual: string | null,
  openingBalance: number
  leaveAccrual:Array<LeaveAccrualed>
}

export interface LeaveAccrualed
{
  leaveCode:string | null,
  leaveAccrued:string |null
}