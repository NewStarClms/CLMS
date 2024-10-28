export interface RequestFlowModel {
    transactionID: string,
    workFlowID: 0,
    requestID: 0,
    requestStatus: string,
    employeeCode: string,
    employeeName: string,
    finalRequestStatusID:0
    inboxName: string,
    inboxSubject: string,
    requestRemark: string,
    requestStatusID: 0,
    requestDate: string,
    actionDate: string,
    actionSource: string,
    employeeID?:number
  }
  export interface requestLeve{
    fromDate:string,
    toDate:string,
    remarks:string,
    refRemarkno:string,
    fromDateType:string,
    toDateType:string,
    leaveType:string,
  }

  export interface RequestApproveModel { 
    transactionID: string,
    workFlowID: 0,
    requestID: 0,
    requestStatus: string,
    employeeCode: string,
    employeeName: string,
    inboxName: string,
    inboxSubject: string,
    requestRemark: string,
    requestStatusID: 0,
    requestDate: string,
    actionDate: string,
    actionSource: string,
    employeeID:0
  }
  export interface RequestDetailEntity{
    employeeCode: string,
    employeeName: string,
    levelNumber: 0,
    inboxSubject: string,
    requestStatusID: 0,
    requestStatus: string,
    approveRemark: string,
    requestRemark: string,
    actionDate: string,
    requestDate: string
  }

  export interface RequestPostPayload {
    transactionID: 0,
    requestStatusID: 0,
    workFlowID: 0,
    remark: string,
    employeeID: 0
  }
  