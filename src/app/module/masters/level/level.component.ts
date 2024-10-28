import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, ColumnApi, GridApi, Module } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { Level } from '../../../store/model/master-data.model';
import { LevelService } from '../../../services/level.service';
import { selectLevelState } from '../../../store/app.state';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AppCoreCommonService } from '../../../services/app.core-common.services';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit {

  public columnDefs!: any[];
    public rowData: Array<Level>= [];
    public levelInfo:Level = {} as Level;
    public displayPosition: boolean;
  public display = false;
  public isEditable = false;
  public labelName:string="";
public headerdialogName:string="";
    @ViewChild('closebutton') closebutton;
  constructor(
    private _store: Store<any>,
    private levelService:LevelService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService
  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectLevelState).subscribe(res =>{
     if(res && res.levelList)  {
       this.rowData = res.levelList;
     }
    });
    this.columnDefs = this.levelService.prepareColumnForGrid();
    this.levelService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
    
  }
SaveLevelData(levelForm){
  console.log(this.levelInfo);
  if(this.levelInfo.levelID >0){
    this.levelService.updateStateOfCell(this.levelInfo);
  }else{
    this.levelService.saveLevel(this.levelInfo);
  }
}
CancelLevelData(){
  this.levelService.setVisibility(false);
}
addNew(){
    this.labelName="Save";
   this.headerdialogName="Add Level";
  this.levelInfo = {} as Level;
  this.levelService.setVisibility(true);
}
onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.display = !this.display;
      this.levelInfo = params.data;
      if(this.levelInfo.levelID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Level";
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.levelID == params.data.levelID);
          temdata.splice(index,1);
          this.levelService.deleteCellFromRemote(params);
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

    if (action === UI_CONSTANT.ACTIONS.UPDATE) {
      params.api.stopEditing(false);
      console.log('update',params);
      this.levelService.updateStateOfCell(params);
    }

    if (action === UI_CONSTANT.ACTIONS.CANCEL) {
      params.api.stopEditing(true);
    }
  }
}
keyPressAlphanumeric(event) {
  AppUtil.validateAlphanumeric(event);
}

exportGridData(){
  this.levelService.getCSVReport(this.rowData , 'level');
}

}
