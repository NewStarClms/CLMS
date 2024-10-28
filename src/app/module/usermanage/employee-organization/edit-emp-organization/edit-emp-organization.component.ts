import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeOUService } from 'src/app/services/employee-ou.service';
import { EmployeeOUMapping, EmployeeUserGroup, UserOUMapping } from 'src/app/store/model/usermanage.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-edit-emp-organization',
  templateUrl: './edit-emp-organization.component.html',
  styleUrls: ['./edit-emp-organization.component.scss']
})
export class EditEmpOrganizationComponent implements OnInit {

  employee : EmployeeUserGroup;
  employeeOUMapping: EmployeeOUMapping;
  public dropdownSettings:IDropdownSettings={};

  constructor(private employeeOUService: EmployeeOUService,
    private activatedRoute:ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'organizationValue',
      textField: 'organizationName',
      itemsShowLimit: 4,
      allowSearchFilter: false,
      defaultOpen: true,
      enableCheckAll:false,
      maxHeight:100
    }
    this.employeeOUService.getCurrentEditedEmp().subscribe(emp=>{
        this.employee =emp;
    });
    if(this.employee){
      this.employeeOUService.fetchEmployeeOU(this.employee.employeeID).subscribe(empOU =>{
           
           if(empOU && empOU.employeeID>0){
              this.employeeOUMapping = empOU; 
           }
      });
    }
    else{
      this.goBack();
    }

  }
  goBack(){
    this.router.navigate(['/usermanage/employee-ou/']);
  }

  submitRequest(){
     if(this.employeeOUMapping && this.employeeOUMapping.employeeID == this.employee.employeeID){
        this.employeeOUService.upsertEmployeeOU(this.employeeOUMapping);
        this.goBack();
     }
  }

  selectUnSelectAll(chb, orgName){
      this.employeeOUMapping.userOUMappings.filter(m=>m.organizationName==orgName)[0].mappedValues.map((e=>
        e.selected =chb.checked));
  }

  bindLabel(items){
     return items.some(val=>!val.selected)?"Select All": 'Unselect All';
  }
}
