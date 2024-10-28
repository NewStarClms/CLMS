import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent implements OnInit {

  constructor() { }
  public moduleID:number;
  ngOnInit(): void {
    this.moduleID = 1;
  }

}
