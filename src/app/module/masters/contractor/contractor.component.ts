import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { ContratorService } from '../../../services/contrator.service';
import { selectContractorState } from '../../../store/app.state';
import { Contractor, contractorLicenses } from '../../../store/model/master-data.model';
import { EditableCellRendererComponent } from '../renderer/editable-cell-renderer.component';

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.scss']
})

export class ContractorComponent implements OnInit {

  public columnDefs!: any[];
    // gridApi and columnApi
    params:any;
  label!: string;
  saveClass?:string;
  delClass?:string;
  editClass?:string;
    private api!: GridApi;
    private columnApi!: ColumnApi;
    public rowData: Array<Contractor>= [];
    public contractorInfo: Contractor = {} as Contractor;
    public contractorLicInfo:contractorLicenses = {} as contractorLicenses;
    @ViewChild('closebutton') closebutton;
  defaultColDef: { sortingOrder: string[]; stopEditingWhenGridLosesFocus: boolean; sortable: boolean; enableFilter: boolean; suppressKeyboardEvent: (event: any) => boolean; };
  constructor(
    private _store: Store<any>,
    private contractorService:ContratorService,
    private router:Router,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService
  ) {
     }

    ngOnInit(): void {
      this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectContractorState).subscribe(response=>
      {
        if (response && response.contractorList) {
            this.rowData = AppUtil.deepCopy(response.contractorList);
        }
      });
    this.columnDefs = this.contractorService.prepareColumnForGrid();
  }
  addNew(){
    this.contractorInfo = {} as Contractor;
    this.router.navigate(['/add-edit-contractor/'+0]);
  }
  getRowNodeId(data) {
    return data.id;
  }
  refresh(params?: any): boolean {
    return true;
  }
  onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.router.navigate(['/add-edit-contractor/'+params.data.contractorID]);
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.contractorID == params.data.contractonID);
          temdata.splice(index,1);
          this.contractorService.deleteCellFromRemote(params);
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


    if (action === UI_CONSTANT.ACTIONS.UPDATE) {
      params.api.stopEditing(false);
      console.log('update',params);
      this.contractorService.updateStateOfCell(params,null);
    }

    if (action === UI_CONSTANT.ACTIONS.CANCEL) {
      params.api.stopEditing(true);
    }
  }
}
closeModal(){
  this.closebutton.nativeElement.click();
}
exportGridData(){
  this.contractorService.getCSVReport(this.rowData , 'Contractor');
}
}
