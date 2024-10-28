import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { CanteenPolicyService } from 'src/app/services/canteen-policy.service';
import { ItemMasterService } from 'src/app/services/item-master.service';
import { selectCanteenPolicyDetailState, selectItemMasterState } from 'src/app/store/canteen.app.state';
import { CanteenPolicyDetail, CanteenPolicyModel, ItemMaster, mapping, mappingModel } from 'src/app/store/model/canteen.model';
import {organizationMapping} from 'src/app/store/model/master-data.model';

@Component({
  selector: 'app-canteen-policy',
  templateUrl: './canteen-policy.component.html',
  styleUrls: ['./canteen-policy.component.scss']
})
export class CanteenPolicyComponent implements OnInit {
  public columnDefs!: any[];
  private api!: GridApi;
  private columnApi!: ColumnApi;
  public rowData: Array<CanteenPolicyDetail> = [];
  public selectedItemMasterItem: Array<ItemMaster> = [];
  public orgnaizationMappingInfo: organizationMapping = {} as organizationMapping;
  public canteenPolicyModelInfo:CanteenPolicyModel= {} as CanteenPolicyModel;
  public canteenPolicyInfo:CanteenPolicyDetail={}as CanteenPolicyDetail;
  public canteenPolicyList: Array<mapping> = [];
  public canteenPolicyListModel: Array<mappingModel> = [];
  public policyBasedONList=UI_CONSTANT.POLICYBASEDONLIST;
  public orgUnitList = UI_CONSTANT.ORGANIZATIONLIST;
  public locationList = UI_CONSTANT.LOCATIONLIST;
  public selectedItemMaster: Array<mapping>=[];
  public LocationDataList: Array<any> = [];
  public orgDataUnitList: Array<any> = [];
  public selectedOrganiztion: Array<number>;
  public selectedLocation: Array<number>;
  public displayOUMap:boolean=false;
  public isAddNewPolicy = false;
  public labelName:string;
  public headerdialogName:string;
  public canteencolumnDefs!: any[];
  public canteenrowData: Array<mapping>= [];
  public itemMasterInfo: ItemMaster = {} as ItemMaster;
  public ItemMasters: Array<ItemMaster>= [];
  public ItemMastersMap: Array<mapping>= [];
  public canteenPolicyMappingInfo: mapping = {} as mapping;
  public PolicyBasedOn:string;
  selectedMapping: Array<ItemMaster>=[];
  @Output() onCheckRowClicked = new EventEmitter<any>();
  @Output() onCheckAllClicked = new EventEmitter<any>();

  constructor(  private canteenPolicyService: CanteenPolicyService,
    private _store:Store<any>,
    private appCoreCommonService: AppCoreCommonService,
    private itemMasterService:ItemMasterService,
    private confirmationService:ConfirmationService) {
    this.canteenPolicyService.fetchCanteenPolicyDetailData();
    }

  ngOnInit(): void {
    this.canteenPolicyModelInfo.policyID = 0;
    this._store.select(selectCanteenPolicyDetailState).subscribe(response => {
      if (response && response.CanteenPolicyDetailList) {
        this.rowData = response.CanteenPolicyDetailList;
      }
    });
    this.columnDefs = this.canteenPolicyService.prepareColumnsForGrid();

    this.canteenPolicyService.getVisiblity().subscribe(res => {
      this.displayOUMap = res;
     
    });
    this.canteenPolicyService.getVisiblitys().subscribe(res=>{
      this.isAddNewPolicy=res;
    })
    this._store.select(selectItemMasterState).subscribe(res => {
      if (res) {
        this.canteenrowData = AppUtil.deepCopy(res.ItemMasterList);
      }
    });
    this.canteencolumnDefs = this.canteenPolicyService.prepareColumnForGrid();
  }

  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.isAddNewPolicy = !this.isAddNewPolicy;
       this.canteenPolicyService.fetchAttendancePolicyMasterDetail(params).subscribe(res=>{
        if(res){
          
          this.canteenPolicyModelInfo= AppUtil.deepCopy(res);
          this.selectedItemMaster =this.canteenPolicyModelInfo.mappings.filter((val) =>val.selected==true);
          this._store.select(selectItemMasterState).subscribe(res => {
            if (res) {
              this.ItemMasters =AppUtil.deepCopy(res.ItemMasterList);
              this.ItemMastersMap=[];
              this.canteenrowData=[];
              this.ItemMasters.map(item => {
                    this.ItemMastersMap.push({itemID: item.itemID,itemCode:item.itemCode,itemName:item.itemName,itemType:item.itemType,description:item.description,startTime:item.startTime,endTime:item.endTime,itemRate:item.itemRate,
                    itemRateAfterSubsidy:item.itemRateAfterSubsidy,employeeContribution:item.employeeContribution,employerContribution:item.employerContribution,subsidizedQuantity:item.subsidizedQuantity,selected:false
                     });
                  })
                    this.selectedItemMaster.map(ite => {
                    this.ItemMastersMap = this.ItemMastersMap.filter(item => item.itemID !== ite.itemID);
                   });
                  this.ItemMastersMap.map(item => {
                  this.canteenrowData.push({itemID: item.itemID,itemCode:item.itemCode,itemName:item.itemName,itemType:item.itemType,description:item.description,startTime:item.startTime,endTime:item.endTime,
                  itemRate:item.itemRate,itemRateAfterSubsidy:item.itemRateAfterSubsidy,employeeContribution:item.employeeContribution,employerContribution:item.employerContribution,subsidizedQuantity:item.subsidizedQuantity,selected:item.selected,
                   });
                })
                this.selectedItemMaster.map(item => {
                  this.canteenrowData.push({itemID: item.itemID,itemCode:item.itemCode,itemName:item.itemName,itemType:item.itemType,description:item.description,startTime:item.startTime,endTime:item.endTime,itemRate:item.itemRate,
                    itemRateAfterSubsidy:item.itemRateAfterSubsidy,employeeContribution:item.employeeContribution,employerContribution:item.employerContribution,subsidizedQuantity:item.subsidizedQuantity,selected:item.selected,
                     });
                  })
               }
          });
        }
      });
      let data =this.canteenPolicyModelInfo.policyBasedOn;
      let tempdata=data.trim().toString();
      this.PolicyBasedOn=tempdata;
        this.isAddNewPolicy=true;
        this.labelName="Update";
        this.headerdialogName="Update Canteen Policy";
        this.selectedItemMasterItem = this.selectedItemMasterItem.filter((val) => !this.ItemMasters?.includes(val));
      }
      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item) => item.policyID == params.data.policyID);
            temdata.splice(index, 1);
            this.canteenPolicyService.deleteCellFromRemote(params);
            this.rowData = temdata;

          },
          reject: (type) => {
            switch (type) {
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.REJECT:
                break;
              case UI_CONSTANT.CONFIRM_EVENT_TYPE.CANCEL:
                break;
            }
          }
        });
      }
     
      if (action === UI_CONSTANT.ACTIONS.MAPOU) {
        this.orgnaizationMappingInfo.policyID = params.data.policyID;
        this.canteenPolicyService.fetchPolicyMappingDetail(params.data.policyID).subscribe(res => {
          if (res) {
            this.canteenPolicyService.setVisibility(true);
            this.displayOUMap=true;
            this.orgnaizationMappingInfo = res.mapping;
            this.orgnaizationMappingInfo.policyID = res.mapping.policyID;
            this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(res.mapping.organizationKeyID);
            this.LocationDataList = this.appCoreCommonService.preparelocationDataByOU(res.mapping.locationKeyID);
            this.selectedLocation = res.mapping.location;
            this.selectedOrganiztion= res.mapping.organization;
            console.log(this.selectedLocation,'----',this.selectedOrganiztion);
            console.log(this.LocationDataList,'----',this.orgDataUnitList);
          }
        });
      }
    }
  }

  prepareOrgListByOU(params) {
    console.log(params);
    this.selectedOrganiztion = [];
    this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(params);
  }

  preparelocationDataByOU(params) {
    this.selectedLocation = [];
    this.LocationDataList = this.appCoreCommonService.preparelocationDataByOU(params);
  }
  CancelOrgnaizationMapping() {
    this.orgnaizationMappingInfo = {} as organizationMapping;
    this.canteenPolicyService.setVisibility(false);
  }
  AddNew()
  {
     this.selectedItemMaster =[]
      this.labelName="Save";
      this.headerdialogName="Add Canteen Policy";
      this.canteenPolicyService.setVisibilitys(true);
      this.canteenPolicyInfo = {} as CanteenPolicyDetail;
      this.isAddNewPolicy=true;
      this.setDefaultvalue();
  }

  saveCanteenPolicys(canteenPolicy:NgForm)
  {
    this.canteenPolicyList.splice(this.canteenPolicyList.length,1);
    this.canteenPolicyList =[];
    this.selectedItemMaster.map(item => {
      this.canteenPolicyList.push({itemID: item.itemID,itemCode:item.itemCode,itemName:item.itemName,itemType:item.itemType,description:item.description,startTime:item.startTime,endTime:item.endTime,
        itemRate:item.itemRate,itemRateAfterSubsidy:item.itemRateAfterSubsidy,employeeContribution:item.employeeContribution,employerContribution:item.employerContribution,subsidizedQuantity:item.subsidizedQuantity,selected:true
         });
      })
    this.canteenPolicyModelInfo.policyBasedOn=this.PolicyBasedOn;
    const tempCanteenPolicyinfo = AppUtil.deepCopy(this.canteenPolicyModelInfo);
    if(this.canteenPolicyModelInfo.policyID != 0){
      this.canteenPolicyModelInfo.mappings=this.canteenPolicyList;
      this.canteenPolicyService.updateCanteenPolicy(this.canteenPolicyModelInfo);
      this.isAddNewPolicy=false;
      }else{
        this.canteenPolicyModelInfo.mappings=this.canteenPolicyList;
        this.canteenPolicyService.saveCanteenPolicy(this.canteenPolicyModelInfo);
        this.isAddNewPolicy=false;
      }
  }
  SaveOrgnaizationMapping() {
    console.log(this.selectedLocation)
    console.log(this.selectedLocation)
    this.orgnaizationMappingInfo.policyTypeID = 1;
    this.orgnaizationMappingInfo.workFlowID = 0;
    this.orgnaizationMappingInfo.organization = ((this.selectedOrganiztion.map(x => x).join('~')).split('~')).map(i => Number(i));
    if(this.selectedLocation != null){
      this.orgnaizationMappingInfo.location = ((this.selectedLocation.map(x => x).join('~')).split('~')).map(i => Number(i));
    }
     this.canteenPolicyService.SaveOrgnaizationMapping(this.orgnaizationMappingInfo);
     this.canteenPolicyInfo.mappedOnOrganization=true;
    
  }

  cancelcanteenPolicy() {
    this.canteenPolicyService.setVisibilitys(false);
  }

  setDefaultvalue(){
    this.canteenPolicyModelInfo.policyID= 0,
    this.canteenPolicyModelInfo.policyTypeID= 1,
    this.canteenPolicyModelInfo.policyName='',
    this.canteenPolicyModelInfo.description=''
  }
  
  exportGridData() {
    this.canteenPolicyService.getCSVReport(this.rowData , 'CanteenPolicy');
 }
}
