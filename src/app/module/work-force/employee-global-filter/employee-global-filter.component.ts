import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';
import { selectBranchState, selectCategoryState, selectCompanyState, selectContractorState, selectDepartmentState, selectDesignationState, selectDispensaryState, selectEmployeeMasterState, selectGradeState, selectLevelState, selectOrganizationState, selectSectionState, selectSubDepartmentState } from 'src/app/store/app.state';
import { EmployeeMaster } from 'src/app/store/model/employee.model';
import { GlobalEmployeeFilter } from 'src/app/store/model/globalemployeefilter.model';
import { Branch, Category, Company, Contractor, Department, Designation, Dispensary, Grade, Level, Organization, Section, SubDepartment } from 'src/app/store/model/master-data.model';

@Component({
  selector: 'app-employee-global-filter',
  templateUrl: './employee-global-filter.component.html',
  styleUrls: ['./employee-global-filter.component.scss']
})
export class EmployeeGlobalFilterComponent implements OnInit {
  loading = [false, false, false, false]
  public globalEmployeeFilterInfo : GlobalEmployeeFilter= {} as GlobalEmployeeFilter;
  filteredList: any[];
  employeeSerchList:any[];
  public employee:Array<any>=[];
  public orgList:Array<any>=[];
  public companyList:Array<any>=[];
  public branchList:Array<any>=[];
  public contractorList:Array<any>=[];
  public categoryList:Array<any>=[];
  public departmentList:Array<any>=[];
  public subDepartmentList:Array<any>=[];
  public designationList:Array<any>=[];
  public levelList:Array<any>=[];
  public sectionList:Array<any>=[];
  public gradeList:Array<any>=[];
  public employeeTypeList:Array<any>=[];
  public employeeStatusList:Array<any>=[];
  public organization:any[];
  public company:any[];
  public branch:any[];
  public contractor:any[];
  public category:any[];
  public department:any[];
  public subDepartment:any[];
  public designation:any[];
  public level:any[];
  public section:any[];
  public grade:any[];
  public employeeType:any[];
  public employeeStatus:any[];
  
  @Output() filterAppliedEvent = new EventEmitter<any>();
  @Output() cancelGlobalFilter = new EventEmitter<boolean>();
  constructor(
    private router: Router,
    private _store: Store<any>,
    private appSearchService: AppSearchCommonService

  ) { }

  ngOnInit(): void {
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
          this.departmentList.push({
            departmentID: y.departmentID,
            departmentName: y.departmentName
          });
        });
      }
    });
    this._store.select(selectSubDepartmentState).subscribe(res => {
      if (res && res.subdepartmentList) {
        const tempsubdepartmentList: SubDepartment[] = AppUtil.deepCopy(res.subdepartmentList);
        tempsubdepartmentList.map(y => {
          this.subDepartmentList.push({
            subDepartmentID: y.subDepartmentID,
            subDepartmentName: y.subDepartmentName
          });
        });
      }
    });
    this._store.select(selectDesignationState).subscribe(res => {
      if (res && res.designationList) {
        const tempdesignationList: Designation[] = AppUtil.deepCopy(res.designationList);
        tempdesignationList.map(x => {
          this.designationList.push({
            designationID: x.designationID,
            designationName: x.designationName
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
    this._store.select(selectSectionState).subscribe(res => {
      if (res && res.sectionList) {
        const tempsectionList: Section[] = AppUtil.deepCopy(res.sectionList);
        tempsectionList.map(x => {
          this.sectionList.push({
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
          this.categoryList.push({
            categoryID: x.categoryID,
            categoryName: x.categoryName
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
          this.contractorList.push({
            contractorID: x.contractorID,
            contractorName: x.contractorName
          });
        });
      }
    });
    this._store.select(selectOrganizationState).subscribe(res => {
      if (res && res.organizationList) {
        const temporgnaizationList: Organization[] = AppUtil.deepCopy(res.organizationList);
        temporgnaizationList.map(x => {
          this.orgList.push({
            organizationID: x.organizationID,
            organizationName: x.organizationName
          });
        });
      }
    });
    this._store.select(selectEmployeeMasterState).subscribe(response=>
      {
        if (response && response.employeeMasterList) {
         const tempempStatusList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeStatus);
         this.employeeStatusList=tempempStatusList;

         const tempempTypeList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeType);
         this.employeeTypeList=tempempTypeList
        }

      });
  }

  ngOnChanges(changes: SimpleChanges) {
    const filteredData = AppUtil.deepCopy(changes.gridRowData.currentValue);
    console.log(filteredData,'filteredData');
    
  }
  searchData(event) {
    this.appSearchService.getFilteredEmployee(event.query).subscribe(data => {
      if(data && data.searchData){
      this.employeeSerchList = data.searchData;
      }
    });
  }
 
  saveFilter(){
   if(this.organization != undefined){
    this.globalEmployeeFilterInfo.organization = this.organization.map(({ organizationID }) => organizationID).join('~');
   }
   console.log(this.organization)
   if(this.employee != undefined){
   this.globalEmployeeFilterInfo.employee = this.employee.map(({ value }) => value).join('~');
   }
   if(this.company != undefined){
    this.globalEmployeeFilterInfo.company = this.company.map(({ companyID }) => companyID).join('~');
  }
  if(this.branch != undefined){
    this.globalEmployeeFilterInfo.branch = this.branch.map(({ branchID }) => branchID).join('~');
  }
  if(this.contractor != undefined){
    this.globalEmployeeFilterInfo.contractor = this.contractor.map(({ contractorID }) => contractorID).join('~');
  }
  if(this.category != undefined){
    this.globalEmployeeFilterInfo.category = this.category.map(({ categoryID }) => categoryID).join('~');
  }
  if(this.department != undefined){
    this.globalEmployeeFilterInfo.department = this.department.map(({ departmentID }) => departmentID).join('~');
  }
  if(this.subDepartment != undefined){
    this.globalEmployeeFilterInfo.subDepartment = this.subDepartment.map(({ subDepartmentID }) => subDepartmentID).join('~');
  }
  if(this.designation != undefined){
    this.globalEmployeeFilterInfo.designation = this.designation.map(({ designationID }) => designationID).join('~');
  }
  if(this.level != undefined){
    this.globalEmployeeFilterInfo.level = this.level.map(({ levelID }) => levelID).join('~');
  }
  if(this.section != undefined){
    this.globalEmployeeFilterInfo.section = this.section.map(({ sectionID }) => sectionID).join('~');
  }
  if(this.grade != undefined){
    this.globalEmployeeFilterInfo.grade = this.grade.map(({ gradeID }) => gradeID).join('~');
  }
  if(this.employeeType != undefined){
    this.globalEmployeeFilterInfo.employeeType = this.employeeType.map(({ value }) => value).join('~');
  }
  if(this.employeeStatus != undefined){
    this.globalEmployeeFilterInfo.employeeStatus = this.employeeStatus.map(({ value }) => value).join('~');
  }
   this.appSearchService.saveGlobalEmployeeFilter(this.globalEmployeeFilterInfo);
   localStorage.setItem('lStorageData','1' );
   this.filterAppliedEvent.emit();
   this.cancelGlobalFilter.emit(false);
  }
  clearFilter(){
    this.appSearchService.deleteCellFromRemote();
    localStorage.setItem('lStorageData','0' );
    this.employee=[];
    this.organization=[];
    this.company=[];
    this.branch=[];
    this.contractor=[];
    this.category=[];
    this.department=[];
    this.subDepartment=[];
    this.designation=[];
    this.level=[];
    this.section=[];
    this.grade=[];
    this.employeeType=[];
    this.employeeStatus=[];
    this.filterAppliedEvent.emit();
    this.cancelGlobalFilter.emit(false);
  }
}
