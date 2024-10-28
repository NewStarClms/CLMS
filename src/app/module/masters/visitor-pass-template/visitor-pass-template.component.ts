import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { VisitorPassTemplateService } from 'src/app/services/visitor-pass-template.service';
import { selectVisitorPassTemplateState } from 'src/app/store/app.state';
import { VisitorPassTemplate } from 'src/app/store/model/master-data.model';

@Component({
  selector: 'app-visitor-pass-template',
  templateUrl: './visitor-pass-template.component.html',
  styleUrls: ['./visitor-pass-template.component.scss']
})
export class VisitorPassTemplateComponent implements OnInit {


  public columnDefs!: any[];
  // gridApi and columnApi
  private api!: GridApi;
  private columnApi!: ColumnApi;
  public rowData: Array<VisitorPassTemplate> = [];
  public visitorpassTemplateInfo: VisitorPassTemplate = {} as VisitorPassTemplate;
  constructor(
    private _store: Store<any>,
    private visitorPassTemplateService: VisitorPassTemplateService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private authenticationService:AuthService
  ) {
    this.visitorPassTemplateService.fetchVisitorPassTemplateData();
    this.visitorPassTemplateService.fetchTagMasterData();
  }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectVisitorPassTemplateState).subscribe(response => {
      if (response && response.visitorPassTemplateList) {
        this.rowData = response.visitorPassTemplateList;
      }
    });
    this.columnDefs = this.visitorPassTemplateService.prepareColumnForGrid();
  }

  addNew() {
    this.visitorpassTemplateInfo = {} as VisitorPassTemplate;
    this.router.navigate(['/add-edit-visitor-template/' + 0]);
  }

  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.visitorpassTemplateInfo = params.data;
        this.router.navigate(['/add-edit-visitor-template/' + params.data.templateID]);
      }

      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item) => item.templateID == params.data.templateID);
            temdata.splice(index, 1);
            this.rowData = temdata;
            this.visitorPassTemplateService.deleteCellFromRemote(params);
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
        this.visitorPassTemplateService.updateStateOfCell(params);
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
    this.visitorPassTemplateService.getCSVReport(this.rowData, 'visitorArea');
  }
}
