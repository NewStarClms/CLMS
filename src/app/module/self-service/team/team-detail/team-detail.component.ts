import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';
import { TeamDetailService } from 'src/app/services/team-detail.service';
import { TeamDetail } from 'src/app/store/model/team-detail.model';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit {

  public columnDefs!: any[];
  public rowData: Array<TeamDetail>= [];

  constructor(private teamDetailService : TeamDetailService,
    private authenticationService:AuthService,
    private _store:Store<any>) { }

  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(false);
    this.columnDefs = this.teamDetailService.prepareColumnForTeamDetailGrid();
    this.teamDetailService.fetchTeamDetailData().subscribe(res=>{
      if(res && res){
        this.rowData=[];
        this.rowData=AppUtil.deepCopy(res);
        //console.log(this.rowData);
      }
    });
  }
 
  onCellClicked(params){
    
    if (params.column.colId === UI_CONSTANT.ACTIONS.ACTION && params.event.path[1].dataset.action) {
      let action = params.event.path[1].dataset.action;
  
      if (action === UI_CONSTANT.ACTIONS.EDIT) {
       
      }
    }
  }
 
}
