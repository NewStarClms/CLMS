import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { RemoteService } from 'src/app/common/remote.service';
import { AppCoreCommonService } from 'src/app/services/app.core-common.services';
import { CityService } from 'src/app/services/city.service';
import { VisitorAdminService } from 'src/app/services/visitor-admin.service';
import * as moment from 'moment';
import { selectCityState, selectDocumentTypeState, selectEmployeeMasterState, selectEmployeeState, selectGateState, selectItemTypeState, selectVisitorAreaState, selectVisitorPurposeState, selectVisitorTypeState } from 'src/app/store/app.state';
import { Employee, EmployeeMaster } from 'src/app/store/model/employee.model';
import { DocumentTypes, Gate, ItemTypes, VisitorAreas, VisitorType, VisitPurpose } from 'src/app/store/model/master-data.model';
import {  VisitorInOut, VisitorItem } from 'src/app/store/model/visitorAdmin.model';
import { WebcamInitError,WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Observable,  Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-edit-visitor-admin',
  templateUrl: './edit-visitor-admin.component.html',
  styleUrls: ['./edit-visitor-admin.component.scss']
})
export class EditVisitorAdminComponent implements OnInit {
  public rowData: Array<VisitorInOut> = [];
  public visitorInOutInfo: VisitorInOut = {} as VisitorInOut;
  public visitorItemInfo: VisitorItem = {} as VisitorItem;
  public countryList: Array<{ countryID: number, countryName: string }> = [];
  public stateList: Array<any> = [];
  public cityList: Array<any> = [];
  public isCityActive = true;
  public genderList:Array<any>=[];
  public visitTypeList:Array<any>=[];
  public visitpurposeList:Array<any>=[];
  public visitorpriorityList=UI_CONSTANT.VISITOR_PRIORITY;
  public gateList:Array<any>=[];
  public docList:Array<any>=[];
  datepickerConfig : Partial<BsDatepickerConfig>;
  public profilefilePath: string ="../../../../assets/img/default_image.png";
  public idprooffilePath:string="../../../../assets/img/doc_image.jpg";
  public itemtyeList:Array<any>=[];
  profileToUpload: any;
  idprooffileUpload:any;
  displayitem:boolean= false;
  actualOuttime: string;
  actualOutDate:string;
  actualIntime:string;
  actualInDate:string;
  expIntime:string;
  expOuttime:string;
  expInDate:string;
  expOutDate:string;
  reqIncondition:boolean=false;
  requiredInSign:string;
  reqOutcondition:boolean=false;
  requiredOutSign:string;
  base64TrimmedURL: string;
  base64DefaultURL: string;
  generatedImage: string;
  windowOPen: boolean;
  divcheckInByDetail:boolean=false;
  divcheckOutByDetail:boolean=false;
  public visitorstatusList=UI_CONSTANT.STATUSLIST
  public visitorareaList:Array<any>=[];
  public vehicalTypeList = UI_CONSTANT.VEHICAL_TYPE;
  public itemScopeList=UI_CONSTANT.ITEM_SCOPE;
  public openTakeAphoto:boolean=false;
  public openTakeAIdProofphoto:boolean=false;
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public empList:Array<any>=[];
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;
  public seconds:number ;
   private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  constructor(
    private _store: Store<any>,
    private visitorAdminService: VisitorAdminService,
    private router: Router,
    private remoteService: RemoteService<any>,
    private activateRouter: ActivatedRoute,
    private cityService: CityService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    private corecommonServices:AppCoreCommonService,
    private domSanitizer: DomSanitizer,
  ) {
    this.datepickerConfig = Object.assign({},{ containerClass:'theme-default',
    adaptivePosition:true,
    dateInputFormat:'DD-MMM-YYYY'});
  }
  ngOnInit(): void {
    this.openTakeAIdProofphoto=false;
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
    this._store.select(selectEmployeeMasterState).subscribe(response=>
      {
        if (response && response.employeeMasterList) {
         const tempgenderList: EmployeeMaster[] = AppUtil.deepCopy(response.employeeMasterList.gender);
         this.genderList = tempgenderList;
        }
      });
      this._store.select(selectDocumentTypeState).subscribe(response=>
        {
          if (response && response.documentTypeList) {
            const tempdocumentTypeList: DocumentTypes[] = AppUtil.deepCopy(response.documentTypeList.filter(i => i.documentCategoryID === 1));
            tempdocumentTypeList.map(y => {
              this.docList.push({
               docID: y.documentTypeID,
               docName: y.documentTypeName
              });
            });
          }
        });
      this._store.select(selectVisitorTypeState).subscribe(response=>
        {
          if (response && response.visitorTypeList) {
           const tempvisitorTypeList: VisitorType[] = AppUtil.deepCopy(response.visitorTypeList);
           tempvisitorTypeList.map(y => {
             this.visitTypeList.push({
              visitorTypeID: y.visitorTypeID,
              visitorTypeName: y.visitorTypeName
             });
           });
          }
        });
        this._store.select(selectItemTypeState).subscribe(response=>
        {
          if (response && response.itemTypesList) {

           const tempitemTypeList: ItemTypes[] = AppUtil.deepCopy(response.itemTypesList);
           tempitemTypeList.map(y => {
             this.itemtyeList.push({
              itemtypeID: y.itemTypeID,
              itemtypeName: y.itemTypeName
             });
           });
          }
        });
        this._store.select(selectVisitorAreaState).subscribe(response=>
          {
            if (response && response.visitorAreasList) {

             const tempvisitorAreaList: VisitorAreas[] = AppUtil.deepCopy(response.visitorAreasList);
             tempvisitorAreaList.map(y => {
               this.visitorareaList.push({
                areaID: y.visitorAreaID,
                areaName: y.visitorAreaName
               });
             });
            }
          });
        this._store.select(selectVisitorPurposeState).subscribe(response=>
          {
            if (response && response.visitorPurposeList) {

             const tempvisitpurposeList: VisitPurpose[] = AppUtil.deepCopy(response.visitorPurposeList);
             tempvisitpurposeList.map(y => {
               this.visitpurposeList.push({
                visitPurposeID: y.visitPurposeID,
                visitPurposeName: y.visitPurposeName
               });
             });
            }
          });
            this._store.select(selectGateState).subscribe(response=>
              {
                if (response && response.gateList) {

                 const tempgateList: Gate[] = AppUtil.deepCopy(response.gateList);
                 tempgateList.map(y => {
                   this.gateList.push({
                    gateID: y.gateID,
                    gateName: y.gateName
                   });
                 });
                }
              });
    this.visitorInOutInfo.items = [];
    this.countryList = UI_CONSTANT.COUNTRY;
    this._store.select(selectCityState).subscribe(result => {
      if (result && result.cityList) {
        this.stateList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityService.getCityDropdownOptionList(this.countryList[0].countryID, 'state'));
        this.cityList = UI_CONSTANT.PLEASE_SELECT.concat(this.cityList);
        if(Number(this.activateRouter.snapshot.params.id && this.activateRouter.snapshot.params.idd) != 0){
          this.visitorAdminService.fetchVisitDetailData(this.activateRouter.snapshot.params.id,this.activateRouter.snapshot.params.idd).subscribe(res=>{
           if(res && res.visitor.visitorCode){
             
            this.visitorInOutInfo = AppUtil.deepCopy(res);
          //  console.log(this.visitorInOutInfo)
            if(this.visitorInOutInfo.actualIn != null){
              this.actualInDate=moment(this.visitorInOutInfo.actualIn, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              this.actualIntime= moment(this.visitorInOutInfo.actualIn,UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
            }
            if(this.visitorInOutInfo.actualOut != null){
              this.actualOutDate=moment(this.visitorInOutInfo.actualOut, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              this.actualOuttime= moment(this.visitorInOutInfo.actualOut,UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
            }
            if(this.visitorInOutInfo.expectedIn != null){
              this.expInDate=moment(this.visitorInOutInfo.expectedIn, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              this.expIntime= moment(this.visitorInOutInfo.expectedIn,UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
            }
            if(this.visitorInOutInfo.expectedOut != null){
              
              this.expOutDate=moment(this.visitorInOutInfo.expectedOut, UI_CONSTANT.LONG_DATE_FORMAT).format(UI_CONSTANT.SHORT_DATE_FORMAT);
              this.expOuttime= moment(this.visitorInOutInfo.expectedOut,UI_CONSTANT.LONG_DATE_FORMAT).format("HH:mm");
            }
           
            
          this.profilefilePath= this.visitorInOutInfo.visitor.profileImagePath;
              this.idprooffilePath=this.visitorInOutInfo.visitor.idProofImagePath;
              this.fngetvisitorstatus(this.visitorInOutInfo.visitStatusID);
            if (this.visitorInOutInfo.visitor.stateID !=null) {
              this.fillCityDDL();
            }
           }
            
          });
        }
      }
    }); 

  }
  saveitems(){
     const index  =  this.visitorInOutInfo.items.findIndex(i => i.brandName === this.visitorItemInfo.brandName);
  console.log(index)
     if(index >=0){
     const tempData = AppUtil.deepCopy(this.visitorInOutInfo.items);
     console.log(tempData);

     tempData[index] = this.visitorItemInfo;
     console.log(tempData[index]);
     this.visitorInOutInfo.items = tempData;
     console.log(this.visitorInOutInfo.items);

   }else{
     const tempData = AppUtil.deepCopy(this.visitorItemInfo);
     this.visitorInOutInfo.items.push(this.visitorItemInfo);
   }
   this.displayitem = false;
  }
  SaveVisitorDetailData() {
    if (this.visitorInOutInfo.visitor.visitorID != null) {
      let temvisitorInOutInfo = AppUtil.deepCopy(this.visitorInOutInfo);
    if(temvisitorInOutInfo.visitor.blacklistDate !=null){
      this.visitorInOutInfo.visitor.blacklistDate = moment(temvisitorInOutInfo.visitor.blacklistDate, UI_CONSTANT.SHORT_DATE_FORMAT).format("YYYY-MM-DDTHH:mm:ss");
     }
      console.log('edit append-', this.visitorInOutInfo);
      this.visitorAdminService.updateVisitorInOUT(this.visitorInOutInfo);
    } 
  }
  CancelVisitorDetailForm() {
    this.router.navigate(['/gate-user/visitor-request']);
  }
  onCellClicked(index, action) {
    if (action === UI_CONSTANT.ACTIONS.EDIT) {
      this.displayitem = !this.displayitem;
      console.log('ddd', this.visitorInOutInfo.items[index],index);
      this.visitorItemInfo = this.visitorInOutInfo.items[index];

    }
    if (action === UI_CONSTANT.ACTIONS.DELETE) {
      this.confirmationService.confirm({
        message: UI_CONSTANT.MESSAGE_TEXT.DELECT_CONFIRM_TEXT,
        header: UI_CONSTANT.ACTIONS.DELETE.toUpperCase(),
        icon: 'pi pi-info-circle',
        accept: () => {
          this.visitorItemInfo = this.visitorInOutInfo.items[index];
         const tempData = AppUtil.deepCopy(this.visitorItemInfo);
          this.visitorInOutInfo.items.splice(index,1);
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
  addNewItem(){
    this.visitorItemInfo = {} as VisitorItem;
    this.displayitem = !this.displayitem;
  }

  
  keyPressNumeric(event){
    AppUtil.validateNumbers(event);
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }
  keyPressEmailvalidate(event){
    AppUtil.validateEmial(event);
  }
  CancelItemsData(){
    this.displayitem = false;
  }
  handleFileInput(event, imageType:string) {
    const date_name= new Date();
    const filename = date_name.getTime();
    let folderName = null;
    if(imageType === 'profile'){
      this.profileToUpload = event.target.files[0];
      this.visitorInOutInfo.visitor.profileImagePath=this.profileToUpload.filename;
        //Show image preview
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.profilefilePath = event.target.result;
          //console.log('filePath',this.filePath);
        }
        reader.readAsDataURL(this.profileToUpload);
        folderName = 'Visitor-Profile';
    } else if(imageType === 'idProof'){
      this.idprooffileUpload = event.target.files[0];
      this.visitorInOutInfo.visitor.idProofImagePath=this.idprooffileUpload.filename;
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.idprooffilePath = event.target.result;
          //console.log('filePath',this.filePath);
        }
        reader.readAsDataURL(this.idprooffileUpload);
        folderName = 'Visitor-IdProof';
    }
    
   this.corecommonServices.fileUpload(folderName,event.target.files[0],filename).subscribe(res=>{
      if(res){
        if(folderName === 'Visitor-Profile'){
          this.visitorInOutInfo.visitor.profileImagePath=res.fileUrl;
          this.visitorInOutInfo.visitor.profileImagePathID=res.fileGuid;
         // console.log(folderName,this.visitorInOutInfo.visitor.profileImagePath);
        }else if(folderName === 'Visitor-IdProof'){
          this.visitorInOutInfo.visitor.idProofImagePath=res.fileUrl;
          this.visitorInOutInfo.visitor.idProofImagePathID=res.fileGuid;
         // console.log(folderName,this.visitorInOutInfo.visitor.idProofImagePath);
        }
      }
    });
  }

getExpInTime(event){
  this.expIntime = moment(event).format("HH:mm");
    this.visitorInOutInfo.expectedIn = moment(this.expInDate).format('yyyy-MM-DD')+'T'+moment(event).format("HH:mm:ss");
}
getExpOutTime(event){
  this.expOuttime = moment(event).format("HH:mm");
    this.visitorInOutInfo.expectedOut = moment(this.expOutDate).format('yyyy-MM-DD')+'T'+moment(event).format("HH:mm:ss");
}
getactualInTime(event){
  this.actualIntime = moment(event).format("HH:mm");
    this.visitorInOutInfo.actualIn = moment(this.actualInDate).format('yyyy-MM-DD')+'T'+moment(event).format("HH:mm:ss");
}
getactualOutTime(event){
  this.actualOuttime = moment(event).format("HH:mm");
    this.visitorInOutInfo.actualOut = moment(this.actualOutDate).format('yyyy-MM-DD')+'T'+moment(event).format("HH:mm:ss");
}
getState(){
  return !((this.visitorInOutInfo.visitor.stateID)?true : false);
}
fillCityDDL() {
  if (this.visitorInOutInfo.visitor.stateID) {
    this.isCityActive = false;
    return this.cityList = this.cityService.getCityDropdownOptionList(this.visitorInOutInfo.visitor.stateID, 'city');
  }
  return this.cityList;
}
public handleInitError(event): void {
  console.log(event,'webcam error');
  this.errors.push(event);
}
public showNextWebcam(directionOrDeviceId: boolean|string): void {
  // true => move forward through devices
  // false => move backwards through devices
  // string => move to device with given deviceId
  this.nextWebcam.next(directionOrDeviceId);
}
public cameraWasSwitched(deviceId: string): void {
  console.log('active device: ' + deviceId);
  this.deviceId = deviceId;
}
public get nextWebcamObservable(): Observable<boolean|string> {
  return this.nextWebcam.asObservable();
}
fnOpenCameraPhoto(){
  this.openTakeAphoto=true;
  WebcamUtil.getAvailableVideoInputs()
  .then((mediaDevices: MediaDeviceInfo[]) => {
    this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
  });
}
public triggerSnapshot(): void {
  this.seconds = 3;
  setTimeout(()=>{
    this.seconds = 2;
   setTimeout(()=>{
     this.seconds = 1
     setTimeout(()=>{
       this.trigger.next(); 
       this.seconds = null;
     },2000)
   },2000) 
  },2000);
}
public handleImage(webcamImage: WebcamImage,imagrType): void {
  const date_name= new Date();
  const filename = date_name.getTime();
  let folderName = 'Visitor-Profile';
  let signatureFolderName = 'Visitor-Idproof';
  this.webcamImage = webcamImage;
  this.openTakeAphoto=false;
  this.openTakeAIdProofphoto=false;
  let imageFile: File;
  this.corecommonServices.dataURItoBlob(webcamImage.imageAsBase64).subscribe((blob: Blob) => {
    const imageBlob: Blob = blob;
    const imageName: string = this.generateName();
    imageFile   = new File([imageBlob], imageName, {
      type: 'image/jpeg',
    });
  });
  if(imagrType=='idProofImage'){
    this.idprooffilePath = webcamImage.imageAsDataUrl; 
    this.corecommonServices.fileUpload(signatureFolderName,imageFile,filename).subscribe(res=>{
      if(res){
       this.visitorInOutInfo.visitor.idProofImagePath=res.fileUrl;
       this.visitorInOutInfo.visitor.idProofImagePathID=res.fileGuid;
       //console.log(res)
      }
    });
  }else if(imagrType == 'profileImage'){
    this.profilefilePath = webcamImage.imageAsDataUrl; 
    this.corecommonServices.fileUpload(folderName,imageFile,filename).subscribe(res=>{
      if(res){
       this.visitorInOutInfo.visitor.profileImagePath=res.fileUrl;
       this.visitorInOutInfo.visitor.profileImagePathID=res.fileGuid;
       //console.log(res)
      }
    });
  }
  // console.info("received webcam image", webcamImage);
 
  
}
public get triggerObservable(): Observable<void> {
  return this.trigger.asObservable();
}
fngetvisitorstatus(id){
  if(id===9){
    this.divcheckInByDetail=true;
    this.divcheckOutByDetail=false;
    this.requiredInSign="*";
    this.reqIncondition=true;
    this.requiredOutSign="";
    this.reqOutcondition=false;
  }else if(id===10){
    this.divcheckInByDetail=false;
    this.divcheckOutByDetail=true;
    this.requiredInSign="";
    this.reqIncondition=false;
    this.requiredOutSign="*";
    this.reqOutcondition=true;
  }else{
    this.divcheckInByDetail=false;
    this.divcheckOutByDetail=false;
    this.requiredInSign="";
    this.reqIncondition=false;
    this.requiredOutSign="";
    this.reqOutcondition=false;
  }
}
generateName(): string {
  const date: number = new Date().valueOf();
  let text: string = '';
  const possibleText: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) {
    text += possibleText.charAt(
      Math.floor(Math.random() * possibleText.length)
    );
  }
  // Replace extension according to your media type like this
  return date + '_' + text + '.jpeg';
}

}
