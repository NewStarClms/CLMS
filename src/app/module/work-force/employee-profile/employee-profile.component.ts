import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeProfile } from 'src/app/store/model/employee.model';
import { ChangePasswordServiceService } from '../../../services/change-password-service.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {

  public employeeDetail: EmployeeProfile = {} as EmployeeProfile;
  readonly defaultFilePath = "../../../../assets/img/boy.png";
  public filePath:string = this.defaultFilePath;
  changePassword: boolean = false;
  
  constructor(
    private employeeService:EmployeeService,
    private changePasswordService: ChangePasswordServiceService) { 
   
  }

  ngOnInit(): void {
    this.employeeService.fetchEmployeeUserDetail().subscribe(res=>{
      if(res){
        this.employeeDetail = res;
        this.changePasswordService.setVisibility(this.employeeDetail.passwordChangeRequired);
        if(this.employeeDetail.profileImagePath != null){
          this.filePath = this.employeeDetail.profileImagePath;
        }else{
          this.filePath = this.defaultFilePath;
        }
        
      }
    });
    this.changePasswordService.getVisiblity().subscribe(res =>{
      this.changePassword = res;
    });
  }
}
