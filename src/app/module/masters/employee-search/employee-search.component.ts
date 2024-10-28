import { Component, EventEmitter, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppUtil } from 'src/app/common/app-util';
import { AppSearchCommonService } from 'src/app/services/app-search.common.service';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.scss']
})
export class EmployeeSearchComponent implements OnInit {
  loading = [false, false, false, false]
  filteredList: any[];
  employeeSerchList:any[];
  searchedEmployee:{key:string, value:string};
  
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
  searchData(event) {
    this.appSearchService.getFilteredEmployee(event.query).subscribe(data => {
      if(data && data.searchData){
      this.employeeSerchList = data.searchData;
      }
    });
  }
  loadDetails(index) {
    // console.log('event',this.searchedEmployee);
    this.loading[index] = true;
    setTimeout(() => this.loading[index] = false, 1000);
    // this.empdetailList.next(this.searchedEmployee);
    // this.router.navigate(['/work/add-edit-employee/' + this.searchedEmployee.value]);
    if(this.searchedEmployee){
      let params:any ={
        data : this.searchedEmployee.value,
        column: this.searchedEmployee.key
      }
      this.onSearchEvent.emit(params);
    }
   
    
  }
}
