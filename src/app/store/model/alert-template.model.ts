export interface AlertTemplate{
moduleID: number|null,
workFlowName:string|null,
statusName:string|null,
alertID:number,
workFlowID:number|0,
requestStatusID:number|0,
alertName:string|null,
enableMail:boolean|false,
mailSubject:string|null,
mailTemplate:string|null,
enableAlert:boolean|false,
alertSubject:string|null,
alertTemplate:string|null,
enableSMS:boolean|false,
smsTemplate:string|null,
active:boolean|false
}

export interface LetterTemplate{
    templateID: number|0,
    templateTypeID: number|null,
    templateTypeName: string|null,
    templateName: string | null,
    templateSubject: string | null,
    templateTemplate: string | null,
    printPerPage:string | null
}