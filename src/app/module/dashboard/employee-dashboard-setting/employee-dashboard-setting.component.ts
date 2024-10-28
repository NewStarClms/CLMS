import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { EmployeeDashboardSettingService } from 'src/app/services/employee-dashboard-setting.service';
import { employeeDashboardSettingState } from 'src/app/store/app.state';
import { EmployeeDashboardSetting } from 'src/app/store/model/employee-dashboard-setting.model';


@Component({
  selector: 'app-employee-dashboard-setting',
  templateUrl: './employee-dashboard-setting.component.html',
  styleUrls: ['./employee-dashboard-setting.component.scss']
})
export class EmployeeDashboardSettingComponent implements OnInit {
  employeeDashboardSettings:Array<EmployeeDashboardSetting>=[];
  @Output() showEmployeeDashboardSetting = new EventEmitter<any>();
  constructor(private employeeDashboardSettingService: EmployeeDashboardSettingService,
    private _store: Store<any>,) { }

  ngOnInit(): void {
    this._store.select(employeeDashboardSettingState).subscribe(response=>
      {
        if (response && response.employeeDashboardSettingList) {
            this.employeeDashboardSettings = AppUtil.deepCopy(response.employeeDashboardSettingList);
        }
      });
    }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.employeeDashboardSettings, event.previousIndex, event.currentIndex);
  }

  SaveUserSetting(){
    this.employeeDashboardSettings.forEach(function (item, index) {
      item.sequence=index+1;
    });
    this.employeeDashboardSettingService.saveEmployeeDashboardSetting(this.employeeDashboardSettings);
    this.showEmployeeDashboardSetting.emit();
  }
  CancelUserSettingDialog(){
    this.showEmployeeDashboardSetting.emit();
  }
}
