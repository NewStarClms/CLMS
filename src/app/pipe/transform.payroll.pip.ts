import { Pipe, PipeTransform } from "@angular/core";
import { UI_CONSTANT } from '../common/constants/ui-constants';
import { Store } from '@ngrx/store';
import {   selectCityState,  selectEmployeeState } from '../store/app.state';
import { AppUtil } from '../common/app-util';
import {  City } from '../store/model/master-data.model';

import { Employee } from "../store/model/employee.model";
import { selectPayHeadsState } from '../store/payroll.app.state';
import { PayHeadsModel } from "../store/model/pay-component.model";

@Pipe(
    {
        name: 'PayrollName'
    }
)
export class FetchPayrollNameByID implements PipeTransform {
    store: any;
    filteredData: any;
    constructor(
        private _store: Store,
    ) {

    }
    transform(id: any, arg: any): string {
        // console.log('dfd',id,arg);
        this.filteredData = 'NA';
   
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
       
        if (arg === UI_CONSTANT.PAYROLL.LWFDEDUCTIONRULE) {
            const bList=UI_CONSTANT.DEDUCTIONRULE;
            this.filteredData = bList.filter(item => item.value === id)[0].key;
        }

        if(arg === UI_CONSTANT.PAYROLL.VARIABLE){
           if(id){
            this.filteredData = 'Variable';
           } else{
            this.filteredData = 'Fixed';
           }
        }
        return this.filteredData;
    }
}
