import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { FormulaObject } from 'src/app/store/model/pay-component.model';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';

@Component({
  selector: 'app-formula-builder',
  templateUrl: './formula-builder.component.html',
  styleUrls: ['./formula-builder.component.scss']
})
export class FormulaBuilderComponent implements OnInit {

  constructor(
    private cd:ChangeDetectorRef
  ) { }

  @Input() formulaKeys:Array<FormulaObject>;
  @Input() policyID:number;
  @Input() payHeadID:number;
  // updateFormul
  public attendanceTag:Array<FormulaObject>=[];
  public payrollTag:Array<FormulaObject>=[];
  public componentTag:Array<FormulaObject>=[];
  public conditionTag:Array<string>=[];
  public formulaCode:string = '';
  public formulakeyList:Array<FormulaObject>=[];
  readonly UICONSTANT=UI_CONSTANT;
  @Output() updateCode = new EventEmitter<any>();
  ngOnInit(): void {
    console.log('dd',this.policyID);
    this.formulakeyList= AppUtil.deepCopy(this.formulaKeys);
    if(this.formulaKeys && this.policyID){
    this.attendanceTag = this.formulaKeys.filter(x=> x.groupID === 2);
    this.payrollTag = this.formulaKeys.filter(x=> x.groupID === 1 || x.groupID === 3 || x.groupID === 4);
    this.componentTag = this.formulaKeys.filter(x=> x.groupID === 5);
    // this.attendanceTag.map(x=>{
    //   x.keyWordName = '"'+x.keyWordName+'"';
    // });
    // this.payrollTag.map(x=>{
    //   x.keyWordName = '"'+x.keyWordName+'"';
    // });
    // this.componentTag.map(x=>{
    //   x.keyWordName = '"'+x.keyWordName+'"';
    // });
    console.log('formula key',this.formulaKeys,'-',this.attendanceTag);
    }
  }
  ngAfterViewInit() {
    console.log('view');
    // console.log('dd',this.formulaKeys);
    this.cd.detectChanges();
}
  ngOnChange(){
    console.log('fdfddfd');
  }
  updateFormulaCode(code,action){
    if(action){
      code = '"'+code+'"';
    }
    this.formulaCode = this.formulaCode + code;
    console.log(code,'-code',this.formulaCode);
  }
  saveFormulaCode(){
    this.updateCode.emit(this.formulaCode);
  }
  formulaClear(){
    this.formulaCode = null;
  }
  

}
