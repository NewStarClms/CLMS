import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColDef, GridApi, ColumnApi } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { AuthService } from 'src/app/services/authentication.service';
import { Employee } from 'src/app/store/model/employee.model';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { SectionService } from '../../../services/section.service';
import { selectEmployeeState, selectSectionState } from '../../../store/app.state';
import { Section } from '../../../store/model/master-data.model';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {


  public columnDefs!: any[];
    public rowData: Array<Section>= [];
    public sectionInfo:Section= {} as Section;
    public labelName:string="";
    public headerdialogName:string="";
    @ViewChild('closebutton') closebutton;
    public displayPosition: boolean;
    public display = false;
    public isEditable = false;
    public empList:Array<any>=[];
  constructor(
    private _store: Store<any>,
    private sectionService:SectionService,
    private confirmationService:ConfirmationService,
    private authenticationService:AuthService

  ) {

  }

   ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectEmployeeState).subscribe(res=>{
      if(res && res.employeeList){
        this.empList= UI_CONSTANT.DEFAULT_SELECT.concat(this.empList);
        const tempbranchheadList:Employee[]=AppUtil.deepCopy(res.employeeList);
        tempbranchheadList.map(emp=>{
             this.empList.push({
               id:emp.employeeID,
               name:emp.employeeName
             })
        })
      }
    });
    this._store.select(selectSectionState).subscribe(response=>
      {
        if (response && response.sectionList) {
            this.rowData = AppUtil.deepCopy(response.sectionList);
        }
      });
    this.columnDefs = this.sectionService.prepareColumnForGrid();
    this.sectionService.getVisiblity().subscribe(res =>{
      this.display = res;
    });
  }
SaveSectionData(sectionForm:NgForm){
  console.log(this.sectionInfo);
  if(this.sectionInfo.sectionID >0){ 
  this.sectionService.updateStateOfCell(this.sectionInfo);

  }else{
    this.sectionService.saveSection(this.sectionInfo);
  }
  
}
CancelSectionData(){
  this.sectionInfo.sectionSupervisorDisplay="";
  this.sectionInfo = {} as Section;
  this.sectionService.setVisibility(false);
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add Section";
  this.sectionInfo = {} as Section;
  this.sectionService.setVisibility(true);
}
onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.display = true;
      this.sectionInfo = params.data;
      if(this.sectionInfo.sectionID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Section";
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
            let index = this.rowData.findIndex((item)=>item.sectionID == params.data.sectionID);
            temdata.splice(index,1);
          this.sectionService.deleteCellFromRemote(params);
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
      this.sectionService.updateStateOfCell(params);
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
  this.sectionService.getCSVReport(this.rowData , 'Section');
}
onGetEmployeeDetail(event){
  this.sectionInfo.sectionSupervisorID=event.data;
  this.sectionInfo.sectionSupervisorDisplay= event.column;
}
}
