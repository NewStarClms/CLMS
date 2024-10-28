import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { _ } from 'ag-grid-community';
import { VisitorAdminService } from 'src/app/services/visitor-admin.service';
import { VisitorPassTemplateService } from 'src/app/services/visitor-pass-template.service';
import { VisitorAdmin } from 'src/app/store/model/visitorAdmin.model';

@Component({
  selector: 'app-gate-pass-template',
  templateUrl: './gate-pass-template.component.html',
  styleUrls: ['./gate-pass-template.component.scss']
})
export class GatePassTemplateComponent implements OnInit {
 public gatepassTemplate:SafeHtml;
  public visitorAdminInfo : VisitorAdmin= {} as VisitorAdmin;
  constructor(private visitorpassService:VisitorPassTemplateService,
    private activateRouter: ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private visitorAdminService:VisitorAdminService) { }

  ngOnInit(): void {
    // this.visitorAdminService.fetchVisitorPassDetail(this.activateRouter.snapshot.params.visitorID).subscribe(response=>{
    //   if(response){
    //     this.visitorAdminInfo=response;
    //     console.log(this.visitorAdminInfo);
    //   }
    // });
    // this.visitorpassService.fetchVisitorPassTemplateDetail(this.activateRouter.snapshot.params.gatepassID).subscribe(res=>{
    //   if(res){
    //     let visitorName;
    //     let visitorCode;
    //     let visitorContactNo;
    //     let visitoremployeeDetail;
    //     let visitorCompany;
    //     let visitorIntime;
    //     let visitorOuttime;
    //     let visitorimage;
    //     if(this.visitorAdminInfo.visitorName!=null){
    //       visitorName=this.visitorAdminInfo.visitorName;
    //     }else{
    //       visitorName="";
    //     }
    //     if(this.visitorAdminInfo.visitorCode!=null){
    //       visitorCode=this.visitorAdminInfo.visitorCode;
    //     }else{
    //       visitorCode="";
    //     }
    //     if(this.visitorAdminInfo.contactNumber!=null){
    //       visitorContactNo=this.visitorAdminInfo.contactNumber;
    //     }else{
    //       visitorContactNo="";
    //     }
    //     if(this.visitorAdminInfo.companyName!=null){
    //       visitorCompany=this.visitorAdminInfo.companyName;
    //     }else{
    //       visitorCompany="";
    //     }
    //     if(this.visitorAdminInfo.employeeDetail!=null){
    //       visitoremployeeDetail=this.visitorAdminInfo.employeeDetail;
    //     }else{
    //       visitoremployeeDetail="";
    //     }
    //     if(this.visitorAdminInfo.expectedIn!=null){
    //       visitorIntime=this.visitorAdminInfo.expectedIn;
    //     }else{
    //       visitorIntime="";
    //     }
    //     if(this.visitorAdminInfo.expectedIn!=null){
    //       visitorOuttime=this.visitorAdminInfo.expectedIn;
    //     }else{
    //       visitorOuttime="";
    //     }
    //     if(this.visitorAdminInfo.profileImagePath!=null){
    //       visitorimage=this.visitorAdminInfo.profileImagePath;
    //     }else{
    //       visitorimage="";
    //     }
    //    this.gatepassTemplate=this._sanitizer.bypassSecurityTrustHtml(
    //      res.template.replace("[VISITOR_NAME]",visitorName).
    //      replace("[VISITOR_CODE]",visitorCode).replace("[VISITOR_MOBILE_NO]",visitorContactNo)
    //      .replace("[VISITOR_COMPANY]",visitorCompany).
    //      replace("[EMPLOYEE_DETAIL]",visitoremployeeDetail).
    //      replace("[IN_TIME]",visitorIntime).
    //      replace("[OUT_TIME]",visitorOuttime).
    //      replace("[VISITOR_IMAGE]",visitorimage)
    //      );
    //   }
    //  });
     
     
  }

}
