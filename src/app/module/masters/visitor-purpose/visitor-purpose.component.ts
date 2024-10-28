import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { VisitorPurposeService } from '../../../services/visitor-purpose.service';
import { selectVisitorPurposeState } from '../../../store/app.state';
import { VisitPurpose } from '../../../store/model/master-data.model';

@Component({
  selector: 'app-visitor-purpose',
  templateUrl: './visitor-purpose.component.html',
  styleUrls: ['./visitor-purpose.component.scss']
})
export class VisitorPurposeComponent implements OnInit {
  public columnDefs!: any[];
  public rowData: Array<VisitPurpose> = [];
  public visitpurposeInfo: VisitPurpose = {} as VisitPurpose;
  @ViewChild('closebutton') closebutton;
  public displayPosition: boolean;
  public display = false;
  public isEditable = false;
  public labelName:string="";
  public headerdialogName:string="";
  constructor(
    private _store: Store<any>,
    private visitorpurposeService: VisitorPurposeService,
    private confirmationService: ConfirmationService,
    private authenticationService:AuthService

  ) {

  }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectVisitorPurposeState).subscribe(response => {
      if (response && response.visitorPurposeList) {
        this.rowData = response.visitorPurposeList;
      }
    });
    this.columnDefs = this.visitorpurposeService.perpareColumnForGrid()
    this.visitorpurposeService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
  SaveVisitorPurposeData(visitorPurposeForm: NgForm) {
    if (this.visitpurposeInfo.visitPurposeID > 0) {
      this.visitorpurposeService.updateStateOfCell(this.visitpurposeInfo);
    } else {
      this.visitorpurposeService.saveVisitorPurpose(this.visitpurposeInfo);

    }
  }
  CancelVisitorPurposeData() {
    this.visitorpurposeService.setVisibility(false);
  }
  addNew() {
    this.labelName="Save";
   this.headerdialogName="Add Visit Purpose";
    this.visitpurposeInfo = {} as VisitPurpose;
    this.visitorpurposeService.setVisibility(true);
  }

  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.visitpurposeInfo = params.data;
        this.visitorpurposeService.setVisibility(true);
        if(this.visitpurposeInfo.visitPurposeID !== 0 ){
          this.labelName="Update";
         this.headerdialogName="Update Visitor Purpose";
        }
      }

      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item) => item.visitPurposeID == params.data.visitPurposeID);
            temdata.splice(index, 1);
            this.visitorpurposeService.deleteCellFromRemote(params);
            this.rowData = temdata;

          },
          reject: (type) => {
            switch (type) {
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
        console.log('update', params);
        this.visitorpurposeService.updateStateOfCell(params);
      }

      if (action === UI_CONSTANT.ACTIONS.CANCEL) {
        params.api.stopEditing(true);
      }
    }
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
  exportGridData() {
    this.visitorpurposeService.getCSVReport(this.rowData, 'VisitorPurpose');
  }
}
