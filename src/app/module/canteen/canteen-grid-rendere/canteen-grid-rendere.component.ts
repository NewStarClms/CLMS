import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AppUtil } from '../../../common/app-util';
import { BusinessTypeService } from 'src/app/services/business-type.service';
import { Table } from 'primeng/table';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { PageInfo } from 'src/app/store/model/pageinfo.model';


@Component({
  selector: 'app-canteen-grid-rendere',
  templateUrl: './canteen-grid-rendere.component.html',
  styleUrls: ['./canteen-grid-rendere.component.scss']
})
export class CanteenGridRendereComponent {
  public columnDefs!: any[];
  public totalRows:number;
  public isLazyLoad: boolean =false;
  params:any;
  selectedRows:any[];
  label!: string;
  saveClass?:string;
  delClass?:string;
  editClass?:string;
  public rowData:any[];
  public gridStyle: string;
  public defaultColDef;
  public loadingCellRenderer;
  public loadingCellRendererParams;
  public grobleFilterColField: Array<string> = [];
  public gridRowDataTemp:any;
  public pagination:boolean=true;
  first = 0;
  rows = 5;
  searchKeyword: string ="";
  @Input() gridRowData: Array<any>;
  @Input() gridColData: any[];
  @Input() totalRecords: number;
  @Input() isLazyLoadingEnabled: boolean;
  @Input() isPaginationRequired: boolean = true;
  @Input() hideSearchBox: boolean = false;
  @ViewChild('dt') dt: Table | undefined;

  editType: string;
  @Output() onCellClickEvent = new EventEmitter<any>();
  @Output() onRowStartEdit = new EventEmitter<any>();
  @Output() onRowStopEdit = new EventEmitter<any>();
  @Output() onCheckAllClicked = new EventEmitter<any>();
  @Output() onCheckRowClicked = new EventEmitter<any>();
  // @Output() mapAccessRight = new EventEmitter<any>();
  @Output() onLazyLoadGridData = new EventEmitter<any>();
  constructor( private businessService: BusinessTypeService) {
    this.loadingCellRenderer = 'customLoadingCellRenderer';
    this.loadingCellRendererParams = { loadingMessage: 'One moment please...' };
    this.defaultColDef = {
      sortingOrder: ["asc", "desc"],
      stopEditingWhenGridLosesFocus: false,
      sortable:true,
      suppressKeyboardEvent: event => {
        if (!event.editing || event.event.code === "Enter")
          return true;
          return false;
      }
  };
   }

   ngOnInit(): void {
    this.rowData = AppUtil.deepCopy(this.gridRowData);
    this.columnDefs = this.gridColData;
    this.totalRows=this.totalRecords;
    this.isLazyLoad=this.isLazyLoadingEnabled;
    this.columnDefs.map(item => {
      if(item.filter){
      this.grobleFilterColField.push(item.field);
      }
    })
    this.editType = "fullRow";
    if(this.rowData.length == 0 || !this.isPaginationRequired){
      this.pagination= false;
    } else{
      this.pagination =true;
    }
  }
  applyFilterGlobal($event: any) {
  
    this.searchKeyword = $event.target.value;
    return $event.target.value;
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.gridRowData){
        const gridRowData = AppUtil.deepCopy(changes.gridRowData.currentValue);
        this.gridRowDataTemp = AppUtil.deepCopy(gridRowData);
        this.rowData = gridRowData;
        this.totalRows=this.totalRecords;
        this.isLazyLoad=this.isLazyLoadingEnabled;
        if(this.rowData.length == 0  || !this.isPaginationRequired){
          this.pagination= false;
        } else{
          this.pagination =true;
        }
    }
    if(changes.gridColData){
      const gridColumns = AppUtil.deepCopy(changes.gridColData.currentValue);
      this.columnDefs=gridColumns;
    }
  }

checkUncheckAll(chbSelectAll: any) {
  this.rowData.map((obj)=>
   obj.isSelected = chbSelectAll.checked
  );
  this.onCheckAllClicked.emit(chbSelectAll);
}
checkUnCheckRow(rowindex: any,checkbox: any){
  let params: any ={
    data : AppUtil.deepCopy(rowindex),
    isSelected: checkbox.checked
  }
  this.onCheckRowClicked.emit(params);
  
}
onCellClicked(rowindex,action) {
  let params: any ={
    data : AppUtil.deepCopy(rowindex),
    column: { colId: UI_CONSTANT.ACTIONS.ACTION},
    event:{
      path:[
        {
          dataset:
          {
            action:'actionType'
          }
        },
        {
          dataset:
          {
            action:action
          }
        }
      ]
    }
  }
  this.onCellClickEvent.emit(params);
}

  cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }
  paginate(event) {
    this.first = event.first;
  }

  isLastPage(): boolean {
    return this.rowData ? this.first === (this.rowData.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.rowData ? this.first === 0 : true;
  }

  lazyLoadGridData(event){
    const pager : PageInfo ={
      pageSize:event.rows,
      pageNumber:(event.first/event.rows)+1,
      searchKeyword: this.searchKeyword,
      orderBy : event.sortField?event.sortField:"1",
      orderDirection: event.sortOrder==1? 'asc': 'desc'
    }
    this.onLazyLoadGridData.emit(pager);
  }
}
