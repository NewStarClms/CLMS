import { UI_CONSTANT } from "../../common/constants/ui-constants";

export class LoginModel{
    userName: string;
    password: string;
    clientCode?: string;

    constructor(){
        this.userName = UI_CONSTANT.EMPTY_STRING;
        this.password = UI_CONSTANT.EMPTY_STRING;
        this.clientCode = UI_CONSTANT.EMPTY_STRING;
    }
}
export class authDetails {
    server?: string;
    token?: string;
    domain?: string;
    username?: string;
    password?: string;
}
export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    accessToken: string;
    refreshKey: string;
    expireIn: number;
    expiresAt: Date;
    issuedAt: Date;
    logOnUserDetail: {
        employeeID: number,
        employeeCode: string | null,
        punchID: string | null,
        employeeName: string | null,
        joiningDate: string | null,
        dateOfBirth: string | null,
        leavingDate: string | null,
        leavingReason: string | null,
        profileImagePath: string | null,
        signatureImagePath: string | null,
        maritalStatusID: string | null,
        emailID: string | null,
        genderID: string | null,
        mobileNo: string | null,
        organization: string | null,
        company: string | null,
        branch: string | null,
        contractor: string | null,
        category: string | null,
        department: string | null,
        subDepartment: string | null,
        designation: string | null,
        level: string | null,
        section: string | null,
        grade: string | null,
        employeeType: string | null,
        employeeStatus: string | null,
        employeeTypeID: string | null,
        employeeStatusID: string | null,
        organizationCode: string | null,
        companyCode: string | null,
        branchCode: string | null,
        contractorCode: string | null,
        categoryCode: string | null,
        departmentCode: string | null,
        subDepartmentCode: string | null,
        designationCode: string | null,
        levelCode: string | null,
        sectionCode: string | null,
        gradeCode: string | null,
        reportingManagerID: number,
        reportingManagerCode: string | null,
        reportingManagerName: string | null,
        functionalManagerID: number,
        functionalManagerCode: string | null,
        functionalManagerName: string | null,
        AadharNumber : string | null,
        PFNumber : string | null,
        ESINumber : string | null,
        UANNumber : string | null,
        PANNo : string | null,
        BankAccountNo : string | null,
        BankName : string | null,
        BranchName : string | null,
        IFSCCode : string | null
      }
}

export interface ChangePassword{
    newPassword:string | null
}