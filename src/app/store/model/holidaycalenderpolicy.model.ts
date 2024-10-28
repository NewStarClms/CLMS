export class HolidayCalenderPolicy
    {
      policyID: number
  policyTypeID: number
  policyName: string | null
  description: string | null
  mappedOnOrganization: boolean
  mappingStatus: string | null
  restrictedHolidayApplicable: boolean
  maximumRestrictedHolidayRequest: number
  restrictedHolidayProdata: boolean
  prodataDate: number
    }
export class HolidayCalenderPolicyMapping{
  policyID: number
  calendarYear: number
  holidays:Array<holidaysModel>
}
export class holidaysModel{
  holidayID: number
  holidayName: string | null
  holidayDate: string | null
  holidayType: string | null
  selected: boolean
}