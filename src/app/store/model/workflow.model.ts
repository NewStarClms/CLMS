export interface Workflow {
    workFlowModuleID: number,
    workFlowModuleName:string | null,
    workFlows:Array<WorkFlowRequest>,
}

export interface WorkFlowRequest{
    workFlowID:number,
    requestType: string
}


export interface WorkflowRule {
workFlowRuleID:number,
workFlowID:number,
workFlowRuleName: string | null,
description:string,
maxLength: number,
minLength: number,
nullable: true,
numberOfLevel:number,
ruleLevelMappings:Array<RuleLevelMapping>,
xmlRuleLevelMapping	: string | null,
requestType:string | null;
}

export interface RuleLevelMapping {
workFlowRuleID: number,
levelNumber: number,
userRoleID: number,
employeeID: number,
dueDay: number,
tat: number,
identifier: string | null,
intimationOnly: boolean,
identifierLabel?: any
}

export interface ESSRequestModel { 
    transactionID: string,
    workFlowID: 0,
    requestID: 0,
    requestStatus: string,
    employeeCode: string,
    employeeName: string,
    designation: string,
    department: string,
    inboxName: string,
    inboxSubject: string,
    requestRemark: string,
    requestStatusID: 0,
    requestDate: string,
    actionDate: string,
    actionSource: string,
    employeeID:0
  }