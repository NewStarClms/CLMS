import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IListBoxItem, IItemsMovedEvent } from '../dual-list-box';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-drag-drop-dual-list',
  templateUrl: './drag-drop-dual-list.component.html',
  styleUrls: ['./drag-drop-dual-list.component.scss'],
})
export class DragDropDualListComponent {
  availableItems: Array<IListBoxItem> = [];
  selectedItems: Array<IListBoxItem> = [];
  listBoxForm: FormGroup;
  public displayRename = false;
  container:CdkDragDrop<IListBoxItem[]> = null;
  public colEntity:{text:string,value:string} = {} as {text:string,value:string} ;
  columnName: any;

  @Output() selectedColumns:Array<IListBoxItem> = [];
  // array of items to display in left box
  @Input() set availables(items: Array<{}>) {
    this.availableItems = [...(items || []).map((item: {}, index: number) => ({
      value: item[this.valueField],
      text: item[this.textField],
    }))];
  }
  // array of items to display in right box
  @Input() set selects(items: Array<{}>) {
    this.selectedItems = [...(items || []).map((item: {}, index: number) => ({
      value: item[this.valueField],
      text: item[this.textField],
    }))];
  }
  // field to use for value of option
  @Input() valueField = 'id';
  // field to use for displaying option text
  @Input() textField = 'name';
  // text displayed over the available items list box
  @Input() availableText = 'Columns';
  // text displayed over the selected items list box
  @Input() selectedText = 'Selected Columns';
  // set placeholder text in available items list box
  @Input() availableFilterPlaceholder = 'Filter...';
  // set placeholder text in selected items list box
  @Input() selectedFilterPlaceholder = 'Filter...';

  // event called when items are moved between boxes, returns state of both boxes and item moved
  @Output() itemsMoved: EventEmitter<IItemsMovedEvent> = new EventEmitter<IItemsMovedEvent>();
  @Output() onSelect  = new EventEmitter<IListBoxItem[]>();
  constructor(public fb: FormBuilder) {

    this.listBoxForm = this.fb.group({
      availableSearchInput: [''],
      selectedSearchInput: [''],
    });
  }

  drop(event: CdkDragDrop<IListBoxItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.container = event;
    // clear marked available items and emit event
    this.itemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: event.container.data.filter((v, i) => i === event.currentIndex),
      from: 'available',
      to: 'selected',
    });
  }

  updateAction(item,event){
    this.colEntity.value = item.value;
    this.colEntity.text = item.text;
    console.log(item.value,this.selectedItems);
    this.displayRename=true;
  }

  updateName(){
    this.displayRename = false;
    const index = this.selectedItems.findIndex(v=> v.value === this.colEntity.value);
    this.selectedItems[index].text = this.colEntity.text;
    this.itemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: this.container?.container?.data?.filter((v, i) => i === this.container.currentIndex),
      from: 'available',
      to: 'selected',
    });
    this.selectedItems;
    console.log(this.selectedItems,'col');
    // this.colEntity = null;
  }

  cancelPopup(){
    this.displayRename = false;
    // this.colEntity = null;
  }

}
