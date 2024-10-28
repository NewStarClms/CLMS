import { Component,  OnInit, ViewChild } from '@angular/core';
import { City, Company, Organization } from '../../../store/model/master-data.model';
import { Store } from '@ngrx/store';
import { CompanyService } from '../../../services/company.service';
import { NgForm } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpMethod } from '../../../common/constants/http-method.constants';
import { ServiceConfig } from '../../../store/model/serviceConfig.model';
import { PATH } from '../../../common/constants/service-path.constants';
import { RemoteService } from '../../../common/remote.service';
import { Location } from '@angular/common';
import { selectOrganizationState, selectCompanyState, selectCityState } from '../../../store/app.state';
import { AppUtil } from '../../../common/app-util';
import { combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { CityService } from '../../../services/city.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { AuthService } from 'src/app/services/authentication.service';
import { SecureURLService } from 'src/app/services/secure-url.service';

@Component({
  selector: 'app-add-edit-company',
  templateUrl: './add-edit-company.component.html',
  styleUrls: ['./add-edit-company.component.scss']
})
export class AddEditCompanyComponent implements OnInit {
  public rowData: Array<Company>= [];
  public companyInfo: Company = {} as Company;
  public cityList:Array<any> = [];
  public stateList: Array<any>= [];
  public orgList: Array<any> = [];
  public countryList = UI_CONSTANT.COUNTRY;
  isCityActive: boolean;
  public filePath: string ="../../../../assets/img/default_image.png";
  profileToUpload: any;
  headerdialogName:string="Add Company";
  labelName:string="Save";
  stateOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
constructor(
  private _store: Store<any>,
  private companyService:CompanyService,
  private router: Router,
  private remoteService:RemoteService<any>,
  private activatedRoute:ActivatedRoute,
  private location: Location,
  private cityService: CityService,
  private corecommonServices:AppCoreCommonService,
  private authenticationService:AuthService,
  private secureURLService:SecureURLService
) {
}

 ngOnInit(): void {
  this.authenticationService.setGlobalFilterVisibility(false);
if(Number(this.activatedRoute.snapshot.params.id) != 0){
  this.headerdialogName="Update Company";
  this.labelName="Update";
  this._store.select(selectCompanyState).subscribe(compny =>{
    if(compny && compny.companyList){
      console.log(compny.companyList);
      const companytempList: Company[] = AppUtil.deepCopy(compny.companyList);
      this.companyInfo = companytempList.filter(i => i.companyID === Number(this.activatedRoute.snapshot.params.id))[0];
      if(this.companyInfo.companyLogoUrl !=null){
       // this.filePath = this.companyInfo.companyLogoUrl;
       this.filePath=this.secureURLService.appendSecurityToken(this.companyInfo.companyLogoUrl);
      }else{
        this.filePath = "../../../../assets/img/default_image.png";
      }
      if (this.companyInfo.stateID) {
        this.fillCityDDL();
      }
      console.log('fgg--',this.companyInfo.stateID,this.companyInfo.cityID);
    }
    });
}
  this._store.select(selectOrganizationState).subscribe(res =>{
    if(res && res.organizationList){
      const tempOrgList: Organization[] = AppUtil.deepCopy(res.organizationList);
      tempOrgList.map(z=>{
        this.orgList.push({
          organizationID: z.organizationID,
          organizationName: z.organizationName
        });
      })
      console.log('cityArray',res);
    }
  });
  this._store.select(selectCityState).subscribe(result => {
    if (result && result.cityList) {
      this.stateList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityService.getCityDropdownOptionList(this.countryList[0].countryID, 'state'));
      this.cityList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityList);
    }
  });
}
getState(){
  return !((this.companyInfo.stateID)?true : false);
}
SaveCompanyData(companyForm:NgForm){
console.log(this.companyInfo);
this.companyInfo.organizationID=3068;
if(this.companyInfo.companyID!=null){
  console.log("edit");
  this.companyService.updateStateOfCell(this.companyInfo);
}else{
  console.log("add");
  this.companyService.saveCompany(this.companyInfo);
}
}

CancelCompanyForm(){
  this.router.navigate(['/master/company']);
  // this.location.back()
}

fillCityDDL() {
  if (this.companyInfo.stateID) {
    this.isCityActive = false;
    return this.cityList = this.cityService.getCityDropdownOptionList(this.companyInfo.stateID, 'city');
  }
  return this.cityList;
}
keyPressNumbers(event){
  AppUtil.validateNumbers(event);
}
keyPressAlphanumeric(event) {
  AppUtil.validateAlphanumeric(event);
}
handleFileInput(event) {
  this.profileToUpload =<File>event.target.files[0];
  this.companyInfo.companyLogoUrl=this.profileToUpload.name;
  let reader = new FileReader();
  reader.onload = (event: any) => {
    this.filePath = event.target.result;
  }
  reader.readAsDataURL(this.profileToUpload);
   this.corecommonServices.fileUpload('Company-Logo',event.target.files[0],this.companyInfo.companyCode).subscribe(res=>{
     if(res){
       console.log(res);
      this.companyInfo.companyLogoID=res.fileGuid;
      this.companyInfo.companyLogoUrl=res.fileUrl;
     }
   });
}


}
