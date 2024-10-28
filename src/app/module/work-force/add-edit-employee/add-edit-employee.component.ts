import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee, EmployeeMaster } from 'src/app/store/model/employee.model';
import { Bank, BankBranch, Branch, Category, Company, Contractor, Department, Designation, Dispensary, Grade, Level, Organization, Section, SubDepartment } from 'src/app/store/model/master-data.model';
import { selectBankBranchState,  selectBranchState, selectCategoryState, selectCityState, selectCompanyState, selectContractorState, selectDepartmentState, selectDesignationState, selectDispensaryState, selectEmployeeMasterState, selectEmployeeState, selectGradeState, selectLevelState, selectOrganizationState, selectSectionState, selectSubDepartmentState } from 'src/app/store/app.state';
import { CityService } from 'src/app/services/city.service';
import { BankbranchService } from 'src/app/services/bankbranch.service';
import { SubDepartmentService } from 'src/app/services/sub-department.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { EmployeeBiometricDataService } from 'src/app/services/employee-biometric-data.service';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { SecureURLService } from 'src/app/services/secure-url.service';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent implements OnInit {
  public employeeInfo: Employee = {} as Employee;
  public display: boolean = false;
  public filePath: string = "../../../../assets/img/girl.png";
  public signfilePath: string = "../../../../assets/img/default_image.png";
  activeState: boolean[] = [true, false, false];
  public companyList: Array<any> = [];
  public deptList: Array<any> = [];
  public subdeptList: Array<any> = [];
  public desList: Array<any> = [];
  public bloodgroupList: Array<any> = [];
  public genderList: Array<any> = [];
  public gradeList: Array<any> = [];
  public branchList: Array<any> = [];
  public empStatusList: Array<any> = [];
  public empTypeList: Array<any> = [];
  public dispensaryList: Array<any> = [];
  public paymodeList = UI_CONSTANT.PAYMENT_MODE;
  public bankbranchList: Array<any> = [];
  public relationshipList: Array<any> = [];
  public maritalList: Array<any> = [];
  public countryList = UI_CONSTANT.COUNTRY;
  public stateList: Array<any> = [];
  public currentcityList: Array<any> = [];
  public percityList: Array<any> = [];
  public orgList: Array<any> = [];
  public nationalityList: Array<any> = [];
  public religionList: Array<any> = [];
  public secionList: Array<any> = [];
  public catList: Array<any> = [];
  public levelList: Array<any> = [];
  public contList: Array<any> = [];
  public empSkillList: Array<any> = [];
  public empList: Array<any> = [];
  public employeePunchTypes: Array<any> = [];
  datepickerConfig: Partial<BsDatepickerConfig>;
  bankDetailformode: boolean;
  isCityActive: boolean;
  isBankBranchActive: boolean;
  isSubDeptActive: boolean;
  profileToUpload: any;
  signToUpload: any;
  signatureToUpload: any;
  datePipe: DatePipe = new DatePipe('en-US');
  readonlyCondition: boolean = false;
  maritalstatus: boolean = false;
  //divleavingDetail: boolean = false;
  divBlackListed: boolean = false;
  divResignationDetail: boolean= false;
  public labelName: string = "Save";
  public headerdialogName: string = "Add Employee";
  public openTakeAphoto: boolean = false;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public isFromBiometricData: boolean = false;
  public funtionalManagers?: any;
  public reportingManagers?: any;
  public ReportingManageremployeeSerchList:any[];
  public functionalManageremployeeSerchList:any[];
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage = null;
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public seconds: number;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public isActive:boolean=false;
  public color:string;
  public border:string;

  constructor(private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private _store: Store<any>,
    private cityService: CityService,
    private router: Router,
    private bankBranchService: BankbranchService,
    private subDeprtmentService: SubDepartmentService,
    private corecommonServices: AppCoreCommonService,
    private employeeBioMetricDataService: EmployeeBiometricDataService,
    private appSearchService: AppSearchCommonService,
    private secureURLService:SecureURLService,
  ) {
    this.datepickerConfig = Object.assign({}, {
      containerClass: 'theme-default',
      dateInputFormat: 'DD-MMM-YYYY',
      adaptivePosition: true,
      initCurrentTime: false
    });
  }

  ngOnInit(): void {

    if(this.employeeInfo.employeeStatusID===3)
    {
      this.isActive=true;
    }
    else{
      this.isActive=false;
    }
    this._store.select(selectEmployeeMasterState).subscribe(response => {
      if (response && response.employeeMasterList) {

        const tempbloodgroupList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.bloodGroup);
        tempbloodgroupList.map(y => {
          this.bloodgroupList.push({
            bloodID: y.value,
            bloodName: y.key
          });
        });
        const tempempSkillList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeSkillType);
        tempempSkillList.map(y => {
          this.empSkillList.push({
            empskillID: y.value,
            empskillName: y.key
          });
        });
        const tempempStatusList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeStatus);
        tempempStatusList.map(y => {
          this.empStatusList.push({
            empStatusID: y.value,
            empStatusName: y.key
          });
        });
        const tempempTypeList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeType);
        tempempTypeList.map(y => {
          this.empTypeList.push({
            empTypeID: y.value,
            empTypeName: y.key
          });
        });
        const tempgenderList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.gender);
        tempgenderList.map(y => {
          this.genderList.push({
            genderID: y.value,
            genderName: y.key
          });
        });
        const temprelationshipList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.relationship);
        temprelationshipList.map(y => {
          this.relationshipList.push({
            relationshipID: y.value,
            relationshipName: y.key
          });
        });
        const tempmaritalList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.maritalStatus);
        tempmaritalList.map(y => {
          this.maritalList.push({
            maritalID: y.value,
            maritalName: y.key
          });
        });
        //  //console.log(this.maritalList);
        const tempnationalityList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.nationality);
        tempnationalityList.map(y => {
          this.nationalityList.push({
            nationalID: y.value,
            nationalName: y.key
          });
        });
        const tempreligionList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.religion);
        tempreligionList.map(y => {
          this.religionList.push({
            religionID: y.value,
            religionName: y.key
          });
        });
        const tempEmployeePunchTypes: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeePunchType);
        tempEmployeePunchTypes.map(y => {
          this.employeePunchTypes.push({
            employeePunchTypeID: y.value,
            employeePunchTypeName: y.key
          });
        });
        if (Number(this.activatedRoute.snapshot.params.id) != 0) {
          this.labelName = "Update";
          this.headerdialogName = "Update Employee";
          this.readonlyCondition = true;
          this.employeeService.fetchEmployeeDetail(this.activatedRoute.snapshot.params.id).subscribe(emp => {
            if (emp && emp.employeeID) {
              this.employeeInfo = AppUtil.deepCopy(emp);
              console.log('percity',this.employeeInfo.permanentCityID);
              console.log('perstate',this.employeeInfo.permanentStateID);
              console.log('currentcity',this.employeeInfo.currentCityID);
              console.log('curState',this.employeeInfo.currentStateID);
              this.reportingManagers = {key:this.employeeInfo.reportingManager,value:this.employeeInfo.reportingManagerID}
              this.funtionalManagers = {key:this.employeeInfo.functionalManager,value:this.employeeInfo.functionalManagerID}
              if (this.employeeInfo.profileImagePath != null) {
            //    this.filePath = this.employeeInfo.profileImagePath;
                this.filePath = this.secureURLService.appendSecurityToken(this.employeeInfo.profileImagePath);
              } else {
                this.filePath = "../../../../assets/img/girl.png";
              }
              if (this.employeeInfo.signatureImagePath != null) {
              //  this.signfilePath = this.employeeInfo.signatureImagePath;
              this.signfilePath = this.secureURLService.appendSecurityToken(this.employeeInfo.signatureImagePath);
              } else {
                this.signfilePath = "../../../../assets/img/default_image.png";
              }
              if (this.employeeInfo.marriageDate != null) {
                this.employeeInfo.marriageDate = moment(this.employeeInfo.marriageDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              }
              if (this.employeeInfo.leavingDate != null) {
                this.employeeInfo.leavingDate = moment(this.employeeInfo.leavingDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              }
              if (this.employeeInfo.retirementDate != null) {
                this.employeeInfo.retirementDate = moment(this.employeeInfo.retirementDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              }
              if (this.employeeInfo.blacklistDate != null) {
                this.employeeInfo.blacklistDate = moment(this.employeeInfo.blacklistDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              }
              if (this.employeeInfo.resignationDate != null) {
                this.employeeInfo.resignationDate = moment(this.employeeInfo.resignationDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              }
              if (this.employeeInfo.joiningDate != null) {
                this.employeeInfo.joiningDate = moment(this.employeeInfo.joiningDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              }
              if (this.employeeInfo.confirmationDate != null) {
                this.employeeInfo.confirmationDate = moment(this.employeeInfo.confirmationDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              }
              if (this.employeeInfo.dateOfBirth != null) {
                this.employeeInfo.dateOfBirth = moment(this.employeeInfo.dateOfBirth, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              }
              if (this.employeeInfo.deviceAccessValidUpto != null) {
                this.employeeInfo.deviceAccessValidUpto = moment(this.employeeInfo.deviceAccessValidUpto, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              }
              this.fngetpaymentmode(this.employeeInfo.paymentModeID);
              this.fngetMaritalstatus(this.employeeInfo.maritalStatusID);
              this.fngetEmployeestatus(this.employeeInfo.employeeStatusID);
              this.showHideBlackListDetail();
              if (this.employeeInfo.currentStateID) {
                this.fillCurrentCityDDL();
              }
              if (this.employeeInfo.permanentStateID) {
                this.fillPermanentCityDDL();
              }
              if (this.employeeInfo.departmentID) {
                this.fillSubDeptDDL();
              }
              if(this.employeeInfo.employeeStatusID===4)
              {
                this.color='red !important';
                this.border='1px solid red !important';
              }
              else{
                this.color='';
                this.border='';
            }
            }
          });
        }
      }

    });

    this._store.select(selectCompanyState).subscribe(res => {
      if (res && res.companyList) {
        const tempCompanyList: Company[] = AppUtil.deepCopy(res.companyList);
        tempCompanyList.map(z => {
          this.companyList.push({
            companyID: z.companyID,
            companyName: z.companyName
          });
        });
      }
    });
    this._store.select(selectDepartmentState).subscribe(res => {
      if (res && res.departmentList) {
        const tempdepartmentList: Department[] = AppUtil.deepCopy(res.departmentList);
        tempdepartmentList.map(y => {
          this.deptList.push({
            deptID: y.departmentID,
            deptName: y.departmentName
          });
        });
      }
    });
    this._store.select(selectSubDepartmentState).subscribe(res => {
      if (res && res.subdepartmentList) {
        this.subdeptList = UI_CONSTANT.PLEASE_SELECT.concat(this.subdeptList)
      }
    });
    this._store.select(selectDesignationState).subscribe(res => {
      if (res && res.designationList) {
        const tempdesignationList: Designation[] = AppUtil.deepCopy(res.designationList);
        tempdesignationList.map(x => {
          this.desList.push({
            desID: x.designationID,
            desName: x.designationName
          });
        });
      }
    });
    this._store.select(selectGradeState).subscribe(res => {
      if (res && res.gradeList) {
        const tempgradeList: Grade[] = AppUtil.deepCopy(res.gradeList);
        tempgradeList.map(x => {
          this.gradeList.push({
            gradeID: x.gradeID,
            gradeName: x.gradeName
          });
        });
      }
    });
    this._store.select(selectBranchState).subscribe(res => {
      if (res && res.branchList) {
        const tempbranchList: Branch[] = AppUtil.deepCopy(res.branchList);
        tempbranchList.map(x => {
          this.branchList.push({
            branchID: x.branchID,
            branchName: x.branchName
          });
        });
      }
    });
    this._store.select(selectDispensaryState).subscribe(res => {
      if (res && res.dispensaryList) {
        const tempdispensaryList: Dispensary[] = AppUtil.deepCopy(res.dispensaryList);
        tempdispensaryList.map(x => {
          this.dispensaryList.push({
            dispensaryID: x.dispensaryID,
            dispensaryName: x.dispensaryName
          });
        });
      }
    });
    this._store.select(selectBankBranchState).subscribe(res => {
      if (res && res.bankbranchList) {
        const tempbankbranchList: BankBranch[] = AppUtil.deepCopy(res.bankbranchList);
        tempbankbranchList.map(x => {
          this.bankbranchList.push({
            bankBranchID: x.bankBranchID,
            bankBranchName: x.bankBranchName
          });
        });
      }
      if (res && res.bankbranchList) {
        this.bankbranchList = UI_CONSTANT.PLEASE_SELECT.concat(this.bankbranchList);
      }
    });
    this._store.select(selectSectionState).subscribe(res => {
      if (res && res.sectionList) {
        const tempsectionList: Section[] = AppUtil.deepCopy(res.sectionList);
        tempsectionList.map(x => {
          this.secionList.push({
            sectionID: x.sectionID,
            sectionName: x.sectionName
          });
        });
      }
    });
    this._store.select(selectCategoryState).subscribe(res => {
      if (res && res.categoryList) {
        const tempcategoryList: Category[] = AppUtil.deepCopy(res.categoryList);
        tempcategoryList.map(x => {
          this.catList.push({
            catID: x.categoryID,
            catName: x.categoryName
          });
        });
      }
    });
    this._store.select(selectLevelState).subscribe(res => {
      if (res && res.levelList) {
        const templevelList: Level[] = AppUtil.deepCopy(res.levelList);
        templevelList.map(x => {
          this.levelList.push({
            levelID: x.levelID,
            levelName: x.levelName
          });
        });
      }
    });
    this._store.select(selectContractorState).subscribe(res => {
      if (res && res.contractorList) {
        const tempcontractorList: Contractor[] = AppUtil.deepCopy(res.contractorList);
        tempcontractorList.map(x => {
          this.contList.push({
            contID: x.contractorID,
            contName: x.contractorName
          });
        });
      }
    });
    this._store.select(selectCityState).subscribe(result => {
      if (result && result.cityList) {
        this.stateList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityService.getCityDropdownOptionList(this.countryList[0].countryID, 'state'));
        this.currentcityList = UI_CONSTANT.PLEASE_SELECT.concat(this.currentcityList);
        this.percityList = UI_CONSTANT.PLEASE_SELECT.concat(this.percityList);
        
      }
    });
    this._store.select(selectOrganizationState).subscribe(result => {
      if (result && result.organizationList) {
        const temporganizationList: Organization[] = AppUtil.deepCopy(result.organizationList);
        temporganizationList.map(x => {
          this.orgList.push({
            orgID: x.organizationID,
            orgName: x.organizationName
          });
        });
      }
    });
    this._store.select(selectEmployeeState).subscribe(response => {
      if (response && response.employeeList) {
        this.empList = UI_CONSTANT.DEFAULT_SELECT.concat(this.empList);
        const tempempList: Employee[] = AppUtil.deepCopy(response.employeeList);
        tempempList.map(x => {
          this.empList.push({
            empID: x.employeeID,
            empName: x.employeeName
          });
        });
      }
    });

    this.employeeBioMetricDataService.getEditableEmpBioData().subscribe(empBiometricRow=>{
      this.employeeInfo.employeeName = empBiometricRow.employeeName;
      this.employeeInfo.punchID = empBiometricRow.punchID;
      this.isFromBiometricData= true;
    });
  }
  SaveEmployeeData(employeeForm) {
    let temEmployeeInfo = AppUtil.deepCopy(this.employeeInfo);
    console.log(temEmployeeInfo);
    temEmployeeInfo.joiningDate = moment(this.employeeInfo.joiningDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    if (temEmployeeInfo.confirmationDate != null) {
      temEmployeeInfo.confirmationDate = moment(this.employeeInfo.confirmationDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    
    temEmployeeInfo.dateOfBirth = moment(this.employeeInfo.dateOfBirth, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    if (temEmployeeInfo.marriageDate != null) {
      temEmployeeInfo.marriageDate = moment(this.employeeInfo.marriageDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    } if (temEmployeeInfo.leavingDate != null) {
      temEmployeeInfo.leavingDate = moment(this.employeeInfo.leavingDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    } if (temEmployeeInfo.retirementDate != null) {
      temEmployeeInfo.retirementDate = moment(this.employeeInfo.retirementDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    } if (temEmployeeInfo.blacklistDate != null) {
      temEmployeeInfo.blacklistDate = moment(this.employeeInfo.blacklistDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    } if (temEmployeeInfo.resignationDate != null) {
      temEmployeeInfo.resignationDate = moment(this.employeeInfo.resignationDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if (temEmployeeInfo.deviceAccessValidUpto != null) {
      temEmployeeInfo.deviceAccessValidUpto = moment(this.employeeInfo.deviceAccessValidUpto, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
    }
    if (temEmployeeInfo.employeeID > 0) {

    if (this.reportingManagers != null) {
        this.reportingManagers = {key:this.employeeInfo.reportingManager,value:this.employeeInfo.reportingManagerID}
    }
    else{
        temEmployeeInfo.reportingManagerID=0;
        this.reportingManagers = {key:null,value:null}
        } 
  
    if (this.funtionalManagers != null) {
       this.funtionalManagers = {key:this.employeeInfo.functionalManager,value:this.employeeInfo.functionalManagerID}
    }
    else{
        temEmployeeInfo.functionalManagerID=0;
        this.funtionalManagers = {key:null,value:null}
        } 

      if (temEmployeeInfo.maritalStatusID != 2) {
        temEmployeeInfo.spouseName = null;
        temEmployeeInfo.marriageDate = null;
      }
      if (temEmployeeInfo.paymentModeID != 3) {
        temEmployeeInfo.bankAccountNo = null;
        temEmployeeInfo.bankName = null;
        temEmployeeInfo.paymentBankID = 0;
        temEmployeeInfo.branchName = null;
        temEmployeeInfo.ifscCode = null;
      }
      // //console.log('savehit',temEmployeeInfo)
      if (!temEmployeeInfo.emergencyContectPerson) {
        temEmployeeInfo.emergencyContectPerson = null;
        temEmployeeInfo.contactNumberEmergency = null;
      }
      this.employeeService.updateStateOfCell(temEmployeeInfo);
    } else {
      //console.log("cts", temEmployeeInfo)
      this.employeeService.saveEmployee(temEmployeeInfo);
    }
  }
  CancelEmployeeData() {
    this.router.navigate(['/work/employee/']);
  }
  onTabClose(event) { }
  onTabOpen(event) { }
  toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
  keyPressNumeric(event) {
    AppUtil.validateNumbers(event);
  }

  getCurrentState() {
    return !((this.employeeInfo.currentStateID) ? true : false);
  }
  fillCurrentCityDDL() {
    console.log(this.employeeInfo.currentStateID);
    if (this.employeeInfo.currentStateID) {
      this.isCityActive = false;
      return this.currentcityList = this.cityService.getCityDropdownOptionList(this.employeeInfo.currentStateID, 'city');
    }
    return this.currentcityList;
  }
  getPermanentState() {
    return !((this.employeeInfo.permanentStateID) ? true : false);
  }
  getSubDeptState() {
    return !((this.employeeInfo.departmentID) ? true : false);
  }
  fillSubDeptDDL() {
    if (this.employeeInfo.departmentID) {
      // //console.log(this.employeeInfo.departmentID)
      this.isSubDeptActive = false;
      return this.subdeptList = this.subDeprtmentService.getSubDeptDropdownOptionList(this.employeeInfo.departmentID);
    }
    return this.subdeptList;
  }
  fillPermanentCityDDL() {
    if (this.employeeInfo.permanentStateID) {
      this.isCityActive = false;
      return this.percityList = this.cityService.getCityDropdownOptionList(this.employeeInfo.permanentStateID, 'city');
    }
    return this.percityList;
  }
  fngetpaymentmode(params) {
    if (params == 3) {
      this.bankDetailformode = true;
    } else {
      this.bankDetailformode = false;
    }
  }
  fngetMaritalstatus(id) {
    if (id == 2) {
      this.maritalstatus = true;
    } else {
      this.maritalstatus = false;
    }
  }
  handleFileInput(event, imageType: string) {
    const date_name = new Date();
    const filename = date_name.getTime();
    let folderName = null;
    if (imageType === 'profile') {
      this.profileToUpload = event.target.files[0];
      this.employeeInfo.profileImagePath = this.profileToUpload.filename;
      //Show image preview
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.filePath = event.target.result;
        ////console.log('filePath',this.filePath);
      }
      reader.readAsDataURL(this.profileToUpload);
      folderName = 'Employee-Profile';
    } else if (imageType === 'signature') {
      this.signToUpload = event.target.files[0];
      this.employeeInfo.signatureImagePath = this.signToUpload.filename;
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.signfilePath = event.target.result;
        ////console.log('filePath',this.filePath);
      }
      reader.readAsDataURL(this.signToUpload);
      folderName = 'Employee-Sign';
    }

    this.corecommonServices.fileUpload(folderName, event.target.files[0], filename).subscribe(res => {
      if (res) {
        if (folderName === 'Employee-Profile') {
          this.employeeInfo.profileImagePath = res.fileUrl;
          this.employeeInfo.profileImagePathID = res.fileGuid;
          //console.log(folderName, this.employeeInfo.profileImagePath);
        } else if (folderName === 'Employee-Sign') {
          this.employeeInfo.signatureImagePath = res.fileUrl;
          this.employeeInfo.signatureImagePathID = res.fileGuid;
          //console.log(folderName, this.employeeInfo.signatureImagePath);
        }
      }
    });
  }
  fngetEmployeestatus(id) {
    if(this.employeeInfo.employeeStatusID >2){ //not probation or confirmed then show resignation date
      this.divResignationDetail=true;
    }else this.divResignationDetail=false;
  }
  showHideBlackListDetail(){
     if(this.employeeInfo.blacklisted){
         this.divBlackListed=true;
     }
     else{
       this.divBlackListed=false;
     }
  }
  filterEmployeeDetail(params) {
    console.log(params, 'reporting ');
    this.employeeInfo.reportingManagerID = params.value;
    this.employeeInfo.reportingManager = params.key;
  }

  filterFunctionManagerDetail(params) {
    console.log(params, 'functionsl ');
    this.employeeInfo.functionalManagerID = params.value;
    this.employeeInfo.functionalManager = params.key;
  }
  public handleInitError(event): void {
    //console.log(event, 'webcam error');
    this.errors.push(event);
  }
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public cameraWasSwitched(deviceId: string): void {
    //console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  fnOpenCameraPhoto() {
    this.openTakeAphoto = true;
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }
  public triggerSnapshot(): void {
    this.seconds = 3;
    setTimeout(() => {
      this.seconds = 2;
      setTimeout(() => {
        this.seconds = 1
        setTimeout(() => {
          this.trigger.next();
          this.seconds = null;
        }, 1000)
      }, 1000)
    }, 1000)

  }
  public handleImage(webcamImage: WebcamImage): void {
    const date_name = new Date();
    const filename = date_name.getTime();
    let folderName = 'Employee-Profile';
    //console.info("received webcam image", webcamImage);
    this.webcamImage = webcamImage;
    this.filePath = webcamImage.imageAsDataUrl;
    this.openTakeAphoto = false;
    let imageFile: File;
    this.corecommonServices.dataURItoBlob(webcamImage.imageAsBase64).subscribe((blob: Blob) => {
      const imageBlob: Blob = blob;
      const imageName: string = this.generateName();
      imageFile = new File([imageBlob], imageName, {
        type: 'image/jpeg',
      });

    });

    this.corecommonServices.fileUpload(folderName, imageFile, filename).subscribe(res => {
      if (res) {
        this.employeeInfo.profileImagePath = res.fileUrl;
        this.employeeInfo.profileImagePathID = res.fileGuid;
        //console.log(res)
      }
    });
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  generateName(): string {
    const date: number = new Date().valueOf();
    let text: string = '';
    const possibleText: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
    }
    // Replace extension according to your media type like this
    return date + '_' + text + '.jpeg';
  }
  reportingunSelectEmployee(e){
    this.employeeInfo.reportingManagerID = null;
    this.employeeInfo.reportingManager = null;
  }
  functinalunSelectEmployee(e){
    this.employeeInfo.functionalManagerID = null;
    this.employeeInfo.functionalManager = null;
  }
  reportingsearchData(event) {
    this.appSearchService.getFilteredEmployee(event.query).subscribe(data => {
      if(data && data.searchData){
      this.ReportingManageremployeeSerchList = data.searchData;
      }
    });
  }
  functionalsearchData(event) {
    this.appSearchService.getFilteredEmployee(event.query).subscribe(data => {
      if(data && data.searchData){
      this.functionalManageremployeeSerchList = data.searchData;
      }
    });
  }
}
