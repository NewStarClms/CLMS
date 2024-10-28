export interface ItemMaster{
    itemID: number,
    itemCode: string | null,
    itemName: string |null,
    itemType: string | null,
    description: string |null,
    startTime: string | null,
    endTime: string | null,
    itemRate: number | null,
    itemRateAfterSubsidy: number | null,
    employeeContribution:number | null,
    employerContribution: number | null,
    subsidizedQuantity:number | null
  
}


export interface CanteenPolicyDetail {
    policyID: number | null,
    policyTypeID: number | null,
    policyName: string | null,
    description: string | null,
    mappedOnOrganization: boolean | false,
    mappingStatus: string | null
}



export interface organizationMapping {
    policyID: number,
    policyTypeID: number,
    workFlowID: number,
    organizationKeyID: number,
    locationKeyID: number,
    organization: Array<number>,
    location: Array<number>    
}

export interface CanteenPolicyModel
{
  policyID: number,
  policyTypeID: number,
  policyName: string | null,
  description: string | null,
  mappedOnOrganization: boolean,
  mappingStatus: string | null,
  policyBasedOn: string | null,
  mappings:Array<mapping>
}

export interface mapping
{
    itemID: number,
    itemCode: string | null,
    itemName: string |null,
    itemType: string | null,
    description: string |null,
    startTime: string | null,
    endTime: string | null,
    itemRate: number | null,
    itemRateAfterSubsidy: number | null,
    employeeContribution:number | null,
    employerContribution: number | null,
    subsidizedQuantity:number | null,
    selected: boolean
}

export interface mappingModel
{
    itemID: number,
    itemCode: string | null,
    itemName: string |null,
    itemType: string | null,
    description: string |null,
    startTime: string | null,
    endTime: string | null,
    itemRate: number | null,
    itemRateAfterSubsidy: number | null,
    employeeContribution:number | null,
    employerContribution: number | null,
    subsidizedQuantity:number | null,
    selected: boolean
}

export interface CanteenManualPunchSingle{
    employeeID:number,
    punchTime: string,
    inOut: string,
    reason:string,
    systemIP: string,
    itemQuantity: number,
    itemID: number
  }
  
  export interface CanteenprocessSingle{
      employeeID:number,
      fromDate:string,
      toDate:string
  }
  
  export interface canteenPunchDetails
  {
      canteenPunchID:number,
      employeeID:number,
      attendanceDate:string,
      punchTime:string,
      punchSource:string,
      createdBy:string,
      createdDate:string,
      itemName:string,
      itemRate:number,
      itemQuantity:number,
      employeeAmount:number,
      employerAmount:number
  
  }

