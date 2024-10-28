import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColumnApi, GridApi } from 'ag-grid-community';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { ItemMasterService } from 'src/app/services/item-master.service';
import { selectItemMasterState } from 'src/app/store/canteen.app.state';
import { ItemMaster } from 'src/app/store/model/canteen.model';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.scss']
})
export class ItemMasterComponent implements OnInit {
  public columnDefs!: any[];
  private api!: GridApi;
  private columnApi!: ColumnApi;
  public rowData: Array<ItemMaster>= [];
  public itemMasterInfo: ItemMaster = {} as ItemMaster;
  public displayPosition: boolean;
  public labelName:string='Save';
  public headerdialogName:string='Save Item Master';
  public display = false;
  readonly UICONSTANT = UI_CONSTANT;
  public itemTypeList=UI_CONSTANT.ITEM_TYPE_MASTER;
  constructor(
    private _store: Store<any>,
    private itemMasterService:ItemMasterService,
    private confirmationService: ConfirmationService,
    private authenticationService:AuthService
  ) { }
 
  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectItemMasterState).subscribe(res => {
      if (res) {
        this.rowData = AppUtil.deepCopy(res.ItemMasterList);
      }
    });

    this.columnDefs = this.itemMasterService.prepareColumnForGrid();
    this.itemMasterService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }


  onCellClicked(params) {
     if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.itemMasterInfo = params.data;
        this.display = !this.display;
        if(this.itemMasterInfo.itemID !== 0 ){
          this.labelName="Update";
         this.headerdialogName="Update Item Master";
        }
      }
  
       if (action === UI_CONSTANT.ACTIONS.DELETE) {
          this.confirmationService.confirm({
            message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
            header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
            icon: 'pi pi-info-circle',
            accept: () => {
               let tempData = AppUtil.deepCopy(this.rowData);
               const temdata = AppUtil.deepCopy(this.rowData);
               let index = this.rowData.findIndex((item)=>item.itemID == params.data.itemID);
              temdata.splice(index,1);
              this.itemMasterService.deleteCellFromRemote(params);
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

  getTime(event) {
    this.itemMasterInfo.startTime = moment(event).format("HH:mm");
  }
  gettoTime(event) {
    this.itemMasterInfo.endTime = moment(event).format("HH:mm");
  }

  addNew()
  {
    this.labelName="Save";
    this.headerdialogName="Add Item Master";
    this.itemMasterService.setVisibility(true);
    this.itemMasterInfo = {} as ItemMaster;
    this.display=true;
    this.setDefaultvalue();
  }

  SaveItemMasterData(ItemMasterForm:NgForm)
  {
    console.log(this.itemMasterInfo);
    if(this.itemMasterInfo.itemID > 0){
     this.itemMasterService.UpdateItemMaster(this.itemMasterInfo);
    // this.itemMasterService.fetchItemMasterData();
     this.itemMasterService.setVisibility(false);
    }
   else{
    this.itemMasterService.saveItemMaster(this.itemMasterInfo);
   // this.itemMasterService.fetchItemMasterData();
    this.itemMasterService.setVisibility(false);
  }

  }

  CancelSettlementData(ItemMasterForm){
    console.log(this.itemMasterInfo);
    this.itemMasterService.setVisibility(false);
    this.display=false;
  }

  updateStateLocaly(event, field) {
    const timeTemp = moment(event).format("HH:mm");
     switch (field) {
      case UI_CONSTANT.ITEM_MASTER_FIELD.START_TIME:
        this.itemMasterInfo.startTime = moment(event).format("HH:mm");
         break;
         case UI_CONSTANT.ITEM_MASTER_FIELD.END_TIME:
        this.itemMasterInfo.endTime  = moment(event).format("HH:mm");
         break;
     }
   }

   setDefaultvalue()
   {
    this.itemMasterInfo.startTime="00:00";
    this.itemMasterInfo.endTime="00:00";
    this.itemMasterInfo.itemRate=0.00;
    this.itemMasterInfo.itemRateAfterSubsidy=0;
    this.itemMasterInfo.employeeContribution=0;
    this.itemMasterInfo.employerContribution=0;
    this.itemMasterInfo.subsidizedQuantity=0;
   }

   exportGridData() {
    this.itemMasterService.getCSVReport(this.rowData , 'ItemMaster');
 }
}
