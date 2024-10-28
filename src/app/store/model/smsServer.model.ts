export interface smsServerModel {
    smsServerList: smsServer[]
  }
  
export interface smsServer {
    "smsApi": string  | null,
    "senderID": string | null,
    "smsUserName": string | null,
    "userPassword": string | null
}