import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { GlobalsettingService } from 'src/app/services/globalsetting.service';
import { selectAppDataState, selectAutoCodeOrgState, selectGlobalSettingState } from 'src/app/store/app.state';
import { AppData } from 'src/app/store/model/appData.model';
import { GlobalSetting } from 'src/app/store/model/globalsetting.model';

@Component({
  selector: 'app-globalsetting',
  templateUrl: './globalsetting.component.html',
  styleUrls: ['./globalsetting.component.scss'],
})
export class GlobalsettingComponent implements OnInit {

  public gridRowData: Array<GlobalSetting> = [];
  globalSettingInfoList: Array<GlobalSetting> = [];
  public globalSettingInfo: GlobalSetting = {} as GlobalSetting;
  public isEditable = false;
  public display = false;
  public globalsetting: Array<GlobalSetting> = [];
  public columnDefs: Array<any>;
  public cols: Array<any>;
  public sizeClass:string='';
  public autoDBBackup: Array<any> = [];
  public orgList = [];
  public appDataPriorityList:AppData[]=[];
  public clonedProducts: { [s: string]: GlobalSetting; } = {};
  public value1Obj: any = {
    value1OptionList: [],
    value1Label: ''
  }
  orgStateData: Array<{ key: string, value: string }>;
  public optionynList=UI_CONSTANT.YNLIST;
  public optionListObj:Array<any>=[];
  public Value1_Identifire:boolean=false;
  public Value2_Identifire:boolean=false;

  constructor(
    private _store: Store<any>,
    private globalSettingservice: GlobalsettingService,
    private authenticationService:AuthService
  ) {
    this.globalSettingservice.fetchGlobalSettingData();
  this.globalSettingservice.fetchAppDataPriorityData();
   }
  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false)
    this.cols = [
      {
        headerName: 'Setting Name',
        field: 'settingName',

      },
      {
        headerName: 'Value 1',
        field: 'value1',
      },
      {
        headerName: 'Value 2',
        field: 'value2',
      },
      {
        headerName: '',
        field: 'edit',
      }];
    this._store.select(selectAutoCodeOrgState).subscribe(data => {
      if (data) {
        this.orgStateData = AppUtil.deepCopy(data.orgList);
        this.orgStateData.map(i=>i.value = i.value.toString());

      }
    });
      
    this._store.select(selectAppDataState).subscribe(res => {
      if (res && res.appDataList) {
        this.appDataPriorityList = AppUtil.deepCopy(res.appDataList);
      }
    });

    this._store.select(selectGlobalSettingState).subscribe(res => {
      if (res && res.globalsettingList) {
        this.globalSettingInfoList = AppUtil.deepCopy(res.globalsettingList);
        this.globalsetting = AppUtil.deepCopy(res.globalsettingList);
        console.log('globalsetting', this.globalsetting);
      }
    });
    this._store.select(selectAppDataState).subscribe(res => {
      if (res && res.appDataList) {
        // const tempappDataPriorityList: AppData[] = AppUtil.deepCopy(res.appDataList);
        this.optionListObj = AppUtil.deepCopy(res.appDataList);;
        this.optionListObj.map(i=>i.value = i.value.toString());

      }
    });
   
  }

  SaveGlobalSettingData(globalsettingObj) {
    console.log(this.globalsetting);
    this.display=false;
    this.globalSettingservice.updateStateOfCell(globalsettingObj);
  }

  getDropdownOption(ouID: string) {
    let optionListObj: any[] = [];
    if (ouID === 'PRT') {
      this._store.select(selectAppDataState).subscribe(res => {
        if (res && res.appDataList) {
          // const tempappDataPriorityList: AppData[] = AppUtil.deepCopy(res.appDataList);
          optionListObj = AppUtil.deepCopy(res.appDataList);;
          optionListObj.map(i=>i.value = i.value.toString());

        }
      });
    } else if (ouID === 'ORG') {
      optionListObj = this.orgStateData;
    }
    else if (ouID === 'YN') {
      const tempOptionListDataOU = UI_CONSTANT.YNLIST;
      optionListObj = tempOptionListDataOU;
    }
    return optionListObj;
  }

  getNameOFValue(id) {
    if (id) {
      const name = this.orgStateData.filter(i => i.value.toString() === id)[0].key;
      return name;
    }
    return null;
  }
  getNameOFPRTValue(id){
    if (id) {
      const name = this.appDataPriorityList.filter(i => i.value.toString() === id)[0].key;
      return name;
    }
    return null;
  }

  onRowEditInit(rowData: GlobalSetting) {
    this.display=true;
    //this.sizeClass='sizeClass-active';
    this.globalSettingInfo=rowData;
    console.log(rowData);
    if(rowData.controlType==="ORG"){
      this.Value1_Identifire=true;
      this.Value2_Identifire=false;
      
    }else if(rowData.controlType==="PRT"){
      console.log('second')
      this.Value1_Identifire=false;
      this.Value2_Identifire=true;
     
    }
  }
  onRowEditCancel(){
    this.globalSettingInfo={} as GlobalSetting;
    this.globalSettingInfo.controlType=null
    console.log(this.globalSettingInfo)
    this.display=false;
  }
  onRowEditSave(){
    console.log(this.globalSettingInfo);
    if (this.globalSettingInfo.globalSettingID > 0) {
          this.SaveGlobalSettingData(this.globalSettingInfo);
        }
        else {
          console.log('cancel');
        }
    
  }
  // onRowEditSave(globalsettingObj: GlobalSetting) {
  //   this.sizeClass='';
  //   console.log(this.globalsetting)
  //   if (globalsettingObj.globalSettingID > 0) {
  //     this.SaveGlobalSettingData(globalsettingObj);
  //   }
  //   else {
  //     console.log('cancel');
  //   }
  // }

  // onRowEditCancel(product: GlobalSetting, index: number) {
  //   this.sizeClass='';
  //   delete this.clonedProducts[product.globalSettingID];
  // }
}
