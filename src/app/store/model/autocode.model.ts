export interface AutoCode
  {
    autoCodeSeriesTypeID: number,
    autoCodeSeriesTypeName: string | null,
    organizationID: number,
    organizationName: string | null,
    moduleName: string | null,
    applicableOn: string | null,
    completed: true,
    codeSeriesMaps: Array<codeSeriesMaps> | null
  }
  export interface codeSeriesMaps {
    autoCodeSeriesID?: number,
    subOrganizationID?: number,
    subOrganizationName?: string | null,
    prefix?: string | null,
    suffix?: string | null,
    startNo?: number,
    padding?: number,
    lastNumber?: number,
    lastGeneratedCode?: string | null,
    completed?: true
  }

  export interface AutoCodeLists {
    codeSeriesMap:codeSeriesMaps|null

  }
