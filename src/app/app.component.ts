import { Component } from '@angular/core';
import { NotificationService } from './common/notification.service';
import { BankService } from './services/bank.service';
import { BankbranchService } from './services/bankbranch.service';
import { BranchService } from './services/branch.service';
import { BusinessTypeService } from './services/business-type.service';
import { CategoryService } from './services/category.service';
import { CityService } from './services/city.service';
import { CompanyService } from './services/company.service';
import { ContratorService } from './services/contrator.service';
import { DepartmentService } from './services/department.service';
import { DesignationService } from './services/designation.service';
import { LevelService } from './services/level.service';
import { NatureofworkService } from './services/natureofwork.service';
import { QualificationService } from './services/qualification.service';
import { SectionService } from './services/section.service';
import { SubDepartmentService } from './services/sub-department.service';
import { OrganizationService } from './services/organization.service';
import { DispensaryService } from './services/dispensary.service';
import { GradeService } from './services/grade.service';
import { GateService } from './services/gate.service';
import { ItemTypeService } from './services/item-type.service';
import { VisitorAreasService } from './services/visitor-areas.service';
import { VisitorTypeService } from './services/visitor-type.service';
import { VisitorPurposeService } from './services/visitor-purpose.service';
import { AuthService } from './services/authentication.service';
import { User } from './store/model/login.model';
import { StarLoaderComponent } from './star-loader/star-loader.component';
import { EmployeeService } from './services/employee.service';
import { AutoCodeService } from './services/auto-code.service';
import { UserGroupService } from './services/user-group.service';
import { GlobalsettingService } from './services/globalsetting.service';
import { DocumenttypeService } from './services/documenttype.service';
import { VisitorPassTemplateService } from './services/visitor-pass-template.service';
import { VisitorAdminService } from './services/visitor-admin.service';
import { VisitorEssService } from './services/visitor-ess.service';
import * as moment from 'moment';
import { ShiftService } from './services/shift.service';
import { EmployeeUserGroupService } from './services/employee-usergroup.service';
import { AttendancePolicyMasterService } from './services/attendance-policy-master.service';
import { EmployeeOUService } from './services/employee-ou.service';
import { MailServerService } from './services/mail-server.service';
import { SmsServerService } from './services/sms-server.service';
import { VisitorGeneralSettingService } from './services/VisitorGeneralSetting.service';
import { Spinkit } from 'ng-http-loader';
import { GuestVisitorService } from './services/guest-visitor.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'starlinkui';
  isUserLoggedIn = false;
  public currentUser: User = null;
  public currentdate=moment().toDate();
  fromdatetime: string;
  todatetime:string;
  visitorstatus:string;
  spinnerStyle =Spinkit;
  location= window.location.pathname;
  routeParams: any;
  showForgotPassword: Boolean = false;
  public entryComponent = StarLoaderComponent;
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private businessTypeService:BusinessTypeService,
    private branchService: BranchService,
    private categoryService: CategoryService,
    private companyService:CompanyService,
    private contractorService:ContratorService,
    private cityService:CityService,
    private departmentService:DepartmentService,
    private designationService:DesignationService,
    private qualificationService:QualificationService,
    private sectionService:SectionService,
    private subdepartmentService:SubDepartmentService,
    private bankService:BankService,
    private bankbranchService:BankbranchService,
    private levelService:LevelService,
    private natureofworkService:NatureofworkService,
    private organizationService:OrganizationService,
    private dispensaryService:DispensaryService,
    private gradeService:GradeService,
    private gateService:GateService,
    private itemTypeService:ItemTypeService,
    private visitorareaService:VisitorAreasService,
    private visitortypeService:VisitorTypeService,
    private visitorpurposeService:VisitorPurposeService,
    private employeeService:EmployeeService,
    private documentTypeService:DocumenttypeService,
    private guestService: GuestVisitorService,
  ) {

  this.fromdatetime = moment(this.currentdate).format('DD-MMM-YYYY')+' 00:00';
  this.todatetime = moment(this.currentdate).format('DD-MMM-YYYY')+' 23:59';
  this.visitorstatus = '0';
  
    //console.log('inite');
    this.authenticationService.currentUser.subscribe(
      x => {
        if(x && x.accessToken){
         // console.log('login', x);
          const exdate:Date = new Date(x.expiresAt);
          const curDate:Date = new Date();
         // console.log('date',exdate>curDate)
          if(exdate>curDate){
            this.currentUser = x;
            if(!window.location.pathname.includes('self-visitor')){
              this.onload();
            }else{
              this.loadVisitors();
            }
          }else{
            this.authenticationService.logout();
            if(window.location.pathname.includes('self-visitor')){
              this.router.navigate(['/self-visitor/request']);
            }
          }

        }else{
          this.currentUser = null;
        }
      }
    );
  }

  ngOnInit(): void {
    this.routeParams = {Header:true, footer:true, sidebar:true};
    this.guestService.getParamsData().subscribe(data =>{
      if(data){
        //console.log('routeParams', data);
        this.routeParams = data;
      } 
    });
    this.authenticationService.getForgotPasswordVisibility().subscribe(isVisible =>{
      this.showForgotPassword = isVisible;
    });
    //console.log('initssse');
  }
  loadVisitors() {
    this.gateService.fetchGateData();
    this.itemTypeService.fetchItemTypeData();
    this.visitorareaService.fetchVisitorAreaData();
    this.visitortypeService.fetchVisitorTypeData();
    this.visitorpurposeService.fetchVisitorPurposeData();
    this.employeeService.fetchEmployeeMasterData();
  }
  onload(){
  this.businessTypeService.fetchBusinessTypeData();
  this.branchService.fetchBranchData();
  this.categoryService.fetchCategoryData();
  this.companyService.fetchCompanyData();
  this.contractorService.fetchContractorData();
  this.cityService.fetchCityData();
  this.departmentService.fetchDepartmentData();
  this.designationService.fetchDesignationData();
  this.qualificationService.fetchQualificationData();
  this.subdepartmentService.fetchSubDepartmentData();
  this.sectionService.fetchSectionData();
  this.bankService.fetchBankData();
  this.bankbranchService.fetchBankBranchData();
  this.levelService.fetchLevelData();
  this.natureofworkService.fetchNatureOfWorkData();
  this.organizationService.fetchOrganizationData();
  this.dispensaryService.fetchDispensaryData();
  this.gradeService.fetchGradeData();
  this.documentTypeService.fetchDocumentTypeData();
  this.documentTypeService.fetchDocumentCategoryData();
  this.employeeService.fetchEmployeeMasterData();
  }

}


