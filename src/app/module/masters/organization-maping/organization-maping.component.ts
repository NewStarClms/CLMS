import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { organizationMapping } from 'src/app/store/model/master-data.model';
import { AppCoreCommonService } from '../../../services/app.core-common.services';
import { OrganisationMappingService } from '../../../services/organisation-mapping.service';
import { AppUtil } from '../../../common/app-util';

@Component({
  selector: 'app-organization-maping',
  templateUrl: './organization-maping.component.html',
  styleUrls: ['./organization-maping.component.scss']
})
export class OrganizationMapingComponent implements OnInit {

  public orgnaizationMappingInfo: organizationMapping = {} as organizationMapping;
  public orgUnitList = UI_CONSTANT.ORGANIZATIONLIST;
  public locationList = UI_CONSTANT.LOCATIONLIST;
  public displayOUMap: boolean = false;
  public selectedLocation: Array<number>;
  public LocationDataList: Array<{ key: string, value: number }> = [];
  public orgDataUnitList: Array<any> = [];
  public selectedOrganiztion: any;
  @Input() policyID:number;
  @Input() requestPath:any;
  @Output() closeDialog:EventEmitter<boolean>=new EventEmitter<boolean>(false);
  @Output() refreshPage=new EventEmitter<any>();
  constructor(
    private appCoreCommonService: AppCoreCommonService,
    private organisationMappingService:OrganisationMappingService
  ) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    this.organisationMappingService.fetchMappedOUData(this.policyID,this.requestPath.GET).subscribe(res => {
      if(res){
        this.orgnaizationMappingInfo = AppUtil.deepCopy(res.mapping);
        this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(res.mapping.organizationKeyID);
        this.LocationDataList = this.appCoreCommonService.preparelocationDataByOU(res.mapping.locationKeyID);
        this.selectedLocation = res.mapping.location;
        this.selectedOrganiztion= res.mapping.organization;
      }
    });
            // this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(res.mapping.organizationKeyID);
            // this.LocationDataList = this.appCoreCommonService.preparelocationDataByOU(res.mapping.locationKeyID);
            // this.selectedLocation = this.orgnaizationMappingInfo .mapping.location;
            // this.selectedOrganiztion= res.mapping.organization;
  }


  prepareOrgListByOU(params) {
    console.log(params);
    this.selectedOrganiztion = [];
    this.orgDataUnitList = this.appCoreCommonService.prepareOrgListByOU(params);
  }
  preparelocationDataByOU(params) {
  this.selectedLocation = [];
  this.LocationDataList = this.appCoreCommonService.preparelocationDataByOU(params);
}
  // CancelOrgnaizationMapping() {
  //   this.orgnaizationMappingInfo = {} as organizationMapping;
  // }
  SaveOrgnaizationMapping() {
    console.log('first mapping',this.orgnaizationMappingInfo);
    this.orgnaizationMappingInfo.policyTypeID = 1;
    this.orgnaizationMappingInfo.workFlowID = 0;
    this.orgnaizationMappingInfo.organization = ((this.selectedOrganiztion.map(x => x).join('~')).split('~')).map(i => Number(i));
    if(this.selectedLocation != null){
      this.orgnaizationMappingInfo.location = ((this.selectedLocation.map(x => x).join('~')).split('~')).map(i => Number(i));
    }
    
    // console.log(this.orgnaizationMappingInfo)
    this.organisationMappingService.SaveOrgnaizationMapping(this.orgnaizationMappingInfo,this.requestPath.UPDATE);
    this.refreshPage.emit();
    this.CancelOrgnaizationMapping();
  }

  CancelOrgnaizationMapping(){
    this.closeDialog.emit(true);
}

}
