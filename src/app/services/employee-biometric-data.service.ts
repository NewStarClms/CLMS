import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { GridApi } from "ag-grid-community";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpMethod } from "../common/constants/http-method.constants";
import { PATH } from "../common/constants/service-path.constants";
import { UI_CONSTANT } from "../common/constants/ui-constants";
import { NotificationService } from "../common/notification.service";
import { RemoteService } from "../common/remote.service";
import { EditableCellRendererComponent } from "../module/masters/renderer/editable-cell-renderer.component";
import { EmployeeBiometricData, SearchInput } from "../store/model/employee-biometric-data.model";
import { ServiceConfig } from "../store/model/serviceConfig.model";


@Injectable({
    providedIn: 'root'
})

export class EmployeeBiometricDataService{
    frameworkComponents: any = {
        editableCellRendererComponent: EditableCellRendererComponent
    };
    
    defaultColDef: { suppressSizeToFit: boolean; };
    colResizeDefault: string;
    
    private _gridApi:BehaviorSubject<GridApi> = new BehaviorSubject<GridApi>(null);
    employeeBiometricData: BehaviorSubject<EmployeeBiometricData>= new BehaviorSubject<EmployeeBiometricData>(null);
    public _visiblePopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    setGridApi(data) {
        this._gridApi.next(data);
    }
  
    getGridApi() {
       return this._gridApi.asObservable();
    }

    setVisibility(val){
      this._visiblePopup.next(val);
    }
    
    getVisiblity(){
      return this._visiblePopup.asObservable();
    }

    setEditableEmpBioData(empData){
      this.employeeBiometricData.next(empData);
    }

    getEditableEmpBioData(){
        return this.employeeBiometricData.asObservable();
    }

    constructor(private router: Router,private remoteService: RemoteService<any>,private notificationService:NotificationService) {  }
    
    public getAll(){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.requestHeader = {};
        serviceConf.path = PATH.MACHINE_EMP_BIOMETRIC_GETALL;
        return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
            //this.employeeBiometricData.next(response);
            return response;
        }));
    }
    public fetchUnregisteredEmployee(){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.requestHeader = {};
        serviceConf.path = PATH.MACHINE_UNREGISTER_EMP;
        return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
            return response;
        }));
    }
    public searchEmployeeMachine(searchInput: SearchInput){
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.GET;
        serviceConf.requestHeader = {};
        serviceConf.payloadObjects =searchInput;
        serviceConf.path = PATH.MACHINE_EMP_SEARCH;
        return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response => {
           // this.employeeBiometricData.next(response);
            return response;
        }));
    }
    
    public mapUnmapEmployeeToMachine(employeeIDs: string, machineIDs: string, actionTypeID: string) {
        const serviceConf = new ServiceConfig();
        serviceConf.method = HttpMethod.POST;
        serviceConf.path = PATH.MACHINE_EMP_ENROLL;
        serviceConf.requestHeader = {};
        serviceConf.payloadObjects = { 
            employeeIDs : employeeIDs,
            machineIDs: machineIDs,
            actionType: actionTypeID
        };
        return this.remoteService.httpServiceRequest(serviceConf).pipe(map(response =>{
          if(response.messageType === 0){
            this.notificationService.showSuccess(response.message, UI_CONSTANT.SEVERITY.SUCCESS);
            this.setVisibility(false);
          }
          else{
            this.notificationService.showError(response.message, UI_CONSTANT.SEVERITY.ERROR);
            this.setVisibility(true);
          }
          return response;
        }));
    }
     
    
    prepareUnRegisteredEmployeeColumnForGrid() {
        const columnDefs:any[] = [
        {
            headerName: 'Employee Name',
            field: 'employeeName',
            filter: true,
            editable: false,
            sortable: false,
            suppressSizeToFit:true,
        },
        {
            headerName: 'Punch ID',
            field: 'punchID',
            filter: true,
            suppressSizeToFit:true,
            editable: false,
            sortable: false,
    
        },
        {
            headerName: 'Punch Type',
            field: 'employeePunchTypeDesc',
            filter: false,
            suppressSizeToFit:true,
            editable: false,
            sortable: false,
    
        },
        {
            headerName: 'Face Registered?',
            field: 'isFaceRegistered',
            filter: false,
            suppressSizeToFit:true,
            editable: false,
            sortable: false,
    
        },
        {
            headerName: 'Finger Registered?',
            field: 'isFingerRegistered',
            filter: false,
            suppressSizeToFit:true,
            editable: false,
            sortable: false,
    
        },
        {
            headerName: 'Machine(s)',
            field: 'machines',
            filter: false,
            suppressSizeToFit:true,
            editable: false,
            sortable: false,
    
        },
        {
            headerName: "Action",
            field:'action',
            width: 100,
            cellRenderer: "editableCellRendererComponent",
            editable: false,
            colId: "action",
            false: true,
            deleteAllow: false,
            customBtn: true,
            customBtnText: "Register Emp"
          }
    ]
        return columnDefs;
    }
    prepareMachineColumnForGrid() {
        const columnDefs:any[] = [
        {
            headerName: '',
            field: 'machineID',
            filter: false,
            editable: false,
            sortable: false,
            checkbox: true,
            suppressSizeToFit:true,
            hideData: true
                
        },
        {
            headerName: 'Machine Code',
            field: 'machineCode',
            filter: false,
            editable: false,
            sortable: false,
            suppressSizeToFit:true,
        },
        {
            headerName: 'Machine Name',
            field: 'machineName',
            filter: false,
            suppressSizeToFit:true,
            editable: false,
            sortable: false,
    
        },
        {
            headerName: 'Machine Model',
            field: 'machineModelName',
            filter: false,
            editable: false,
            sortable: false,
            suppressSizeToFit:true,
        },      
        {
            headerName: 'Machine Type',
            field: 'machineTypeName',
            filter: false,
            suppressSizeToFit:true,
            editable: false,
            sortable: false,
        }]
        return columnDefs;
      };

      prepareRegisteredEmpColumns(){
        const columnDefs:any[] = [
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
                headerName: 'Employee Name',
                field: 'employeeName',
                filter: false,
                suppressSizeToFit:true,
                editable: false,
                sortable: false,
            },
            {
                headerName: 'Status',
                field: 'employeeStatus',
                filter: false,
                suppressSizeToFit:true,
                editable: false,
                sortable: false,
            },
            {
                headerName: 'Punch ID',
                field: 'punchID',
                filter: false,
                editable: false,
                sortable: false,
                suppressSizeToFit:true,
            },
            {
                headerName: 'Company Name',
                field: 'company',
                filter: false,
                suppressSizeToFit:true,
                editable: false,
                sortable: false,
        
            },
            {
                headerName: 'Dept Name',
                field: 'department',
                filter: false,
                editable: false,
                sortable: false,
                suppressSizeToFit:true,
            },      
           ]
            return columnDefs;
      }


}
    