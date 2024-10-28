import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editable-cell-renderer',
  templateUrl: './editable-cell-renderer.component.html',
  styleUrls: ['./editable-cell-renderer.component.scss']
})
export class EditableCellRendererComponent implements OnInit {
  params: any;
  buttonEditableText!: any;
  isGroupNode!: boolean;
  isNew = true;
  previousData: any;
  public isCurrentRowEditing=false;
  

  agInit(params: any): void {
    this.params = params;
    this.isGroupNode = params.node.group;
    if (!this.isGroupNode) { this.buttonEditableText = params.node.data.editable === true ? 'disable' : 'enable'; }
    
  
  }

  ngOnInit() {
    let editingCells =  this.params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  this.isCurrentRowEditing = editingCells.some((cell) => {
    return cell.rowIndex ===  this.params.node.rowIndex;
  });
  }

  public invokeParentMethod() {
    this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`)
  }

  refresh(): boolean {
    let editingCells =  this.params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  this.isCurrentRowEditing = editingCells.some((cell) => {
    return cell.rowIndex ===  this.params.node.rowIndex;
  });
    return true;
  }

  onEditClick() {
    const index = this.params.node.rowIndex;
    this.params.cancelOtherRowEditors(this.params);
    this.isNew = false;
    this.previousData = JSON.parse(JSON.stringify(this.params.node.data));
    let cols = this.params.columnApi.getAllGridColumns();
    let firstCol = {
      "colId": ""
    }
    if (cols) {
      firstCol = cols[0];
    }
    let rowIndex = this.params.node.rowIndex;
    this.params.api.setFocusedCell(rowIndex, firstCol.colId);
    this.params.api.startEditingCell({
      rowIndex: rowIndex,
      colKey: firstCol.colId
    });
  }

  onUpdateClick() {
    this.isNew = true;
    let obj: any = {};
    obj.type = "update";
    this.params.api.stopEditing(true);
    obj.selectedData = [this.params.data];
    // update logic ....
  }

  public onCancelClick() {
    this.isNew = true;
    this.params.node.setData(this.previousData);
    this.params.api.stopEditing(true);
  }

  onDeleteClick() {
    const selectedData = [this.params.node.data];
    console.log(selectedData);
    this.params.api.applyTransaction({ remove: selectedData });
  }
}
