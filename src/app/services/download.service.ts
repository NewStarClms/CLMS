import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  downloadPDF(cols, rows, filename, reportHeading) {
    var reportName = filename + '.pdf';
    let pdfDoc = new jsPDF();
    pdfDoc.text(reportHeading, 20, 10);
    autoTable(pdfDoc, {
      columns: cols,
      body: rows,
    });
    //let finalY = pdfDoc.eh; //this gives you the              value of the end-y-axis-position of the previous autotable.
    //doc.text(“Text to be shown relative to the table”, 12, finalY + 10);
    pdfDoc.save(reportName);
  }

  downloadExcel(header, rows, filename) {
    var reportName = filename + '.xlsx';
    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, header);
    XLSX.utils.sheet_add_json(ws, rows, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, reportName);
  }

  downloadCSV(columns: Array<string>, rows: any, fileName: string): void {
    let csvData = this.ConvertToCSV(rows, columns,',');
    let CSV_TYPE = 'text/csv;charset=utf-8;';
    let blob = new Blob(['\ufeff' + csvData], {
      type: CSV_TYPE,
    });
    FileSaver.saveAs(
      blob,
      fileName + '.csv'
    );
  }

  downloadTXT(columns: Array<string>, rows: any, fileName: string): void {
    let formattedData = this.ConvertToCSV(rows, columns,'#~#', false);
    let CSV_TYPE = 'text/plain;charset=utf-8;';
    let blob = new Blob(['\ufeff' + formattedData], {
      type: CSV_TYPE,
    });
    FileSaver.saveAs(
      blob,
      fileName + '.txt'
    );
  }

  ConvertToCSV(objArray, headerList, separator, bindHeader:boolean=true) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let propertyNames=Object.getOwnPropertyNames(array[0]);
    let str = '';
    let row = '';
    if(bindHeader){
      for (let index in headerList) {
        row += headerList[index] + separator;
      }
      row = row.slice(0, separator.length * -1);
      str += row + '\r\n';
    }
    
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        line +=  array[i][propertyNames[index]] + separator ;
      }
      line = line.slice(0, separator.length * -1);
      str += line + '\r\n';
    }
    return str;
  }
}
