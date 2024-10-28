import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, ColumnApi, GridApi, Module } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { BusinessType, City, Organization } from '../../../store/model/master-data.model';
import { OrganizationService } from 'src/app/services/organization.service';
import { selectBusinessTypeState, selectCityState, selectOrganizationState } from 'src/app/store/app.state';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { CityService } from 'src/app/services/city.service';
import { ActivatedRoute } from '@angular/router';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { AuthService } from 'src/app/services/authentication.service';
import { SecureURLService } from 'src/app/services/secure-url.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  public columnDefs!: any[];
  public rowData: Array<Organization>= [];
  public organizationInfo:Organization = {} as Organization;
  public displayPosition: boolean;
  public display = false;
  public isEditable = false;
  public countryList=UI_CONSTANT.COUNTRY;
    public stateList:Array<any>=[];
    public cityList:Array<any>=[];
    public businessTypeList:Array<any>=[];
    isCityActive :boolean;
    public filePath: string ="../../../../assets/img/default_image.png";
    orgLogoToUpload: any;
    public labelName:string="";
    public headerdialogName:string="";
  @ViewChild('closebutton') closebutton;
constructor(
  private _store: Store<any>,
  private OrganizationService:OrganizationService,
  private confirmationService:ConfirmationService,
  private cityService:CityService,
  private corecommonServices:AppCoreCommonService,
  private authenticationService:AuthService,
  private secureURLService:SecureURLService,
) {

}

 ngOnInit(): void {
  this.authenticationService.setGlobalFilterVisibility(false);
    this._store.select(selectCityState).subscribe(result => {
      if (result && result.cityList) {
        this.stateList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityService.getCityDropdownOptionList(this.countryList[0].countryID, 'state'));
        this.cityList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityList);
      }
    });
  this._store.select(selectBusinessTypeState).subscribe(busT=>{
    if(busT && busT.businessTypeList){
      const tempbusList:BusinessType[]=AppUtil.deepCopy(busT.businessTypeList);
      tempbusList.map(b=>{
        this.businessTypeList.push({
          businessTypeID:b.businessTypeID,
          businessTypeName:b.businessTypeName
        })
      })
    }
  })

  this._store.select(selectOrganizationState).subscribe(res =>{
   if(res && res.organizationList)  {
     this.rowData = res.organizationList;
   }
  });
  this.columnDefs = this.OrganizationService.prepareColumnForGrid();
  this.OrganizationService.getVisiblity().subscribe(res =>{
    this.display = res;
  });
}
SaveOrganizationData(orgnaizationForm:NgForm){
console.log(this.organizationInfo);
if(this.organizationInfo.organizationID >0){
  this.OrganizationService.updateStateOfCell(this.organizationInfo);
}else{
  this.OrganizationService.saveOrganization(this.organizationInfo);
}
}
CancelOrganizationData(){
  this.OrganizationService.setVisibility(false);
}
addNew(){
  this.labelName="Save";
   this.headerdialogName="Add Organization";
  this.organizationInfo = {} as Organization;
  this.filePath="../../../../assets/img/default_image.png"
  this.OrganizationService.setVisibility(true);
}

onCellClicked(params) {
  // Handle click event for action cells
  if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
    let action = params.event.path[1].dataset.action;

    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.display = !this.display;
      this.organizationInfo = params.data;
      if(this.organizationInfo.organizationID !== 0 ){
        this.labelName="Update";
       this.headerdialogName="Update Organization";
      }
      if(this.organizationInfo.organizationLogo != null){
      //  this.filePath = this.organizationInfo.organizationLogo;
      this.filePath=this.secureURLService.appendSecurityToken(this.organizationInfo.organizationLogo);
        console.log(this.organizationInfo.organizationLogo);
      }else{
        this.filePath="../../../../assets/img/default_image.png"
      }
      if (this.organizationInfo.stateID) {
        console.log('dddddddd',this.organizationInfo,this.organizationInfo.stateID,this.organizationInfo.cityID);
        this.fillCityDDL();
      }
    }

    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          const temdata = AppUtil.deepCopy(this.rowData);
          let index = this.rowData.findIndex((item)=>item.businessTypeID == params.data.businessTypeID);
          temdata.splice(index,1);
          this.OrganizationService.deleteCellFromRemote(params);
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
      this.OrganizationService.updateStateOfCell(params);
    }

    if (action === UI_CONSTANT.ACTIONS.CANCEL) {
      params.api.stopEditing(true);
    }
  }
}
closeModal(){
  this.closebutton.nativeElement.click();
}
onUpload(event){
  return 'true';
}
onBasicUploadAuto(event){
  return true;
}
fillCityDDL() {
  if (this.organizationInfo.stateID) {
    this.isCityActive = false;
    return this.cityList = this.cityService.getCityDropdownOptionList(this.organizationInfo.stateID, 'city');
  }
  return this.cityList;
}
keyPressNumbers(event){
  AppUtil.validateNumbers(event);
}
keyPressAlphanumeric(event) {
  AppUtil.validateAlphanumeric(event);
}

exportGridData(){
  this.OrganizationService.getCSVReport(this.rowData , 'Organization');
}
handleFileInput(event) {
  this.orgLogoToUpload =<File>event.target.files[0];
  this.organizationInfo.organizationLogo=this.orgLogoToUpload.name;
  let reader = new FileReader();
  reader.onload = (event: any) => {
    this.filePath = event.target.result;
  }
  reader.readAsDataURL(this.orgLogoToUpload);
   this.corecommonServices.fileUpload('Organization-Logo',event.target.files[0],this.organizationInfo.organizationCode).subscribe(res=>{
     if(res){
      this.organizationInfo.organizationLogo=res.fileUrl;
      this.organizationInfo.OrganizationLogoID=res.fileGuid;
     }
   });
}
}
