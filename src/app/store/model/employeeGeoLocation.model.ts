export interface employeeGeoLocation {
    employeeID:number,
    locations:Array<employeeGeoLocationModel>
   }
   
   export interface employeeGeoLocationModel {
       employeeGeoLocationId:number,
       employeeID:number,
       latitude: number,
       longitude:number,
       locationAddress:string,
       starDate:string,
       endDate:string,
       geoRadius:number
   }
   
   export interface EmployeeGeoLocationModelList {
       latitude: number,
       longitude:number,
       locationAddress:string,
       starDate:string,
       endDate:string,
       geoRadius:number
   }