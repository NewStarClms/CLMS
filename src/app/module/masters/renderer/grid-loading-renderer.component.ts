import { Component } from '@angular/core';
import { ILoadingCellRendererAngularComp } from 'ag-grid-angular';
import { ILoadingCellRendererParams, ILoadingCellRenderer } from 'ag-grid-community';

@Component({
  selector: 'app-loading-cell-renderer',
  template: `
    <div
      class="ag-custom-loading-cell"
      style="padding-left: 10px; line-height: 25px;"
    >
      <i class="fas fa-spinner fa-pulse"></i>
      <span> Please wait .... </span>
    </div>
  `,
})
export class GridLoadingLoadingCellRenderer  implements ILoadingCellRendererAngularComp {
  private params: any;

  agInit(params: ILoadingCellRendererParams): void {
    this.params = params;
  }
}