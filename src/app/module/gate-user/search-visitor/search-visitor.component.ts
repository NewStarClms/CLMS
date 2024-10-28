import { Component, EventEmitter, OnInit,  Output,  SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';

@Component({
  selector: 'app-search-visitor',
  templateUrl: './search-visitor.component.html',
  styleUrls: ['./search-visitor.component.scss']
})
export class SearchVisitorComponent implements OnInit {
  loading = [false, false, false, false]
  filteredList: any[];
  visitorSerchList:any[];
  searchedvisitor:{key:string, value:string};
  @Output() onSearchEvent = new EventEmitter<any>();
  constructor(
    private router: Router,
    private _store: Store<any>,
    private appSearchService: AppSearchCommonService

  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    const filteredData = AppUtil.deepCopy(changes.gridRowData.currentValue);
    console.log(filteredData,'filteredData');

  }
  searchvisitorData(event) {
    this.appSearchService.getFilteredVisitor(event.query).subscribe(data => {
      if(data && data.searchData){
      this.visitorSerchList = data.searchData;
      }
    });
  }
  loadDetails(index) {
    //console.log('event',this.searchedvisitor);
   
    let params:any ={
      data : this.searchedvisitor.value,
      column: this.searchedvisitor.key,
      divevent:false
    }
    this.loading[index] = true;
    setTimeout(() => this.loading[index] = false, 1000);
    
    //this.router.navigate(['/work/add-edit-employee/' + this.searchedvisitor.value]);
    this.onSearchEvent.emit(params);
  }
 
}
