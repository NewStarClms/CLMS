import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contractor, contractorLicenses, NatureOfWork } from 'src/app/store/model/master-data.model';
import {  Store } from '@ngrx/store';
import { ContratorService } from 'src/app/services/contrator.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RemoteService } from 'src/app/common/remote.service';
import { selectCityState, selectContractorState, selectNatureofworkState } from 'src/app/store/app.state';
import { AppUtil } from 'src/app/common/app-util';
import { CityService } from '../../../services/city.service';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { NotificationService } from 'src/app/common/notification.service';
import { AuthService } from 'src/app/services/authentication.service';
import { SecureURLService } from 'src/app/services/secure-url.service';

@Component({
  selector: 'app-add-edit-contractor',
  templateUrl: './add-edit-contractor.component.html',
  styleUrls: ['./add-edit-contractor.component.scss']
})
export class AddEditContractorComponent implements OnInit {
  public rowData: Array<Contractor> = [];
  public contractorInfo: Contractor = {} as Contractor;
  public contractorLicInfo: contractorLicenses = {} as contractorLicenses;
  public natureList: Array<any> = [];
  public countryList: Array<{ countryID: number, countryName: string }> = [];
  public stateList: Array<any> = [];
  public branchstateList:Array<any>=[];
  public cityList: Array<any> = [];
  public isCityActive = true;
  public display = false;
  public displayLic = false;
  public reqcondition:boolean = false;
  datepickerConfig : Partial<BsDatepickerConfig>;
  public filePath: string ="../../../../assets/img/default_image.png";
  profileToUpload: File = null;
 public   isvalityValidDate:any;
 public isworkValidDate :any;
 headerdialogName:string="Add Contractor";
  labelName:string="Save";
  constructor(
    private _store: Store<any>,
    private contractorService: ContratorService,
    private router: Router,
    private remoteService: RemoteService<any>,
    private activateRouter: ActivatedRoute,
    private cityService: CityService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    private corecommonServices:AppCoreCommonService,
    private http : HttpClient,
    private notificationService :NotificationService,
    private authenticationService:AuthService,
    private secureURLService: SecureURLService
  ) {
    this.datepickerConfig = Object.assign({},{ containerClass:'theme-default',
    adaptivePosition:true,
    dateInputFormat:'DD-MMM-YYYY'});
  }
  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.contractorInfo.contractorLicenses = [];
    this.countryList = UI_CONSTANT.COUNTRY;
    this._store.select(selectCityState).subscribe(result => {
      if (result && result.cityList) {
        this.stateList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityService.getCityDropdownOptionList(this.countryList[0].countryID, 'state'));
        this.cityList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityList);
      }
    });
    this._store.select(selectNatureofworkState).subscribe(res => {
      if (res && res.natureofworkList) {
        const tempNatureList: NatureOfWork[] = AppUtil.deepCopy(res.natureofworkList);
        this.natureList.push({natureofWorkID:null,natureofWorkName:'---Please select --'});
        tempNatureList.map(z => {
          this.natureList.push({
            natureofWorkID: z.natureOfWorkID,
            natureofWorkName: z.natureOfWorkName
          });
        });
      }
    });

    if (Number(this.activateRouter.snapshot.params.id) != 0) {
      this.headerdialogName="Update Contractor";
  this.labelName="Update";
      this._store.select(selectContractorState).subscribe(contractor => {
        if (contractor && contractor.contractorList) {
          // console.log(contractor.contractorList);
          const contractortempList: Contractor[] = AppUtil.deepCopy(contractor.contractorList);
          this.contractorInfo = contractortempList.filter(i => i.contractorID === Number(this.activateRouter.snapshot.params.id))[0];
        console.log('checkcon',this.contractorInfo);
        this.contractorInfo.contractorLicenses.forEach(item =>{
           // console.log('checkconlic',item);
            item.validityFromDate = moment(item.validityFromDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
            item.validityToDate = moment(item.validityToDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
            item.workStartDate = moment(item.workStartDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
            item.workEndDate = moment(item.workEndDate, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
        });
         if(this.contractorInfo.contractorLogo !=null){
          this.filePath = this.secureURLService.appendSecurityToken(this.contractorInfo.contractorLogo);
         }else{
           this.filePath = "../../../../assets/img/default_image.png";
         }
          if (this.contractorInfo.stateID) {
            this.fillCityDDL();
          }
        }
      });
    }
  }
  saveContractorLics(){
    // console.log(this.contractorLicInfo);
    this.isvalityValidDate = this.ValidtyvalidateDates(this.contractorLicInfo.validityFromDate, this.contractorLicInfo.validityToDate);
    this.isworkValidDate = this.workvalidateDates(this.contractorLicInfo.workStartDate, this.contractorLicInfo.workEndDate);
    if(this.isvalityValidDate && this.isworkValidDate){
      const index  =  this.contractorInfo.contractorLicenses.findIndex(i => i.licenseNo === this.contractorLicInfo.licenseNo);
            console.log(index)
      if(this.contractorLicInfo.validityFromDate != null){
      this.contractorLicInfo.validityFromDate = moment(this.contractorLicInfo.validityFromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    }
    if(this.contractorLicInfo.validityToDate != null){
      this.contractorLicInfo.validityToDate = moment(this.contractorLicInfo.validityToDate, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    }
    if(this.contractorLicInfo.workEndDate != null){
      this.contractorLicInfo.workEndDate = moment(this.contractorLicInfo.workEndDate, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    }
    if(this.contractorLicInfo.workStartDate != null){
      this.contractorLicInfo.workStartDate = moment(this.contractorLicInfo.workStartDate, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
    }
    console.log(this.contractorLicInfo)
    if(index >=0 ){
      const tempData = AppUtil.deepCopy(this.contractorInfo.contractorLicenses);
      tempData[index] = this.contractorLicInfo;
       console.log(tempData);
      this.contractorInfo.contractorLicenses = tempData;
      console.log(this.contractorInfo.contractorLicenses);

    }else{
      const tempData = AppUtil.deepCopy(this.contractorLicInfo);
      this.contractorInfo.contractorLicenses.push(this.contractorLicInfo);
    }
    this.displayLic = false;
    this.reqcondition = false;
    }
  }
  SaveContractorData(contractorForm: NgForm) {
    this.contractorInfo.contractorLicenses.forEach(item =>{
      // console.log('checkconlic',item.validityFromDate);
      item.validityFromDate = moment(item.validityFromDate, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.LONG_DATE_FORMAT);
      item.validityToDate = moment(item.validityToDate, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.LONG_DATE_FORMAT);
      item.workStartDate = moment(item.workStartDate, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.LONG_DATE_FORMAT);
      item.workEndDate = moment(item.workEndDate, UI_CONSTANT.SHORT_DATE_FORMAT).format(UI_CONSTANT.LONG_DATE_FORMAT);
  });
    if (this.contractorInfo.contractorID != null) {
      // console.log('edit append-', this.contractorInfo);
      this.contractorService.updateStateOfCell(this.contractorInfo, this.contractorLicInfo);
    }
    else {
      this.contractorService.saveContractor(this.contractorInfo, this.contractorLicInfo);
    }

  }
  CancelContractorForm() {
    this.router.navigate(['/master/contractor']);
  }
  onCellClicked(index, action) {
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
        this.displayLic = !this.displayLic;
        // console.log('ddd', this.contractorInfo.contractorLicenses[index],index);
        this.contractorLicInfo = this.contractorInfo.contractorLicenses[index];

      }
      if (action === UI_CONSTANT.ACTIONS.DELETE) {
        this.confirmationService.confirm({
          message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
          header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
          icon: 'pi pi-info-circle',
          accept: () => {
            this.contractorLicInfo = this.contractorInfo.contractorLicenses[index];
           const tempData = AppUtil.deepCopy(this.contractorLicInfo);
            this.contractorInfo.contractorLicenses.splice(index,1);
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
  }
  addNewContractorLic(){
    this.reqcondition = true;
    this.contractorLicInfo = {} as contractorLicenses;
    this.displayLic = !this.displayLic;
  }
 
  fillCityDDL() {
    if (this.contractorInfo.stateID) {
      this.isCityActive = false;
      return this.cityList = this.cityService.getCityDropdownOptionList(this.contractorInfo.stateID, 'city');
    }
    return this.cityList;
  }
  keyPressNumbers(event){
    AppUtil.validateNumbers(event);
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
  keyPressEmailvalidate(event){
    AppUtil.validateEmial(event);
  }
  CancelconLicrmData(){
    this.reqcondition = false;
    this.displayLic = false;
  }
  handleFileInput(event) {
    this.profileToUpload =<File>event.target.files[0];
    this.contractorInfo.contractorLogo=this.profileToUpload.name;
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.filePath = event.target.result;
    }
    reader.readAsDataURL(this.profileToUpload);
     this.corecommonServices.fileUpload('Contractor-Logo',event.target.files[0],this.contractorInfo.contractorCode).subscribe(res=>{
       if(res){
        this.contractorInfo.contractorLogo=res.fileUrl;
        this.contractorInfo.contractorLogoID = res.fileGuid;
       }
     });
}
ValidtyvalidateDates(sDate: string, eDate: string){
  this.isvalityValidDate = true;
  if((sDate == null || eDate ==null)){
    this.notificationService.showError('Validity From Date  & Validity To Date is required', UI_CONSTANT.SEVERITY.SUCCESS);
    this.isvalityValidDate = false;
  }

  if((sDate != null && eDate !=null) && (eDate) < (sDate)){
    this.notificationService.showError('Validity from date should be less than Validity to date.', UI_CONSTANT.SEVERITY.SUCCESS);
    this.isvalityValidDate = false;
  }
  return this.isvalityValidDate;
}
workvalidateDates(sDate: string, eDate: string){
  this.isworkValidDate = true;
  if((sDate == null || eDate ==null)){
    this.notificationService.showError('Work Start Date  & Work End Date is required', UI_CONSTANT.SEVERITY.SUCCESS);
    this.isworkValidDate = false;
  }

  if((sDate != null && eDate !=null) && (eDate) < (sDate)){
    this.notificationService.showError('Work Start date should be less than Work Start date.', UI_CONSTANT.SEVERITY.SUCCESS);
    this.isworkValidDate = false;
  }
  return this.isworkValidDate;
}
}
