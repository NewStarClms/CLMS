import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss']
})
export class VisitorComponent implements OnInit {
  public columnDefs!: any[][];
  public rowData: Array<any>= [];
  public isCityActive = true;
  public isEditable = false;
  public display = false;

  constructor() { }

  ngOnInit(): void {
    this.columnDefs = [];
    this.rowData = [];
  }


  onCellClicked(event){
    console.log(event);
  }
}
