import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { UserGroupService } from 'src/app/services/user-group.service';
import { VisitorAdminService } from 'src/app/services/visitor-admin.service';
import { selectUserMenuItems } from 'src/app/store/app.state';

@Component({
  selector: 'app-employee-visitor-status',
  templateUrl: './employee-visitor-status.component.html',
  styleUrls: ['./employee-visitor-status.component.scss'],
})
export class EmployeeVisitorStatusComponent implements OnInit {
  public datepickerConfig: Partial<BsDatepickerConfig>;
  public visitStatus: any = {
    todayIn: 0,
    todayOut: 0,
    todayPending: 0,
    total: 0,
  };
  fromDate: string;
  public userPermission = false;
  constructor(
    private visitorAdminService: VisitorAdminService,
    private _store: Store,
    private userGroupService: UserGroupService
  ) {
    this.datepickerConfig = Object.assign(
      {},
      {
        containerClass: 'theme-default',
        adaptivePosition: true,
        dateInputFormat: 'DD-MMM-YYYY',
      }
    );
  }

  ngOnInit(): void {
    this.fromDate = moment(new Date()).format('DD-MMM-YYYY');
    const curDate =
      moment(moment(new Date()).format('DD-MMM-YYYY')).format('DD-MMM-YYYY') +
      ' ' +
      '00:00';
    this._store.select(selectUserMenuItems).subscribe((response) => {
      if (response && response.menuItemsList) {
        let newVisitor = this.userGroupService.isMenuAccessable(
          UI_CONSTANT.MenuAccessLable.Visitor,
          UI_CONSTANT.ACTIONS.NEWVISITORREQUEST
        );
        let deviceSync = this.userGroupService.isMenuAccessable(
          UI_CONSTANT.MenuAccessLable.Visitor,
          UI_CONSTANT.ACTIONS.DEVICESYNC
        );
        let visitorInOut = this.userGroupService.isMenuAccessable(
          UI_CONSTANT.MenuAccessLable.Visitor,
          UI_CONSTANT.ACTIONS.VISITORINOUT
        );
        if (newVisitor == true || deviceSync == true || visitorInOut == true) {
          this.userPermission = true;
          this.fetchStatus(curDate);
        }
      }
    });
  }

  loadVisitorStatus() {
    const curDate = moment(this.fromDate).format('yyyy-MM-DD') + ' 00:00';
    if (curDate) {
      this.fetchStatus(curDate);
    }
  }

  fetchStatus(curDate) {
    this.visitorAdminService.fetchVisitorStatus(curDate).subscribe((res) => {
      if (res && res.status) {
        (this.visitStatus.todayIn = res.status.todayIn),
          (this.visitStatus.todayOut = res.status.todayOut),
          (this.visitStatus.todayPending = res.status.todayPending),
          (this.visitStatus.total =
            res.status.todayIn + res.status.todayOut + res.status.todayPending);
      }
    });
  }
}
