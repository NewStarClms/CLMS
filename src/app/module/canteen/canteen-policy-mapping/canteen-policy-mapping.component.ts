import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { CanteenPolicyService } from 'src/app/services/canteen-policy.service';
import { selectItemMasterState } from 'src/app/store/canteen.app.state';
import { CanteenPolicyModel, mapping } from 'src/app/store/model/canteen.model';

@Component({
  selector: 'app-canteen-policy-mapping',
  templateUrl: './canteen-policy-mapping.component.html',
  styleUrls: ['./canteen-policy-mapping.component.scss']
})
export class CanteenPolicyMappingComponent implements OnInit {
  public canteenPolicyModelInfo:CanteenPolicyModel= {} as CanteenPolicyModel;
  @Input() policyCanteenID:number;
  public allDisabledField:boolean=false;
  public allDisabledFieldCheck:boolean=false;
  public  policyCanteenid:number;
  public selectedItemMaster: Array<mapping>=[];
  public canteenrowData: Array<mapping>= [];
  public holidaysListUI:Array<mapping>=[];
  public holidayListCol: any[] = [];

  constructor(
    private canteenPolicyService: CanteenPolicyService,
    private activatedRoute:ActivatedRoute,
    private _store:Store
  ) { }

  ngOnInit(): void {
    console.log(this.policyCanteenID);
    if(this.policyCanteenID==0 || this.policyCanteenID==undefined){
      this.policyCanteenid= this.activatedRoute.snapshot.params.id;
     this.allDisabledField=false;
    }else{
      this.policyCanteenid = this.policyCanteenID;
      this.allDisabledField=true;
      
    }

    this.holidayListCol = [
      { field: 'itemCode', header: 'Item Code',text:true },
      {field: 'itemName', header: 'Item Name',text:true },
      { field: 'itemType', header: 'itemType',text:true },
      { field: 'description', header: 'description',text:true },
      {field: 'startTime', header: 'startTime',text:true },
      { field: 'endTime', header: 'endTime',text:true },
      { field: 'itemRate', header: 'itemRate',text:true },
      {field: 'itemRateAfterSubsidy', header: 'itemRateAfterSubsidy',text:true },
      { field: 'employeeContribution', header: 'employeeContribution',text:true },
      {field: 'employerContribution', header: 'employerContribution',text:true },
      { field: 'subsidizedQuantity', header: 'subsidizedQuantity',text:true },
      { field: 'selected', header: 'Selected',checkbox:true },
  ];
   this.getHolidayData();
  }
  getHolidayData(){
    let  policyID =this.policyCanteenid
    this.canteenPolicyService.fetchAttendancePolicyMasterDetails(this.policyCanteenid).subscribe(res=>{
      if(res && res.mappings){
        this.canteenPolicyModelInfo= AppUtil.deepCopy(res);
        this.canteenrowData= AppUtil.deepCopy(res.mappings);
        this.selectedItemMaster =this.canteenrowData.filter((val) =>val.selected==true);
          this.holidaysListUI= this.selectedItemMaster;
      }
    });
  }




}
