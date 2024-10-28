import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { IListBoxItem } from 'src/app/module/report/dual-list-box';
import { BonusSettingService } from 'src/app/services/bonus-setting.service';
import { PayGroupService } from 'src/app/services/pay-group.service';
import { BonusSetting } from 'src/app/store/model/payroll-statutory.model';
import { selectPayComponentState } from 'src/app/store/payroll.app.state';
import { PayComponentModel, PayGroupModel } from '../../../../store/model/pay-component.model';


@Component({
  selector: 'app-add-edit-pay-group',
  templateUrl: './add-edit-pay-group.component.html',
  styleUrls: ['./add-edit-pay-group.component.scss']
})
export class AddEditPayGroupComponent implements OnInit {

  headerdialogName: string = 'Add Pay Group';
  labelName: string = 'Add';
  payGroupInfo: PayGroupModel = {} as PayGroupModel;
  public stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  public payComponentList: Array<PayComponentModel> = [];
  public availableItems: Array<{ value: string, text: string }> = [];
  public salSlipTemplateList: Array<{ key: string, value: string }> = [];
  public settelSlipTemplateList: Array<{ key: string, value: string }> = [];
  container: CdkDragDrop<IListBoxItem[]> = null;
  public selectedComponent: Array<string> = [];
  public tabIndex:number=0;
  public bonusLists: Array<BonusSetting>=[];
  public selectedBonusSetting: BonusSetting={} as BonusSetting;
  constructor(
    private activateRouter: ActivatedRoute,
    private payGroupService: PayGroupService,
    private bonusSettingService: BonusSettingService,
    private _store: Store<any>,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.bonusSettingService.fetchBonusSettingData().subscribe(res=>{
      if(res){
        this.bonusLists=[];
        this.bonusLists=AppUtil.deepCopy(res.settings);
      }
    });

    this.payGroupService.getLeterTemplateList().subscribe(result => {
      if (result.length > 0) {
        console.log('res', result);
        const templateList: Array<any> = result;
        templateList.filter(x => x.templateTypeID === 15).map(y => {
          this.salSlipTemplateList.push({
            key: y.templateName,
            value: y.templateID
          });
        });
        templateList.filter(x => x.templateTypeID === 16).map(y => {
          this.settelSlipTemplateList.push({
            key: y.templateName,
            value: y.templateID
          });
        });
        if (Number(this.activateRouter.snapshot.params.id) != 0) {
          this.headerdialogName = "Update Pay Group";
          this.labelName = "Update";
          this.payGroupService.getPayGroupByID(this.activateRouter.snapshot.params.id).subscribe(res => {
            if (res) {
              this.payGroupInfo = AppUtil.deepCopy(res.payGroup);
              console.log('paygrop', this.payGroupInfo);
              if (this.payGroupInfo.allPayComponents.length > 0) {
    
                this.payGroupInfo.allPayComponents.forEach(x => {
                  this.availableItems.push({
                    text: x.payComponentName,
                    value: x.payCode
                  });
                  if (x.selected) this.selectedComponent.push(x.payCode);
                });
              }    
            }
          });
        } else {
          this._store.select(selectPayComponentState).subscribe(res=>{
            if(res && res.payComList){
          this.payGroupInfo = this.payGroupService.prepareDefaultPayGroup();
          this.payGroupInfo.policyID = 0;
          this.payGroupInfo.allPayComponents=AppUtil.deepCopy(res.payComList);
          this.payGroupInfo.allPayComponents.forEach(x => {
            this.availableItems.push({
              text: x.payComponentName,
              value: x.payCode
            });
          });
        }
      });
    }
  }
      console.log('payGroupInfo', this.payGroupInfo);
    });
    
    console.log('selectedComponent', this.selectedComponent);

    // }
    // });


  }
  fnupdateOption(e) {

  }
  fnupdateModel(e) {
  }
  savePayComponent(f) {
    console.log(this.payGroupInfo, '----', this.selectedComponent);
    this.payGroupInfo.allPayComponents.forEach(val => {
      if (this.selectedComponent.includes(val.payCode)) {
        val.selected = true;
      }
      if(this.availableItems.filter(itm=>itm.value==val.payCode)){
         val.sequenceNumber = this.availableItems.indexOf(this.availableItems.filter(itm=>itm.value==val.payCode)[0])+1; // this.availableItems.filter(p=>p.value == val.payCode)?1:0;
      }
    });
    if (this.payGroupInfo.policyID > 0) {
      this.payGroupService.updatePayGroupData(this.payGroupInfo);
    } else {
      this.payGroupService.SavePayGroupData(this.payGroupInfo);
    }
  }
  cancelEdit() {
    this.router.navigate(['payroll/pay-group']);
  }
  handleChange(e){
    this.tabIndex=e.index;
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.availableItems, event.previousIndex, event.currentIndex);
  }
}
