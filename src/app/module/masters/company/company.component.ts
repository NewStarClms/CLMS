import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ColDef, ColumnApi, GridApi, Module } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { Company } from '../../../store/model/master-data.model';
import { CompanyService } from '../../../services/company.service';
import { selectCompanyState } from '../../../store/app.state';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AgGridAngular } from 'ag-grid-angular/public-api';
import { GridRendererComponent } from '../renderer/grid-renderer.component';
import { EditableCellRendererComponent } from '../renderer/editable-cell-renderer.component';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  public columnDefs!: any[];
  params: any;
  label!: string;
  saveClass?: string;
  delClass?: string;
  editClass?: string;
  private api!: GridApi;
  private columnApi!: ColumnApi;
  public rowData: Array<Company> = [];
  public companyInfo: Company = {} as Company;
  @ViewChild('closebutton') closebutton;
  @ViewChildren(GridRendererComponent) chviewChildren: QueryList<GridRendererComponent>;
  defaultColDef: { sortingOrder: string[]; stopEditingWhenGridLosesFocus: boolean; sortable: boolean; enableFilter: boolean; suppressKeyboardEvent: (event: any) => boolean; };
  frameworkComponents: any = {
    editableCellRendererComponent: EditableCellRendererComponent,
  };
  constructor(
    private _store: Store<any>,
    private companyService: CompanyService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private authenticationService:AuthService
  ) {
    this.defaultColDef = {
      sortingOrder: ["asc", "desc"],
      stopEditingWhenGridLosesFocus: false,
      sortable: true,
      enableFilter: true,
      suppressKeyboardEvent: event => {
        if (!event.editing || event.event.code === "Enter")
          return true;
        return false;
      }
    };
  }

  addNew(){
    this.companyInfo = {} as Company;
    this.router.navigate(['/add-edit-company/' + 0]);
  }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectCompanyState).subscribe(response => {
      if (response && response.companyList) {
        this.rowData = response.companyList;
      }
    });
    this.columnDefs = this.companyService.prepareColumnForGrid();
  }
  ngAfterViewInit() {
    console.log(this.chviewChildren);
    this.cd.detectChanges();
  }
  agInit(params: any): void {
    this.api = params.api;
    this.params = params;
    this.label = this.params.label || null;

  }
  getRowNodeId(data) {
    return data.id;
  }
  refresh(params?: any): boolean {
    return true;
  }

  onGridReady(params: any): void {
    this.api = params.api;
    this.api.setRowData(this.rowData);
    this.columnApi = params.columnApi;
    // this.api.sizeColumnsToFit();

  }

  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.router.navigate(['/add-edit-company/' + params.data.companyID]);
      }

      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.countryID == params.data.countryID);
            temdata.splice(index,1);
            this.companyService.deleteCellFromRemote(params);
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
        this.companyService.updateStateOfCell(params);
      }

      if (action === UI_CONSTANT.ACTIONS.CANCEL) {
        params.api.stopEditing(true);
      }
    }
  }
  closeModal() {
    this.closebutton.nativeElement.click();
  }

  exportGridData(){
    this.companyService.getCSVReport(this.rowData , 'Company');
  }
}
