import { APP_ID, Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { BusinessType, BusinessTypeModel } from '../../../store/model/master-data.model';
import { selectBusinessTypeState } from '../../../store/app.state';
import { BusinessTypeService } from '../../../services/business-type.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import {ConfirmationService} from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-business-type',
  templateUrl: './business-type.component.html',
  styleUrls: ['./business-type.component.scss']
})

export class BusinessTypeComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  public columnDefs!: any[];
  public businessTypeInfo: BusinessType = {} as BusinessType;
  public rowData: Array<BusinessType>= [];
  public displayPosition: boolean;
  public display = false;
  public isEditable = false;
  public labelName:string="";
public headerdialogName:string="";

  constructor(
    private _store: Store<any>,
    private businessService: BusinessTypeService,
    private confirmationService: ConfirmationService,
    private authenticationService:AuthService

  ) {
  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
     this.columnDefs = this.businessService.prepareColumnDefs();
     this._store.select(selectBusinessTypeState).subscribe(res =>{
      if(res && res.businessTypeList)  {
        this.rowData = AppUtil.deepCopy(res.businessTypeList);
        this.rowData = this.rowData.sort((a, b)=> b.businessTypeID - a.businessTypeID);
        console.log('refresh',this.rowData);
      }
     });

     this.businessService.getVisiblity().subscribe(res =>{
       this.display = res;
     });
  }
  addNewBusiness(){
    this.labelName="Save";
   this.headerdialogName="Add Business Type";
    this.businessService.setVisibility(true);
    this.businessTypeInfo = {} as BusinessType;
  }
  async SaveBusinessTypeData(frmValue,buform){
    console.log(this.businessTypeInfo);
    if(this.businessTypeInfo.businessTypeID >0){
      this.businessService.updateStateOfCell(this.businessTypeInfo)
    }else{
      this.businessService.saveBusinessType(this.businessTypeInfo);
    }
  }
  CancelBusinessTypeData(buform){
    this.businessService.setVisibility(false);

  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      console.log(params.event.path[1].dataset.action);
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.businessService.setVisibility(true);
        this.businessTypeInfo = params.data;
        if(this.businessTypeInfo.businessTypeID !== 0 ){
          this.labelName="Update";
         this.headerdialogName="Update Business Type";
        }
        console.log(params);
      }

      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.businessTypeID == params.data.businessTypeID);
            temdata.splice(index,1);
            this.businessService.deleteCellFromRemote(params);
            this.rowData = temdata;
          },
          reject: (type) => {
              switch(type) {
                  case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                      // this.notificationService.showError('Comfirmation Rejected', null);
                  break;
                  case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                    // this.notificationService.showWarning('Comfirmation Canceled');
                  break;
              }
          }
      });
      }

    }
  }
  exportGridData(){
    this.businessService.getCSVReport(this.rowData , 'BusinessType');
  }

}
