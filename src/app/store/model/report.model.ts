export interface ReportModel{
          reportModuleID: number | 0,
          reportModuleName: string |  null,
          moduleOrder: number | 0,
          reportDetailsEntities: Array<ReportDetailsEntities>
}

export interface ReportDetailsEntities {
    reportModuleID: number | 0,
    reportCategory: string |  null,
    reportID: number | 0,
    reportTypeID: number | 0,
    reportName: string |  null,
    description: string |  null,
    visibleToAll: boolean | true,
    visibleFor: string |  null,
    reportCondition: string |  null,
    defaultReport: boolean | true,
    procedureName: string |  null,
    schedular: true,
    maxRecord: number | 0,
    duration: string |  null,
    dateControlType: string |  null,
    generateType: string |  null,
    formated: true,
    linePerPage: number | 0,
    mappedColumns?:ReportColumnDetails[]
  }

  export interface ReportColumnDetails {
          reportColumnID: number | 0,
          columnGroupID?: number | 0,
          columnName?: string,
          displayName?: string,
          columnType?: string,
          sequenceNumber: number | 0,
          selected?: boolean | true
  }
  export interface ReportUpdateModel {
                reportID: number | 0,
                reportTypeID: number | 0,
                reportName: string |  null,
                description: string |  null,
                visibleToAll: boolean | true,
                visibleFor: string |  null,
                reportCondition: string |  null,
                defaultReport: boolean | true,
                linePerPage: number | 0,
                schedular: boolean | true,
                mappedColumns: Array<ReportColumnDetails>,
                xmlMappedColumn: string |  null
              
  }

  export interface ReportGenerateModel {
                reportCategory: string,
                reportID: number|0,
                reportGenerateType: string,
                fromDate: string,
                toDate: string,
                extraValue1: string,
                extraValue2: string,
                reportHeaderRequired: boolean | true
  }