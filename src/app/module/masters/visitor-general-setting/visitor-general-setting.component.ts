import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { VisitorGeneralSetting } from '../../../store/model/VisitorGeneralSetting.model';
import { selectGeneralSettingsState } from '../../../store/app.state';
import { AppUtil } from 'src/app/common/app-util';
import { VisitorGeneralSettingService } from '../../../services/VisitorGeneralSetting.service';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-visitor-general-setting',
  templateUrl: './visitor-general-setting.component.html',
  styleUrls: ['./visitor-general-setting.component.scss']
})
export class VisitorGeneralSettingComponent implements OnInit {

  
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
  
  public clonedProducts: { [s: string]: VisitorGeneralSetting; } = {};
  orgGenaralData: Array<{ key: string, value: string }>;
  constructor(
    private _store: Store<any>,
    private visitorGeneralSettingsService:VisitorGeneralSettingService,
    private authenticationService:AuthService
  ) { 
    this.visitorGeneralSettingsService.fetchGeneralSettigsData();
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

  saveVisitorGeneralSettingsData(visitorGeneralSettingObj) {
    let settingObj: any[] =[];
    settingObj.push(visitorGeneralSettingObj);
    console.log(settingObj);
    this.visitorGeneralSettingsService.updateStateOfCell(settingObj);
  }
  onRowEditInit(rowData:VisitorGeneralSetting) {
    this.sizeClass='sizeClass-active';
    console.log(rowData);
  }

  onRowEditSave(visitorGeneralSettingObj: VisitorGeneralSetting) {
    this.sizeClass='';
    console.log(this.visitorgeneralsetting)
    if (visitorGeneralSettingObj.generalSettingID > 0) {
      this.saveVisitorGeneralSettingsData(visitorGeneralSettingObj);
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
