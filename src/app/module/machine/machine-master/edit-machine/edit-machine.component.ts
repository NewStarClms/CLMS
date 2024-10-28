import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MachineService } from 'src/app/services/machine.service';
import { selectBranchState } from 'src/app/store/app.state';
import { MachineMaster } from 'src/app/store/model/machineMaster.model';

@Component({
  selector: 'app-edit-machine',
  templateUrl: './edit-machine.component.html',
  styleUrls: ['./edit-machine.component.scss']
})
export class EditMachineComponent implements OnInit {
  machine : MachineMaster={} as MachineMaster;
  machineModels: Array<any>;
  machineTypes: Array<any>;
  connectivityTypes: Array<any>;
  networkModeTypes: Array<any>;
  fingerTypes: Array<any>;
  machinePositions: Array<any>;
  branchList: Array<any>;
  labelName: string;
  datepickerConfig: Partial<BsDatepickerConfig>;
  isUpdateMode: boolean = false;
  constructor(private router: Router,
    private activateRouter: ActivatedRoute, 
    private machineService: MachineService,
    private datePipe: DatePipe,
    private _store: Store<any>) {
   }

  ngOnInit(): void {
    debugger;
    this.bindDropdowns();
    var machineID=this.activateRouter.snapshot.params.id;
    if(machineID>0){
      this.labelName="Update";
      this.isUpdateMode=true;
      this.machineService.getByID(machineID).subscribe(response=>{
        if (response && response.machine) {
            this.machine = response.machine;
        }
      });
    }
    else{
      //add new form
      this.labelName="Create";
      this.isUpdateMode=false;
    }
  }
  
  submitMachineData(machineForm:NgForm){
    if(this.machine.machineID>0){
      this.machineService.updateMachine(this.machine);
    }else{
      this.machineService.createMachine(this.machine);
    }
   
  }

  goBack(){
    this.router.navigate(['/machine']);
  }

  bindDropdowns(){
    this._store.select(selectBranchState).subscribe(res =>{
      if(res && res.branchList){
        this.branchList = [{branchCode: '-Select Branch-', branchID: 0}];
         res.branchList.map(item=>{
           this.branchList.push({
              branchCode: item.branchName +'('+item.branchCode+')',
              branchID: item.branchID
           })
         });

      }
    });
    this.machineService.getMachineModels().subscribe(response=>{
      if (response && response.machineModels) {
          this.machineModels = response.machineModels;
      }
    });
    this.machineService.getMachineTypes().subscribe(response=>{
      if (response && response.machineTypes) {
          this.machineTypes = response.machineTypes;
      }
    });
    this.machineService.getMachineConnType().subscribe(response=>{
      if (response && response.connectivityTypes) {
          this.connectivityTypes = response.connectivityTypes;
      }
    });
    this.machineService.getNetworkModes().subscribe(response=>{
      if (response && response.networkTypeModes) {
          this.networkModeTypes = response.networkTypeModes;
      }
    });
    //TODO: Check this option
    this.machinePositions=[{machinePositionText:"IN",machinePositionValue:"I"},
    {machinePositionText:"OUT",machinePositionValue:"O"}];
    this.fingerTypes=[{fingerTypeText:"Z",fingerTypeValue:"Z"}];
  }
}
