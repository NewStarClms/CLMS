
export interface AttendancesDetail{
  attendances: [
    {
      attendanceDate: string | null,
      shiftAttended: string | null,
      workingHours: string | null,
      extraWork: string | null,
      shiftView: string | null,
      status: string | null,
      inTime: string | null,
      outTime: string | null,
      lateArrival: string | null,
      earlyDeparture: string | null,
      shiftChangeStage: string | null,
      punchChangeStage: string | null,
      attendanceLocked: boolean,
      colorCode: string | null,
      viewData: boolean,
      employeeCode: string | null,
      fullName: string | null,
      designation: string | null,
      department: string | null,
      branch: string | null,
      attendanceValue: number
    }
  ],
  summary: {
    present: number,
    absent: number,
    leave: number,
    weeklyoff: number,
    holiday: number,
    lateArrival: string | null,
    earlyDeparture: string | null,
    extraWork: string | null,
    otosFlag: string | null
  }
} 

export interface PunchDetail
{
  punchTime: string | null,
  inOut: string | null,
  previousDayPunch: boolean,
  punchTemperature: string | null,
  punchSource: string | null,
  createdBy: string | null,
  createdDate: string | null,
  allowDelete: boolean
  punchID:number;
}
export interface ManualPunchSingle
{
  employeeID: number,
  punchTime: string | null,
  inOut: string | null,
  reason: string | null,
  systemIP: string | null
  attendancePunchID:number
}
export interface ManualPunchMulti{
  employeeID: number,
  fromDate: string | null,
  toDate: string | null,
  punchType: number,
  punchTime: string | null,
  autoMinut: number,
  weeklyOffInclue: boolean,
  holidayInclude: boolean,
  inOut: string | null,
  machineID: number,
  reason: string | null,
  systemIP: string | null
}
export interface RosterProcessSingle
{
  employeeID: number,
  fromDate: string | null,
  toDate: string | null,
  processFlag: string | null
}
export interface ShiftChange
{
  employeeID: number,
  fromDate: string  | null,
  toDate: string  | null,
  shiftCode: string | null,
  action: number,
  replaceWeeklyOff: boolean,
  replaceHoliday: boolean,
  punchProcess: boolean
}
export interface AttendanceMapped{
  key:string | null,
  value:string | null
}
export interface BackDataProcess{
  employeeID: number,
  fromDate: string | null,
  toDate: string | null,
  withRawPunch: boolean
}
export interface AllPolicy{
  key:string | null,
  value:number
}
export interface GatePass{
  employeeID: number,
  attendanceDate: string | null,
  startTime: string | null,
  endTime: string | null,
  gatePassType: string | null,
  requestRemark: string | null
  duration:string | null
}
export interface GatePassDetail{
  gatePassRequestID: number,
  employeeID: number,
  attendanceDate: string | null,
  startTime: string | null,
  endTime: string | null,
  duration: string | null,
  gatePassType: string | null,
  deductionType: string | null,
  expectedOutTime: string | null,
  expectedInTime: string | null,
  gateUserRemark: string | null,
  requestRemark: string | null,
  requestStatusID: number,
  requestSource: string | null,
  requestBy: string | null,
  requestDate: string | null,
  approveRemark: string | null,
  approvedBy: number,
  approvedDate: string | null,
  approvedSource: string | null,
  cancelledBy: string | null,
  cancelledDate: string | null,
  cancelledRemark: string | null,
  statusName : string | null
}
export interface SearchGatePassDetail{
  employeeID: number,
  fromDate: string | null,
  toDate: string | null,
  requestID: number,
  transactionID: number,
  requestStatus: string | null,
  workFlowID: number
}
export interface DeleteGatePass{
  employeeID: number,
  requestID: number,
  remark: string | null
}
export interface GatePassRequest{

    employeeID: number,
    fromDate: string | null,
    toDate: string | null,
    requestID: number,
    transactionID: number,
    requestStatus: string | null,
    workFlowID: number
  
}
export interface AttendanceStatsDownload{
  serialNumber: number,
  employeeCode: string,
  employeeName: string,
  company:string,
  department:string,
  section:string
}

export interface PunchRegularizationRequest{

}
export interface PunchRegularizationInfo{
  punchRegularizationRequestID: number,
  employeeID: number,
  attendanceDate: string,
  punchType: string,
  requestType: string,
  inTime: string,
  outTime: string,
  requestRemark: string
}
export interface DownloadPolicyResponse{
  message: string | null,
  messageType: number,
  messageCode: string | null
}