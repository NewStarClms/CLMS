export interface LeaveBalance{
    leaveID: number,
    leaveCode: string | null,
    leaveName: string | null,
    accrualLeave: number,
    consumeLeave: number,
    deductLeave: number,
    balanceLeave: number
  }

export interface LeaveRequestByEmployee{
    leaveRequestID: number,
    employeeID: number,
    leaveID: number,
    fromDate: string | null,
    toDate: string | null,
    leaveAmount: number,
    halfDayType: boolean,
    halfDayStatus: string | null,
    requestRemark: string | null,
    referenceNumber: string | null,
    documentFullURL: string | null
  }

export interface LeaveRequestByAdmin{
    leaveRequestID: number,
    employeeID: number,
    leaveID: number,
    fromDate: string | null,
    toDate: string | null,
    leaveAmount: number,
    halfDayType: boolean,
    halfDayStatus: string | null,
    requestRemark: string | null,
    referenceNumber: string | null,
    documentFullURL: string | null,
    cancelAllow: boolean,
    leaveCode: string | null,
    requestStatus: string | null,
    actionSource: string | null,
    approvedDate: string | null,
    approveRemark: string | null,
    cancelledDate: string | null,
    cancelledRemark: string | null
  }
export interface LeaveRequest{
  employeeID: number,
  leaveID: number,
  fromDate: string | null,
  toDate: string | null,
  halfDayType: boolean,
  halfDayStatus: string | null,
  documentID: string | null,
  requestSourceID: number,
  requestRemark: string | null,
  responceCode: string | null
}
export interface CancelLeaveRequest{
  employeeID: number,
  requestID: number,
  remark: string | null;
}