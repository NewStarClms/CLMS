import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { VisitorGeneralSetting } from '../../../store/model/generalSettings.model';
import { selectGeneralSettingsState } from '../../../store/app.state';
import {ConfirmationService} from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { GeneralSettingsService } from '../../../services/general-settings.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { NgForm } from '@angular/forms';
import { selectAppDataState, selectAutoCodeOrgState, selectGlobalSettingState } from 'src/app/store/app.state';
import { AppData } from 'src/app/store/model/appData.model';
import { map } from 'rxjs/operators';
import { FileVirtualPath } from '../../../store/model/file.model';
import { AuthService } from 'src/app/services/authentication.service';




@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {

  
  public gridRowData: Array<VisitorGeneralSetting> = [];
  VisitorGeneralSettingInfoList: Array<VisitorGeneralSetting> = [];
  public VisitorGeneralSettingInfo: VisitorGeneralSetting = {} as VisitorGeneralSetting;
  public isEditable = false;
  public display = false;
  public visitorgeneralsetting: Array<VisitorGeneralSetting> = [];
  public columnDefs: Array<any>;
  public cols: Array<any>;
  public sizeClass:string='';
  public orgList = [];
  public appDataPriorityList:AppData[]=[];
  public clonedProducts: { [s: string]: VisitorGeneralSetting; } = {};
  orgGenaralData: Array<{ key: string, value: string }>;
  constructor(
    private _store: Store<any>,
    private generalSettingsService: GeneralSettingsService,
    private authenticationService:AuthService
  ) { 

   
  }
  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.orgGenaralData = [
      {key: 'Yes',value:'Y'},
      {key: 'No',value:'N'},
    ];

    this.cols = [
      {
        headerName: 'Setting Name',
        field: 'generalSettingName',

      },
      {
        headerName: 'Value',
        field: 'Value',

      },
      {
        headerName: '',
        field: 'edit',
      }];
  
      this._store.select(selectGeneralSettingsState).subscribe(res => {
        if (res && res.generalSettingsList) {
          this.VisitorGeneralSettingInfoList = AppUtil.deepCopy(res.generalSettingsList);
          this.visitorgeneralsetting = AppUtil.deepCopy(res.generalSettingsList);
          console.log('visitorgeneralsetting', this.visitorgeneralsetting);
        }
      });
    }
    savegeneralSettingsData(globalsettingObj) {
      let settingObj: any[] =[];
      settingObj.push(globalsettingObj);
      console.log(settingObj);
      this.generalSettingsService.updateStateOfCell(settingObj);
    }
    onRowEditInit(rowData:VisitorGeneralSetting) {
      this.sizeClass='sizeClass-active';
      console.log(rowData);
    }
  
    onRowEditSave(globalsettingObj: VisitorGeneralSetting) {
      this.sizeClass='';
      console.log(this.visitorgeneralsetting)
      if (globalsettingObj.generalSettingID > 0) {
        this.savegeneralSettingsData(globalsettingObj);
      }
      else {
        console.log('cancel');
      }
    }
    onRowEditCancel(product: VisitorGeneralSetting, index: number) {
      this.sizeClass='';
      delete this.clonedProducts[product.generalSettingID];
    }

}




