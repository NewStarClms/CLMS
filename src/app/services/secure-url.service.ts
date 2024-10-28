import { Injectable } from "@angular/core";
import { AppUtil } from "../common/app-util";
import { UI_CONSTANT } from "../common/constants/ui-constants";

@Injectable({
    providedIn: 'root'
  })
  export class SecureURLService {
      constructor(){

      }

      generateSecureURLs(model: any, columnName: string | Array<string>): any;
      generateSecureURLs(arr: Array<any>, columnNames: string | Array<string>) : Array<any>{
        const token:string = JSON.parse(localStorage.getItem(UI_CONSTANT.ConstValue.CurrentUser))?.accessToken;
          if(arr){
              if(columnNames){
                  let columns=[];
                  let rows=AppUtil.deepCopy(arr);
                 if(!Array.isArray(columnNames)) columns.push(columnNames);
                 if(!Array.isArray(rows)) rows=Array.from<any>(rows);
                 rows.forEach((row)=>{
                   columns.forEach((col)=>{
                    if(row[col])
                       row[col]=row[col]+"?token="+token;
                   })
                 });
                 return rows
              }
          }
         return arr;
      }

      appendSecurityToken(documentURL: string){
        if(documentURL){
          const token:string = JSON.parse(localStorage.getItem(UI_CONSTANT.ConstValue.CurrentUser))?.accessToken;
          return documentURL+"?token="+token;
        }
        return "";
      }
  }