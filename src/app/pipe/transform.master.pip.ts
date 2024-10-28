import { Pipe, PipeTransform } from "@angular/core";
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { OrganizationService } from '../services/organization.service';
import { DepartmentService } from '../services/department.service';
import { BusinessTypeService } from '../services/business-type.service';
import { Store, State } from '@ngrx/store';
import {  selectBusinessTypeState, selectOrganizationState, selectDepartmentState, selectCompanyState, selectCityState, selectBankState,  selectUserGroupTypeState, selectEmployeeState } from '../store/app.state';
import { AppUtil } from '../common/app-util';
import { BusinessType, Company, Department, Organization, City, Bank } from '../store/model/master-data.model';
import { UserGroupType } from "../store/model/usermanage.model";
import { selectAutoCodeOrgState } from 'src/app/store/app.state';
import { Employee } from "../store/model/employee.model";
import * as moment from "moment";

@Pipe(
    {
        name: 'masterName'
    }
)
export class FetchNameByID implements PipeTransform {
    store: any;
    filteredData: any;
    constructor(
        private _store: Store,
        private organizationService: OrganizationService,
        private departmentService: DepartmentService,
        private businessTypeService: BusinessTypeService
    ) {

    }
    transform(id: any, arg: any): string {
        // console.log('dfd',id,arg);
        this.filteredData = 'NA';
        if (arg === UI_CONSTANT.MASTER.HOLIDAYDATE || arg === UI_CONSTANT.MASTER.FORMATDATE) {
            this.filteredData = moment(new Date(id)).format('DD-MMM-YYYY');
            //moment(id, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
        }
        if (arg === UI_CONSTANT.MASTER.ORGANIZATION) {
            const asyncData$ = this._store.select(selectOrganizationState);
            asyncData$.subscribe(data => {
                if (data) {
                    const bList: Organization[] = AppUtil.deepCopy(data.organizationList);
                    this.filteredData = bList.filter(item => item.organizationID === id)[0].organizationName;
                }

            });
        }
        if (arg === UI_CONSTANT.MASTER.HEADOFDEPART || arg === UI_CONSTANT.MASTER.SUPERVISOR) {
            return "HeadOFDEpt";//this.organizationService.fetchOrganizationById(id);
        }
        if (arg === UI_CONSTANT.MASTER.DEPARTMENT) {
            const asyncData$ = this._store.select(selectDepartmentState);
            asyncData$.subscribe(data => {
                if (data) {
                    const bList: Department[] = AppUtil.deepCopy(data.organizationList);
                    this.filteredData = bList.filter(item => item.departmentID === id)[0].departmentName;
                }

            });
            return this.departmentService.getDepartmentByID(id);
        }
        if (arg === UI_CONSTANT.MASTER.BUSINESSTYPE) {
            const asyncData$ = this._store.select(selectBusinessTypeState);
            asyncData$.subscribe(data => {
                if (data) {
                    const bList: BusinessType[] = AppUtil.deepCopy(data.businessTypeList);
                    this.filteredData = bList.filter(item => item.businessTypeID === id)[0].businessTypeName;
                }

            });

        }
        if (arg === UI_CONSTANT.MASTER.COMPANY) {
            const asyncData$ = this._store.select(selectCompanyState);
            asyncData$.subscribe(data => {
                if (data) {
                    const bList: Company[] = AppUtil.deepCopy(data.companyList);
                    this.filteredData = bList.filter(item => item.companyID === id)[0].companyName;
                }

            });
        }
        if (arg === UI_CONSTANT.MASTER.BANK) {
            const asyncData$ = this._store.select(selectBankState);
            asyncData$.subscribe(data => {
                if (data) {
                    const bList: Bank[] = AppUtil.deepCopy(data.bankList);
                    this.filteredData = bList.filter(item => item.bankID === id)[0].bankName;
                }

            });
        }
        if (arg === UI_CONSTANT.MASTER.USERGROUPTYPE) {
            const asyncData$ = this._store.select(selectUserGroupTypeState);
            asyncData$.subscribe(data => {
                if (data && data.userGroupTypeList) {
                    const bList: UserGroupType[] = AppUtil.deepCopy(data.userGroupTypeList);
                    this.filteredData = bList.filter(item => item.value === id)[0].key;
                }

            });
        }
        if (arg === UI_CONSTANT.MASTER.POLICYTYPE) {
            const bList = UI_CONSTANT.POLICYTYPELIST;
           this.filteredData = bList.filter(item => item.value === id)[0].key;
        }
        if (arg === UI_CONSTANT.MASTER.VISITORSTATUS) {
                    const bList=UI_CONSTANT.STATUSLIST;
                    this.filteredData = bList.filter(item => item.value === id)[0].key;
        }
        if (arg === UI_CONSTANT.MASTER.EMPLOYEE) {
            const asyncData$ = this._store.select(selectEmployeeState);
            asyncData$.subscribe(data => {
                if (data && data.employeeList) {
                    const bList: Employee[] = AppUtil.deepCopy(data.employeeList);
                    this.filteredData = bList.filter(item => item.employeeID === id)[0].employeeName;
                }

            });
        }
        if (arg === UI_CONSTANT.MASTER.STATE) {
            const asyncData$ = this._store.select(selectCityState);
            asyncData$.subscribe(data => {
                if (data) {
                    const bList: City[] = AppUtil.deepCopy(data.cityList);
                    this.filteredData = bList.filter(
                        item => (item.stateID === id))[0].stateName;
                }
            });
            return this.filteredData;

        }
        if (arg === UI_CONSTANT.MASTER.COUNTRY) {
            return UI_CONSTANT.COUNTRY[0].countryName;

        }
        if (arg === UI_CONSTANT.MASTER.OULIST) {
            const asyncData$ = this._store.select(selectAutoCodeOrgState);
            asyncData$.subscribe(data => {
                if (data) {
                    const bList: any[] = AppUtil.deepCopy(data.orgList);
                    this.filteredData = bList.filter(
                        item => (item.value === id))[0].key;
                }
            });
            return this.filteredData;

        }
        if (arg === UI_CONSTANT.MASTER.SHIFTTYPE) {
            const shift = UI_CONSTANT.SHIFT_TYPE.filter(i => i.key === id);
            return shift[0].value;

        }
        if (arg === UI_CONSTANT.MASTER.HOLIDAYMASTERTYPE) {
            const bList=UI_CONSTANT.HOLIDAY_TYPE;
            this.filteredData = bList.filter(item => item.value === id)[0].key;
        }
       
        return this.filteredData;
    }
}
