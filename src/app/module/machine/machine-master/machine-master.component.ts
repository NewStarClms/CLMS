import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { MachineService } from 'src/app/services/machine.service';
import { MachineMaster } from 'src/app/store/model/machineMaster.model';

@Component({
  selector: 'app-machine-master',
  templateUrl: './machine-master.component.html',
  styleUrls: ['./machine-master.component.scss']
})
export class MachineMasterComponent implements OnInit {
  public columnDefs!: any[];
  public rowData: Array<MachineMaster>= [];
  constructor(private machineService: MachineService, private router: Router,private confirmationService: ConfirmationService) { 
 

  }

  ngOnInit(): void {
    this.machineService.getAll().subscribe(response=>{
      if (response && response.machines) {
          this.rowData = response.machines;
      }
    });
    this.columnDefs = this.machineService.prepareColumnForGrid();
  }

  onCellClicked(params){
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;

      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.router.navigate(['/machine/edit/'+params.data.machineID]);
      }
      else if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item) => item.machineID == params.data.machineID);
            temdata.splice(index, 1);
            this.machineService.deleteMachine(params.data.machineID);
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
    }
  }
  addNewMachine(){
    this.router.navigate(['/machine/edit/'+0]);
  }

  exportGridData() {
    this.machineService.getCSVReport(this.rowData , 'MachineMaster');
 }
 
}
