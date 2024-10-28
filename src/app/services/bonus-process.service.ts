import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { HttpMethod } from "../common/constants/http-method.constants";
import { PATH } from "../common/constants/service-path.constants";
import { UI_CONSTANT } from "../common/constants/ui-constants";
import { NotificationService } from "../common/notification.service";
import { RemoteService } from "../common/remote.service";
import { BonusProcessPayload } from "../store/model/bonus-process.model";
import { ServiceConfig } from "../store/model/serviceConfig.model";


@Injectable({
    providedIn: 'root'
  })

  export class BonusProcessService {
    constructor(
        private remoteService: RemoteService<any>,
        private notificationService: NotificationService
      ) {}

      public fetchEmployeeList(financialYearID: string, fromDate:string, toDate: string, flag: string) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path =PATH.FETCH_EMPLOYEE_LIST_FOR_PROCESS + 'financialYearID=' + financialYearID + '&fromDate=' + fromDate+'&toDate='+toDate+"&flag="+flag;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(
          map((response) => {
            if (response && response.data) {
              return response.data;
            }
          })
        );
      }

      public fetchEmployeeBonusDetail(financialYearID: string, fromDate:string, toDate: string, flag: string) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.path =PATH.FETCH_EMPLOYEE_BONUS_DETAIL + 'financialYearID=' + financialYearID + '&fromDate=' + fromDate+'&toDate='+toDate+"&flag="+flag;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(
          map((response) => {
            if (response && response.data) {
              return response.data;
            }
          })
        );
      }

      public processEmployeeBonus(payload:BonusProcessPayload) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path =PATH.PROCESS_BONUS_DATA;
        serviceConf.payloadObjects=payload;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(
          map((response) => {
            if (response.data?.messageType === 0) {
                this.notificationService.showSuccess(response.data.message, UI_CONSTANT.SEVERITY.SUCCESS);
               }else{
                 this.notificationService.showError(response.data.message, UI_CONSTANT.SEVERITY.ERROR);
               }
               return response;
          })
        );
      }

      public unProcessEmployeeBonus(payload:BonusProcessPayload) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path =PATH.UNPROCESS_BONUS_DATA;
        serviceConf.payloadObjects=payload;
        serviceConf.requestHeader = {};
        return this.remoteService.httpServiceRequest(serviceConf).pipe(
          map((response) => {
            if (response.data?.messageType === 0) {
                this.notificationService.showSuccess(response.data.message, UI_CONSTANT.SEVERITY.SUCCESS);
               }else{
                 this.notificationService.showError(response.data.message, UI_CONSTANT.SEVERITY.ERROR);
               }
               return response;
          })
        );
      }

      prepareColumnForProcessEmployeeGrid() {
        const columnDefs: any[] = [
          {
            headerName: '',
            field: 'bonusDetailID',
            filter: false,
            editable: false,
            sortable: false,
            checkbox: true,
            suppressSizeToFit:true,
            hideData: true
          },
          {
            headerName: 'Code',
            field: 'employeeCode',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Name',
            field: 'employeeName',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Department',
            field: 'department',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true
          },
          {
            headerName: 'Designation',
            field: 'designation',
            filter: true,
            suppressSizeToFit: true,
            editable: true,
            sortable: false
          },
          {
            headerName: 'EarnedBasic',
            field: 'earnedBasic',
            filter: true,
            suppressSizeToFit: true,
            editable: true,
            sortable: false
          },
          {
            headerName: 'WagesForBonus',
            field: 'wagesForBonus',
            filter: true,
            suppressSizeToFit: true,
            editable: true,
            sortable: false
          },
          {
            headerName: 'TotalDays',
            field: 'totalDays',
            filter: true,
            suppressSizeToFit: true,
            editable: true,
            sortable: false
          },
          {
            headerName: 'Bonus%',
            field: 'bonusPercentage',
            filter: true,
            suppressSizeToFit: true,
            editable: true,
            sortable: false
          },
          {
            headerName: 'Bonus',
            field: 'bonusAmount',
            filter: true,
            suppressSizeToFit: true,
            editable: true,
            sortable: false
          },
          {
            headerName: 'Exgratia',
            field: 'exgratiaAmount',
            filter: true,
            suppressSizeToFit: true,
            editable: true,
            sortable: false
          }
        ];
        return columnDefs;
      }

      prepareColumnForUnProcessEmployeeGrid() {
        const columnDefs: any[] = [
          {
            headerName: '',
            field: 'employeeID',
            filter: false,
            editable: false,
            sortable: false,
            checkbox: true,
            suppressSizeToFit:true,
            hideData: true
          },
          {
            headerName: 'Code',
            field: 'employeeCode',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Name',
            field: 'employeeName',
            filter: true,
            editable: false,
            sortable: true,
          },
          {
            headerName: 'Department',
            field: 'department',
            filter: true,
            suppressSizeToFit: true,
            editable: false,
            sortable: true
          },
          {
            headerName: 'Designation',
            field: 'designation',
            filter: true,
            suppressSizeToFit: true,
            editable: true,
            sortable: false
          },
          {
            headerName: 'TotalDays',
            field: 'totalDays',
            filter: true,
            suppressSizeToFit: true,
            editable: true,
            sortable: false
          }
        ];
        return columnDefs;
      }
  }  