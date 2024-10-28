import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { FileUpload } from '../store/model/file.model';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { HttpMethod } from '../common/constants/http-method.constants';
import { PATH } from '../common/constants/service-path.constants';
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { NotificationService } from '../common/notification.service';
import { RemoteService } from '../common/remote.service';
import { ServiceConfig } from '../store/model/serviceConfig.model';
import { Store } from '@ngrx/store';
import { currentUserMenuItems, selectDepartmentState, selectDesignationState, selectOrganizationState, selectSubDepartmentState, selectLevelState, selectSectionState, selectGradeState, selectEmployeeMasterState, selectBranchState, selectCompanyState, selectContractorState, selectCategoryState } from '../store/app.state';
import { Menu, MenuRights } from '../store/model/usermanage.model';
import { AppUtil } from '../common/app-util';
import { Branch, Category, Company, Contractor, Designation, Grade, Level, Organization, Section } from '../store/model/master-data.model';
import { SubDepartment, Department } from 'src/app/store/model/master-data.model';
import { EmployeeMaster } from '../store/model/employee.model';

@Injectable({ providedIn: 'root' })
export class AppCoreCommonService {
  private _fileGetDetail:BehaviorSubject<FileUpload> = new BehaviorSubject<FileUpload>(null);
  public menuAccess: Array<Menu>= [];
  public menuAccessList: Array<Menu>= [];
  public _menuAccessList: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>(null);
  public locationDataList: Array<any> = [];
  public orgDataUnitList: Array<any> = [];
  
  constructor(
    private _store: Store<any>,
    private remoteService: RemoteService<any>,
    private notificationService:NotificationService
  ) {
    }
    exportExcel(data, fileName) {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, fileName);
        });
    }
    fetchMenuAccessList(){
      this._store.select(currentUserMenuItems).subscribe(response=>{
        this.menuAccess =response?.currentMenuItemsList.menuItems;
        if(this.menuAccess){
          // this._menuAccessList.next(this.getChildMenu(this.menuAccess));
         }
       });
      return null;
    }
    getAccessMenuList(){
      return this._menuAccessList.asObservable();
    }
    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

fileUpload(folderName,event,fileName):Observable<any>{
    const profileToUpload =<File>event;
    const formdata:FormData = new FormData();
    formdata.append("File", profileToUpload);
    formdata.append("FolderName", folderName);
    formdata.append("FileName",fileName);
    formdata.append("FileMaxSize","5368709120");
    formdata.append("AllowExtensions","1");
      const serviceConf = new ServiceConfig();
    serviceConf.method = HttpMethod.FILE;
    serviceConf.path = PATH.FETCH_FILE_VIRTUALPATH;
    serviceConf.requestHeader = {};
    const payload = formdata;
    serviceConf.payloadObjects = payload;
    return this.remoteService.httpServiceRequest(serviceConf)?.pipe(res =>{
      return res;
    });
}
dataURItoBlob(dataURI: string): Observable<Blob> {
  return Observable.create((observer: Observer<Blob>) => {
    const byteString: string = window.atob(dataURI);
    const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    observer.next(blob);
    observer.complete();
  });
}

keyPressAlphanumeric(event) {
  AppUtil.validateAlphanumeric(event);
}
keyPressNumeric(event) {
  AppUtil.validateNumbers(event);
}

prepareOrgListByOU(params) {
  console.log(params)
  //org
  if(params == UI_CONSTANT.ORGANIZATIONLIST[0].value){
    this.orgDataUnitList = [];
    this._store.select(selectOrganizationState).subscribe(res => {
      console.log(res);
      if (res && res.organizationList) {
        const temporgnaizationList: Organization[] = AppUtil.deepCopy(res.organizationList);
        temporgnaizationList.map(z => {
          this.orgDataUnitList.push({
            value: z.organizationID,
            key: z.organizationName
          });
        });
      }
    });
  }
  //company
  if (params == UI_CONSTANT.ORGANIZATIONLIST[1].value) {
    this.orgDataUnitList = [];
    this._store.select(selectCompanyState).subscribe(res => {
      if (res && res.companyList) {
        const tempCompanyList: Company[] = AppUtil.deepCopy(res.companyList);
        tempCompanyList.map(z => {
          this.orgDataUnitList.push({
            value: z.companyID,
            key: z.companyName
          });
        });
      }
    });
  }
  else if (params == UI_CONSTANT.ORGANIZATIONLIST[2].value) {
    this.locationDataList = [];
    this._store.select(selectBranchState).subscribe(res => {
      if (res && res.branchList) {
        const tempbranchList: Branch[] = AppUtil.deepCopy(res.branchList);
        tempbranchList.map(x => {
          this.orgDataUnitList.push({
            value: x.branchID,
            key: x.branchName
          });
        });
      }
    });
  }
  //contractor
  else if (params == UI_CONSTANT.ORGANIZATIONLIST[3].value) {
    this.orgDataUnitList = [];
    this._store.select(selectContractorState).subscribe(res => {
      if (res && res.contractorList) {
        const tempcontractorList: Contractor[] = AppUtil.deepCopy(res.contractorList);
        tempcontractorList.map(x => {
          this.orgDataUnitList.push({
            value: x.contractorID,
            key: x.contractorName
          });
        });
      }
    });
  }
  //category
  else if (params == UI_CONSTANT.ORGANIZATIONLIST[4].value) {
    this.orgDataUnitList = [];
    this._store.select(selectCategoryState).subscribe(res => {
      if (res && res.categoryList) {
        const tempcategoryList: Category[] = AppUtil.deepCopy(res.categoryList);
        tempcategoryList.map(x => {
          this.orgDataUnitList.push({
            value: x.categoryID,
            key: x.categoryName
          });
        });
      }
    });
  }
  //department
  else if (params == UI_CONSTANT.ORGANIZATIONLIST[5].value) {
    this.orgDataUnitList = [];
    this._store.select(selectDepartmentState).subscribe(res => {
      if (res && res.departmentList) {
        const tempdepartmentList: Department[] = AppUtil.deepCopy(res.departmentList);
        tempdepartmentList.map(y => {
          this.orgDataUnitList.push({
            value: y.departmentID,
            key: y.departmentName
          });
        });
      }
    });
  }
  //subdepart
  else if (params == UI_CONSTANT.ORGANIZATIONLIST[6].value) {
    this.orgDataUnitList = [];
    this._store.select(selectSubDepartmentState).subscribe(res => {
      if (res && res.subdepartmentList) {
        const tempsubdepartmentList: SubDepartment[] = AppUtil.deepCopy(res.subdepartmentList);
        tempsubdepartmentList.map(x => {
          this.orgDataUnitList.push({
            value: x.subDepartmentID,
            key: x.subDepartmentName
          });
        });
      }
    });

  }
  //Designation
  else if (params == UI_CONSTANT.ORGANIZATIONLIST[7].value) {
    this.orgDataUnitList = [];
    this._store.select(selectDesignationState).subscribe(res => {
      if (res && res.designationList) {
        const tempdesignationList: Designation[] = AppUtil.deepCopy(res.designationList);
        tempdesignationList.map(x => {
          this.orgDataUnitList.push({
            value: x.designationID,
            key: x.designationName
          });
        });
      }
    });
  }
  //level
  else if (params == UI_CONSTANT.ORGANIZATIONLIST[8].value) {
    this.orgDataUnitList = [];
    this._store.select(selectLevelState).subscribe(res => {
      if (res && res.levelList) {
        const templevelList: Level[] = AppUtil.deepCopy(res.levelList);
        templevelList.map(x => {
          this.orgDataUnitList.push({
            value: x.levelID,
            key: x.levelName
          });
        });
      }
    });
  }
  //section
  else if (params == UI_CONSTANT.ORGANIZATIONLIST[9].value) {
    this.orgDataUnitList = [];
    this._store.select(selectSectionState).subscribe(res => {
      if (res && res.sectionList) {
        const tempsectionList: Section[] = AppUtil.deepCopy(res.sectionList);
        tempsectionList.map(x => {
          this.orgDataUnitList.push({
            value: x.sectionID,
            key: x.sectionName
          });
        });
      }
    });
  }
  //grade
  else if (params == UI_CONSTANT.ORGANIZATIONLIST[10].value) {
    this.orgDataUnitList = [];
    this._store.select(selectGradeState).subscribe(res => {
      if (res && res.gradeList) {
        const tempgradeList: Grade[] = AppUtil.deepCopy(res.gradeList);
        tempgradeList.map(x => {
          this.orgDataUnitList.push({
            value: x.gradeID,
            key: x.gradeName
          });
        });
      }
    });
  return this.orgDataUnitList;
  }
  return this.orgDataUnitList;
}
preparelocationDataByOU(params) {
  this.locationDataList = [];
  if (params == UI_CONSTANT.LOCATIONLIST[1].value || params == UI_CONSTANT.LOCATIONLIST[2].value) {
    this.locationDataList = [];
    this._store.select(selectEmployeeMasterState).subscribe(response => {
      if (response && response.employeeMasterList) {
        if (params == 13) {
          this.locationDataList = [];
          const tempempStatusList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeStatus);
          this.locationDataList = AppUtil.deepCopy(tempempStatusList);
        }
        else if (params == 12) {
          this.locationDataList = [];
          const tempempTypeList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.employeeType);
          this.locationDataList = AppUtil.deepCopy(tempempTypeList);
        }

      }
    });
  } 
  return this.locationDataList
}

 getDefaultYearForReport(){
  const currentYear = new Date().getFullYear();
  const date = new Date();
  return date.getMonth()==0? (currentYear-1).toString(): currentYear.toString();
 }
 getDefaultMonthForReport(){
  const currentMonth = new Date().getMonth();
  const date = new Date();
  return currentMonth==0? new Date(date.setMonth(11)).toLocaleString('default',{ month: 'short' })
              : new Date(date.setMonth(currentMonth-1)).toLocaleString('default',{ month: 'short' });
  
 }
 getDefaultMonthNumberForReport(){
  const currentMonth = new Date().getMonth();
  return currentMonth==0? 12 : currentMonth;
  
 }

  // this function is work previous month and year 
  getfetMonthYearForReport(){
    const date=new Date();
    date.setMonth(date.getMonth()-1);
    return date;
   }
   
}
