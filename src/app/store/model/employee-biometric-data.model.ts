export interface EmployeeBiometricData{
    employeeBiometricDataID : number,
	punchID : string,
	employeeName : string,
	employeePunchTypeID : number,
    employeePunchTypeDesc : string,
	registered : string | null,
    isFaceRegistered : string | null,
    isFingerRegistered : string | null,
    machines : string | null,
	faceData1 : string | null,
    faceData2 : string | null,
    faceData3 : string | null,
    faceData4 : string | null,
    faceData5 : string | null,
	fingerData1 : string | null,
    fingerData2 : string | null,
    fingerData3 : string | null,
    fingerData4 : string | null,
    fingerData5 : string | null,
    fingerData6 : string | null,
    fingerData7 : string | null,
    fingerData8 : string | null,
    fingerData9 : string | null,
    fingerData10 : string | null,
    quality : string | null,
    company: string,
    department: string,
}
export interface SearchInput{
  machineModelIDs: string | null,
  machineTypeIDs: string | null,
  machineSearchKeyword: string | null
}