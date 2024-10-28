export interface EmployeeDashboardSetting{
    dashBoardSettingID : Number,
    active:boolean,
    sequence: Number,
    settingName: string
}

export interface MachineJobProgress{
  processRequestID: string |"",
  processSchedulerName: string,
  totalEmployee: number,
  processedEmployee: number,
  startDate: string|"",
  endDate: string|"",
  processPercent: string,
  processStatus: number,
  remarks: string|""
}